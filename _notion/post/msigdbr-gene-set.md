> 简介
> 
> 
> `msigdbr` 是 R 语言中访问 [MSigDB](https://www.gsea-msigdb.org/gsea/msigdb)（Molecular Signatures Database）基因集的利器，提供了基于物种、集合（collection）和子集合（subcollection）的灵活筛选与下载接口。本篇演示从安装到常见操作，教你如何快速拿到自己需要的基因集。
> 

---

## 1. 安装与加载

```r
# 安装（若尚未安装）
# install.packages("msigdbr")

# 加载包
library(msigdbr)
```

---

## 2. 下载所有小鼠（Mus musculus）基因集

```r
# 获取 Mus musculus 全部 gene sets
all_gene_sets <- msigdbr(species = "Mus musculus")

# 查看前几行，包含基因集名称、基因 ID、子集合等信息
head(all_gene_sets)
```

- `species` 可以写全名（"Mus musculus"）或缩写（"mouse"）。

---

## 3. 只看 Hallmark (H) 基因集

```r
# 仅下载 Hallmark 集合（collection = "H"）
h_gene_sets <- msigdbr(
  species    = "mouse",
  collection = "H"
)

head(h_gene_sets)
```

- Hallmark 基因集用于捕捉信号通路的核心“高置信度”基因模式。

---

## 4. 统计每个 Hallmark 基因集的基因数

```r
# 统计每个 gs_name（基因集）包含的基因数量
table(h_gene_sets$gs_name)
```

---

## 5. 查看 C2:CGP（化合物与基因署名）子集合

```r
cgp_gene_sets <- msigdbr(
  species       = "mouse",
  collection    = "C2",
  subcollection = "CGP"
)

head(cgp_gene_sets)
```

- `collection="C2"` 涵盖化合物、基因敲除/过表达署名等多种子集，通过 `subcollection` 精确挑选。

---

## 6. 探索元信息

```r
# 查看当前下载的 MSigDB 数据库版本
all_gene_sets$db_version

# 支持哪些物种
msigdbr_species()

# 支持哪些主集合（collection）
msigdbr_collections()

# 查看所有子集合及其频次
table(all_gene_sets$gs_subcollection)
```

---

## 7. 数据规模与快速概览

```r
# 查看对象占用内存
object.size(all_gene_sets)

# 用 skimr 快速给出列结构和缺失值等信息
library(skimr)
skim(all_gene_sets)
```

- `object.size()` 帮你评估内存占用，决定是否需要拆分下载。
- `skim()` 则可一键了解每列类型、非空率及分布。

---

> 小结
> 
> - `msigdbr` 强大且易用，只需 `msigdbr()` 一步，即可获取丰富的 MSigDB 基因集。
> - 通过 `collection` 与 `subcollection` 参数，可精准拿到自己研究需要的信号通路与基因署名。
> - 配合 `dplyr`/`table`/`skimr` 等工具，能快速统计、筛选与探索数据集。
