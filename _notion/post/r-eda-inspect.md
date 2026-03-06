## 1. table：分类变量频数统计

```r
table(x)
# 返回x中每个唯一值的出现次数（频数）
table(c('A', 'B', 'A', 'C', 'B', 'A'))
# 结果:
# A B C
# 3 2 1
```

- 常用于查看分组、标签、因子等的分布

---

## 2. glimpse：数据结构速览（dplyr包）

```r
library(dplyr)
glimpse(iris)
# 简要展示每列名称、类型、前几项数据

# Rows: 150
# Columns: 5
# $ Sepal.Length <dbl> 5.1, 4.9, 4.7, ...
# $ Species      <fct> setosa, setosa, ...
```

- 适合数据框、tibble的结构一眼速查
- 比str(df)更美观，信息更丰富

---

## 3. skim：全面数据摘要（skimr包）

```r
library(skimr)
skim(df)
# 给出每列类型、缺失数、唯一值、分布、统计量等全局摘要

# ── Data summary ────────────────────────
# Number of rows: 150 
# Number of columns: 5 
# $Sepal.Length
#   min: 4.3   mean: 5.8   max: 7.9   missing: 0
# ...
# $Species
#   n_unique: 3   top_counts: set: 50, ver: 50, vir: 50
```

- 适合数据探索、项目首轮EDA报告
- 支持分组（如group_by）自动统计子集摘要

---

## 4. 应用场景

- 数据预处理和初步探索（EDA）
- 检查分类变量、分组标签分布
- 变量类型、缺失、极端值、分布一览

---

> 本页可长期补充其它数据结构/分布类速查工具（如str、summary、n_distinct等）。
>
