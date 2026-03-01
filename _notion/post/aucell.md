> 目标：基于 AUCell 对单细胞表达矩阵计算基因集打分，完成阈值探索、细胞指派与可视化；整理为可复用的脚本骨架。
> 

---

## 0. 环境与依赖

- R ≥ 4.2；建议使用 renv/conda 固定版本。
- 主要包：`AUCell`, `GSEABase`, `Matrix`, `data.table`/`readr`, `NMF`, `DT`, `Rtsne`。

```r
# 核心依赖
packages <- c(
  "AUCell", "GSEABase", "Matrix", "data.table", "NMF", "DT", "Rtsne"
)
for(p in packages){ if(!requireNamespace(p, quietly=TRUE)) install.packages(p) }

# Bioconductor 包（若需）
if (!requireNamespace("BiocManager", quietly=TRUE)) install.packages("BiocManager")
if (!requireNamespace("GSEABase", quietly=TRUE)) BiocManager::install("GSEABase")

```

> 可选：evanverse 为自定义工具箱；如未安装，请按需注释相关行。
> 

---

## 1. 数据读取与预处理

```r
library(AUCell)
library(GSEABase)
library(Matrix)
library(data.table)

# 1) 读取表达矩阵（第一列为基因名，其余为细胞）
expr_dt <- data.table::fread("GSE60361_C1-3005-Expression.txt.gz")

# 2) 抽取行名并转为矩阵
geneNames <- unname(unlist(expr_dt[, 1, with = FALSE]))
expr_mat <- as.matrix(expr_dt[, -1, with = FALSE])
rownames(expr_mat) <- geneNames

# 3) 去重（保留首次出现；或聚合为和/均值）
expr_mat <- expr_mat[!duplicated(rownames(expr_mat)), ]

# 4) 稀疏化
expr_mat <- as(expr_mat, "dgCMatrix")

# 5) 可选抽样（演示用）
set.seed(333)
mouseBrainExprMatrix <- expr_mat
expr_mat <- mouseBrainExprMatrix[sample(rownames(mouseBrainExprMatrix), 5000), ]

```

**检查点**

```r
dim(expr_mat)
expr_mat[1:5, 1:4]

```

> 备注：对真实分析通常不建议随意抽样基因；此处为 vignette 演示。
> 

---

## 2. 基因集（GeneSetCollection）准备

### 2.1 读取示例 GMT 并裁剪到当前矩阵基因名

```r
# AUCell 自带示例 GMT
gmt_file <- file.path(system.file('examples', package='AUCell'), "geneSignatures.gmt")

# 读取到 GeneSetCollection
geneSets <- getGmt(gmt_file)

# 仅保留表达矩阵包含的基因
geneSets <- subsetGeneSets(geneSets, rownames(expr_mat))

# 可读性重命名：附带基因数
geneSets <- setGeneSetNames(
  geneSets,
  newNames = paste(names(geneSets), " (", nGenes(geneSets), "g)")
)

```

### 2.2 追加自定义基因集

```r
set.seed(321)
# 随机基因集示例
extraGeneSets <- c(
  GeneSet(sample(rownames(expr_mat), 50),  setName="Random (50g)"),
  GeneSet(sample(rownames(expr_mat), 500), setName="Random (500g)")
)

# HK-like：表达为非零的细胞数位于顶端分位的基因中随机取 100 个
countsPerGene <- Matrix::rowSums(expr_mat > 0)
hk_pool <- names(countsPerGene)[countsPerGene > quantile(countsPerGene, probs=.95)]
extraGeneSets <- c(extraGeneSets, GeneSet(sample(hk_pool, 100), setName="HK-like (100g)"))

# 合并为 GeneSetCollection
geneSets <- GeneSetCollection(c(geneSets, extraGeneSets))

```

**检查点**

```r
length(geneSets)
head(names(geneSets))
sapply(geneSets, length)[1:5]

```

---

## 3. AUCell：两种常用调用方式

