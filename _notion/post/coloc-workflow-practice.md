## 1. 基础说明

- **coloc**：常用的 summary-level 共定位分析 R 包，适合 GWAS/eQTL/mQTL/pQTL/表型等多组学数据，判断两个信号是否共用同一因果突变。
- 支持**贝叶斯方法** (`coloc.abf`)、**细化分析** (`finemap.abf`)、多信号/多因子场景 (`coloc.susie`)。
- **数据格式要求**极高：建议反复 `check_dataset()`。

---

## 2. 输入数据格式总结

**必备字段**（取决于能否获得 beta，varbeta，sdY...）：

| 字段 | 说明 | 必要性 | 说明 |
| --- | --- | --- | --- |
| `beta` | 效应值 | 推荐 | 必须与 `varbeta` 配合 |
| `varbeta` | 效应值方差 | 推荐 | 若无则需 p/N/MAF 估算 |
| `snp` | SNP 编号 | 必须 | 需与 LD 矩阵对齐 |
| `position` | 染色体位置 | 推荐 | 方便可视化 |
| `type` | “quant” 或 “cc” | 推荐 | 定量/二元性状 |
| `sdY` | 表型标准差 | 推荐 | 若无可用 N/MAF 估算 |
| `MAF` | 次要等位基因频率 | 可选 | 缺 sdY 时必须 |
| `N` | 样本量 | 可选 | 估算效应量时必需 |
| `pvalues` | p 值 | 可选 | 缺 beta/varbeta 时必需 |

**判断逻辑**：

- 有 `beta` 和 `varbeta`，最好；否则需 `pvalues`、`N`、`MAF` 估算。
- 定量型需 `type="quant"`，二元型需 `type="cc"` 且可加 `s`（case 占比）。

---

## 3. 数据检查与最小化格式化流程

```r
library(coloc)
data(coloc_test_data)
attach(coloc_test_data)  # 得到 D1, D2, D3, D4

# 基础最小格式
minimum_data = D1[c("beta","varbeta","snp","position","type","sdY")]
check_dataset(minimum_data)
plot_dataset(minimum_data)

# 仅二元型
minimum_ccdata = D1[c("beta","varbeta","snp","position")]
minimum_ccdata$type = "cc"
check_dataset(minimum_ccdata)

# 没有 sdY，用 MAF/N 估算
nosdY_data = D1[c("beta","varbeta","snp","position","type","N","MAF")]
check_dataset(nosdY_data)

# 没有 beta，只能 pvalues/N/MAF 估算
nobeta_data = D1[c("MAF","snp","position","type","sdY","N")]
nobeta_data$pvalues = pnorm(-abs(D1$beta / sqrt(D1$varbeta))) * 2
check_dataset(nobeta_data)

# 对于二元型变量，需要设置类型和比例
nobeta_ccdata$type="cc" # 声明是 case-control
nobeta_ccdata$s=0.5 # 病例比例，真实数据请写实际数值
```

---

## 4. 数据集可视化与校准

```r
plot_dataset(minimum_data)
# 检查等位基因正负、方向、LD结构
str(D1$LD)  # LD 必须与 snp 顺序对应

# 等位基因方向一致性
par(mfrow=c(1,2))
check_alignment(goodD); text(40,200,"good",col="red",cex=4)
check_alignment(badD)

plot_dataset(D1)
```

---

## 5. 共定位与细化 (fine-mapping)

### 单个信号（经典 abf）

```r
my.res <- coloc.abf(dataset1 = D1, dataset2 = D2)
print(my.res)
# H4 > 0.5 通常认为共定位（同一因果突变）
subset(my.res$results, SNP.PP.H4 > 0.01)
# 取95%置信区间 SNP
o <- order(my.res$results$SNP.PP.H4, decreasing=TRUE)
cs <- cumsum(my.res$results$SNP.PP.H4[o])
w <- which(cs > 0.95)
my.res$results[o,][1:w,]$snp

```

### 灵敏度分析（prior 敏感性）

```r
library(coloc)
my.res <- coloc.abf(dataset1=D1,
                    dataset2=D2,
                    p12=1e-6)
my.res

sensitivity(my.res, rule = "H4 > 0.5")
sensitivity(my.res, rule = "H4 > 3*H3 & H0 < 0.1")

```

---

## 6. 多信号场景：susie 分析

- 如果有 LD 信息、多个因果信号，推荐用 susieR + coloc.susie。

```r
library(coloc)
data(coloc_test_data)
attach(coloc_test_data) ## datasets D1, D2, D3 and D4

par(mfrow=c(2,1))
plot_dataset(D3, main="Dataset D3")
plot_dataset(D4, main="Dataset D4")

my.res <- coloc.abf(dataset1=D3, dataset2=D4)
class(my.res)
my.res

sensitivity(my.res,"H4 > 0.9")

check_dataset(D3,req="LD")
check_dataset(D4,req="LD")

# susie 花费时间更久，用runsusie函数先处理D3成S3后更好
S3=runsusie(D3)
summary(S3) # 找到两个信号，而不是1个

S4=runsusie(D4)
summary(S4) # 只有一个信号

susie.res=coloc.susie(S3,S4)
print(susie.res$summary)

library(susieR)

sensitivity(susie.res,"H4 > 0.9",row=1,dataset1=D3,dataset2=D4)
sensitivity(susie.res,"H4 > 0.9",row=2,dataset1=D3,dataset2=D4)

str(D1$LD)

?susieR::susie_rss
```

---

## 7. 补充

- `coloc.susie` 需要 LD，是 SNP x SNP 方阵，名字与 `snp` 字段严格对齐。
- `finemap.abf()`：对单个数据做信号细化。

---

## 8. 参考与学习资源

- [coloc 官方文档](https://chr1swallace.github.io/coloc/)
- [coloc GitHub](https://github.com/chr1swallace/coloc)
- [susieR 文档](https://stephenslab.github.io/susieR/)
