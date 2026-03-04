在统计分析的基础阶段，我们经常需要对单个变量的分布、不同变量之间的联合分布进行汇总与可视化。常用方法包括频率表、比例表和列联表。

### 1. 频率表（Frequency Table）

**概念说明**

频率表用于汇总单个分类变量的分布。它包含该变量所有可能取值，以及每个值在数据中出现的次数（频率）或出现的比例（百分比）。

| species | n | % |
| --- | --- | --- |
| Adelie | 152 | 44% |
| Chinstrap | 68 | 20% |
| Gentoo | 124 | 36% |

**R 代码示例**

```r
library(palmerpenguins)
library(dplyr)

# 基础频数统计
penguins |> select(species) |> table()

# 使用 gtsummary 包生成汇总表
library(gtsummary)
penguins |>
  select(species) |>
  tbl_summary()

```

**扩展工具**

`ivo.table` 包和 `gtsummary` 包都可以生成更美观、功能丰富的频率表和比例表。

```r
# 安装ivo.table
inst_pkg("ivo.table","cran")
library(ivo.table)

penguins |>
  select(species) |>
  ivo_table()

```

**参数补充**

- 更换配色和字体：
    
    ```r
    penguins |>
      select(species) |>
      ivo_table(color = "darkred", font = "Garamond", percent_by = "row")
    
    ```
    
- 长表格式（适合变量水平较多时）：
    
    ```r
    penguins |>
      select(species) |>
      ivo_table(long_table = TRUE)
    
    ```
    

---

### 2. 列联表（Contingency Table / Cross-Tabulation）

**概念说明**

列联表用于同时展示两个或多个分类变量之间的联合分布关系，也称为交叉表、交联表。

常用于探索变量之间是否有关联（如卡方检验）。

| species | Biscoe | Dream | Torgersen |
| --- | --- | --- | --- |
| Adelie | 44 | 56 | 52 |
| Chinstrap | 0 | 68 | 0 |
| Gentoo | 124 | 0 | 0 |

**R 代码示例**

```r
# 基础交联表（ftable）
penguins |>
  select(species, island) |>
  ftable()

# 使用 ivo.table 包
penguins |> select(species, island) |> ivo_table()

# 使用 gtsummary 包
penguins |>
  select(species, island) |>
  tbl_summary(by = species)

```

**三元、四元交联表**

| species | island | male | female | missing |
| --- | --- | --- | --- | --- |
| Adelie | Biscoe | 20 | 24 | 0 |
| Adelie | Dream | 28 | 28 | 0 |
| Adelie | Torgersen | 26 | 26 | 0 |
| Chinstrap | Dream | 34 | 34 | 0 |
| Gentoo | Biscoe | 60 | 64 | 0 |

多维交联表可用于展示三个及以上分类变量的联合分布。

```r
# 三元交联表
penguins |> select(sex, species, island) |> ivo_table()

# 排除缺失值
penguins |> select(sex, species, island) |> ivo_table(exclude_missing = TRUE)

# 四元交联表
penguins |> select(sex, species, island, year) |> ivo_table()

```

**gtsummary 三元交联表**

```r
penguins |>
  select(species, sex, island) |>
  tbl_summary(by = species)
```

---

## 总结

- 频率表/比例表适用于单变量分布描述
- 列联表/交联表适用于多变量联合分布和相关性探索
- `ivo.table` 和 `gtsummary` 包可大幅提升表格美观性和功能性
- 多维交联表适合复杂分类数据的可视化与分析