### 3.1 一步法（快捷）

```r
cells_AUC <- AUCell_run(expr_mat, geneSets)

```

### 3.2 两步法（可控）

```r
cells_rankings <- AUCell_buildRankings(expr_mat, plotStats = FALSE)
cells_AUC2     <- AUCell_calcAUC(geneSets, cells_rankings)
# 建议统一使用 cells_AUC <- cells_AUC2
cells_AUC <- cells_AUC2

```

> buildRankings 会按每个细胞对基因表达排序，calcAUC 基于排名窗口计算 AUC。
> 

---

## 4. 结果与阈值探索

### 4.1 每个细胞的基因数（非零表达）

```r
# 快速查看每细胞检测到的基因数分布
AUCell::plotGeneCount(expr_mat)

```

### 4.2 阈值探索与指派

```r
set.seed(333)
cells_assignment <- AUCell_exploreThresholds(cells_AUC, plotHist = TRUE, assign = TRUE)

# 查看阈值警告信息（如 AUC 分布异常等）
warningMsg <- sapply(cells_assignment, function(x) x$aucThr$comment)
warningMsg[warningMsg != ""]

# 示例：获取某个基因集的阈值与结果（以 Oligodendrocyte_Cahoy 为例）
# 实际名称需与 geneSets 中一致，可用 grep 搜索
olig_key <- grep("Oligodendrocyte_Cahoy", rownames(cells_AUC), value = TRUE)[1]
cells_assignment[[olig_key]]$aucThr$thresholds
cells_assignment[[olig_key]]$aucThr$selected

# AUC 直方图 + 手动阈值参考
AUCell_plotHist(cells_AUC[olig_key, ], aucThr = 0.25); abline(v = 0.25)

# 基于手动阈值选细胞
new_sel <- names(which(getAUC(cells_AUC)[olig_key, ] > 0.08))
length(new_sel); head(new_sel)

```

### 4.3 汇总细胞指派矩阵与展示

