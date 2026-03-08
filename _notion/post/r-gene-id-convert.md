生信分析几乎每天都要用到“**基因ID批量转换/注释**”——比如 symbol/Ensembl/Entrez ID 互转、获取基因坐标、标准化注释等。这里记录主流R包的基础做法，以及我的evanverse包中更灵活的函数封装。

---

## 1. 常用R包/方法简明汇总

- **biomaRt**：适合Ensembl系列ID和位置等批量注释
- **org.Hs.eg.db/org.Mm.eg.db**：基于AnnotationDbi，本地数据库批量查ID/注释/别名
- **clusterProfiler::bitr()**：广泛用在富集分析/注释互转
- **AnnotationHub**：整合多平台资源（大体量需求）

---

## 2. biomaRt示例：symbol转坐标

```r
library(biomaRt)
ensembl <- useMart("ensembl", dataset = "hsapiens_gene_ensembl")
symbols <- c("AATK", "STAT3")
getBM(
  attributes = c("hgnc_symbol", "chromosome_name", "start_position", "end_position",
                 "band", "strand", "ensembl_gene_id"),
  filters = "hgnc_symbol",
  values = symbols,
  mart = ensembl
)
```

---

## 3. org.*.eg.db用法举例

```r
library(org.Hs.eg.db)
library(AnnotationDbi)
select(org.Hs.eg.db, keys = c("AATK", "STAT3"),
       columns = c("SYMBOL", "ENSEMBL", "ENTREZID", "CHR", "CHRLOC"),
       keytype = "SYMBOL")

```

---

## 4. clusterProfiler::bitr快速转换

```r
library(clusterProfiler)
bitr(c("AATK", "STAT3"), fromType="SYMBOL", toType="ENSEMBL", OrgDb="org.Hs.eg.db")

```

---

## 5. 【推荐】evanverse::convert_gene_id()批量ID转换

实际项目里社区工具各有局限，所以我写了一个通用函数 `convert_gene_id()`，可快速在**symbol/ensembl/entrez**多种ID间互转，支持 character 向量或 data.frame 批量处理，自动加载本地或在线参考表，适配人/鼠常见需求。

**核心优点**：

- 支持向量和数据框，参数灵活
- 自动标准化 symbol（如人类大写，鼠类小写）
- 支持多目标类型、查找速率提示
- 支持保留/过滤未注释项
- 本地优先、在线兜底，安全可控

### 主要参数说明

- `query`: 需转换的向量或数据框
- `from`: 源ID类型，支持"symbol", "ensembl_id", "entrez_id"
- `to`: 目标ID类型，可多个
- `species`: 物种，可选"human"或"mouse"
- `query_col`: 若输入为数据框，指定需转换的列名
- 其它：参考/本地表、是否保留NA、是否预览输出等

### 代码示例

```r
# install.packages("devtools")
devtools::install_github("evanbio/evanverse")

# 载入包
library(evanverse)

# 字符向量批量symbol转Ensembl和Entrez
res <- convert_gene_id(
  query = c("AATK", "STAT3", "TP53"),
  from = "symbol",
  to = c("ensembl_id", "entrez_id"),
  species = "human"
)

# 数据框一列批量互转
res2 <- convert_gene_id(
  query = data.frame(gene = c("AATK", "STAT3")),
  from = "symbol",
  to = "ensembl_id",
  species = "human",
  query_col = "gene"
)

```

**输出会预览匹配数和速率，未匹配可选是否保留或过滤。**

---

## 6. 实际项目建议

- 社区函数（biomaRt/bitr/select）优先，特殊需求优先用自己写的convert_gene_id()，尤其适合高频/批量/需灵活定制的场景。
- 尽量使用标准/唯一ID做主键（Ensembl或Entrez），后续分析与可视化更稳健。
- 注释转换后最好二次去重、检查丢失项。

---

本页持续沉淀和补充所有常见的基因ID/注释互转技巧与踩坑经验。
