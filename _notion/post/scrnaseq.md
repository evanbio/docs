## 📌 简介

`scRNAseq` 是 Bioconductor 提供的一个数据包，专门收录了多个整理好的 **单细胞转录组测序（scRNA-seq）公共数据集**。

它不包含任何分析函数，主要用于：

- 单细胞分析入门
- 测试新方法
- 作为教学和演示用数据来源

返回对象通常为 **`SingleCellExperiment`** 类，可直接与 **`scater`**、**`Seurat`** 等分析工具结合使用。

---

## 📦 数据来源与内置数据集

该包将原始公共数据集整理为统一格式，目前常用的有：

- `ZeiselBrainData()` — 小鼠脑细胞转录组
- `MacoskoRetinaData()` — 视网膜细胞转录组
- `PaulHSCData()` — 造血干细胞转录组
- 其他数据集可通过 `help(package="scRNAseq")` 查看完整列表

---

## 🚀 快速上手示例

```r
library(scRNAseq)

# 加载 Zeisel 小鼠脑数据
se <- ZeiselBrainData()

# 查看对象结构
se

```

运行结果将返回一个 **SingleCellExperiment** 对象，可直接用于下游分析和可视化。

---

## 🔗 参考链接

- [Bioconductor: scRNAseq 包主页](https://bioconductor.org/packages/scRNAseq)

---

## 📝 备注

- 该包仅作为数据来源，不提供差异分析、降维、聚类等功能。
- 加载的数据可无缝衔接到 `scater`、`scran`、`Seurat` 等 R 包中。