```r
# 列表到长表
cellsAssigned <- lapply(cells_assignment, `[[`, "assignment")
assignmentTable <- reshape2::melt(cellsAssigned, value.name = "cell")
colnames(assignmentTable)[2] <- "geneSet"

# 宽表（基因集 × 细胞）
assignmentMat <- table(assignmentTable[,"geneSet"], assignmentTable[,"cell"])

# 子集热图（演示 100 细胞）
set.seed(123)
miniAssigMat <- assignmentMat[, sample(seq_len(ncol(assignmentMat)), 100)]
NMF::aheatmap(miniAssigMat, scale = "none", color = "black", legend = FALSE)

# 交互表
DT::datatable(assignmentTable, options = list(pageLength = 10), filter = "top")

```

---

## 5. t-SNE / 低维可视化与着色

### 5.1 计算 t-SNE（或直接加载示例坐标）

```r
# 若无 AUCell 自带 tSNE，可自算
sumByGene <- Matrix::rowSums(mouseBrainExprMatrix)
expr_nonzero <- mouseBrainExprMatrix[sumByGene > 0, ]
logMatrix <- log2(as.matrix(expr_nonzero) + 1)

set.seed(123)
tsne_fit <- Rtsne::Rtsne(t(logMatrix))
cellsTsne <- tsne_fit$Y
rownames(cellsTsne) <- colnames(logMatrix)
colnames(cellsTsne) <- c("tsne1", "tsne2")
# 保存以便复用
save(cellsTsne, file = "cellsTsne.RData")

# 快速散点
plot(cellsTsne, pch = 16, cex = .3)

```

### 5.2 按 AUC 阈值着色（多基因集批量）

```r
selectedThresholds <- getThresholdSelected(cells_assignment)

par(mfrow = c(2,3))
for (gs in head(names(selectedThresholds), 6)) {
  thr <- selectedThresholds[gs]
  pass <- getAUC(cells_AUC)[gs, ] > thr
  if(sum(pass) > 0){
    nBreaks <- 5
    col_neg <- grDevices::colorRampPalette(c("black","blue","skyblue"))(nBreaks)
    col_pos <- grDevices::colorRampPalette(c("pink","magenta","red"))(nBreaks)
    aucSplit <- split(getAUC(cells_AUC)[gs, ], pass)
    cellColor <- c(
      setNames(col_neg[cut(aucSplit[[1]], breaks = nBreaks)], names(aucSplit[[1]])),
      setNames(col_pos[cut(aucSplit[[2]], breaks = nBreaks)], names(aucSplit[[2]]))
    )
    plot(cellsTsne, main = gs, sub = "Pink/red cells pass the threshold",
         col = cellColor[rownames(cellsTsne)], pch = 16)
  }
}

# 或使用 AUCell 自带绘图（示例仅两条）
selectedThresholds[2] <- 0.25
par(mfrow=c(2,3))
AUCell_plotTSNE(tSNE = cellsTsne, exprMat = expr_mat,
                cellsAUC = cells_AUC[1:2, ], thresholds = selectedThresholds)

```

---

## 6. 可复用包装：一键运行接口

```r
run_aucell_pipeline <- function(expr_mat, geneSets, do_tsne = TRUE, seed = 123){
  stopifnot(inherits(expr_mat, "dgCMatrix"))
  set.seed(seed)
  cells_rank <- AUCell_buildRankings(expr_mat, plotStats = FALSE)
  cells_auc  <- AUCell_calcAUC(geneSets, cells_rank)
  res <- list(cells_rankings = cells_rank, cells_AUC = cells_auc)

  if(do_tsne){
    sumByGene <- Matrix::rowSums(expr_mat)
    expr_nonzero <- expr_mat[sumByGene > 0, ]
    logMatrix <- log2(as.matrix(expr_nonzero) + 1)
    tsne_fit <- Rtsne::Rtsne(t(logMatrix), check_duplicates = FALSE)
    Y <- tsne_fit$Y
    rownames(Y) <- colnames(logMatrix)
    colnames(Y) <- c("tsne1", "tsne2")
    res$cellsTsne <- Y
  }
  return(res)
}

# 使用示例
# out <- run_aucell_pipeline(expr_mat, geneSets)
# str(out)

```

---

## 7. 常见坑位与建议

- **行名重复**：需去重或聚合（如对同一基因求和/均值）；示例采用去重保留第一条。
- **稀疏化**：务必转为 `dgCMatrix`，可显著节省内存并提升 AUCell 速度。
- **基因集覆盖率**：`subsetGeneSets` 先裁剪，避免基因集几乎为空导致阈值异常。
- **阈值选择**：同时查看直方图与 UMAP/tSNE 空间分布，必要时手动设阈值并记录。
- **随机性**：涉及采样与 tSNE，固定 `set.seed` 确保可复现。
- **可视化**：在大数据集上优先抽样展示，避免绘图卡顿。

---

## 8. 最小可运行示例（MRE）

```r
# 假设已得到 expr_mat (dgCMatrix) 与 geneSets (GeneSetCollection)
set.seed(1)
rankings <- AUCell_buildRankings(expr_mat, plotStats=FALSE)
auc <- AUCell_calcAUC(geneSets, rankings)
sel <- AUCell_exploreThresholds(auc, plotHist=TRUE, assign=TRUE)
selectedThresholds <- getThresholdSelected(sel)

```

---

## 9. 会话信息（便于复现）

```r
sessionInfo()

```

---

### 附：与原始脚本差异/改进点

1. 统一使用 `expr_mat` 命名；显式去重策略。
2. `Matrix::rowSums(expr_mat > 0)` 代替 `apply`，更快。
3. `grep` 时用 `value = TRUE` 返回名称，避免索引错位。
4. 将绘图与阈值探索封装为批处理循环，便于扩展。
5. 提供 `run_aucell_pipeline()` 便于一键复用。
