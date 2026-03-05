`pivot_longer()` 是 **`tidyr`** 中将多列“压缩”为两列（变量名列 + 值列）的核心函数，它能将数据转换为“tidy 格式”，非常适合后续可视化、建模或汇总分析。

---

## 1. 函数原型

```r
pivot_longer(
  data,
  cols,
  names_to      = "name",
  values_to     = "value",
  names_prefix  = NULL,
  names_sep     = NULL,
  names_pattern = NULL,
  values_drop_na = FALSE
)

```

| 参数 | 说明 |
| --- | --- |
| `data` | 输入的宽格式数据框 |
| `cols` | 要“拉长”的列（可用列名、范围、或 `select()` 语法指定） |
| `names_to` | 新生成的“变量名”列的列名，默认 `"name"` |
| `values_to` | 新生成的“值”列的列名，默认 `"value"` |
| `names_prefix` | 去除原列名中的前缀（`stringr::str_remove()`） |
| `names_sep` | 按分隔符拆分列名，生成多个新列（等同于 `names_to = c(...)`, `names_sep = "_"`） |
| `names_pattern` | 按正则表达式拆分列名（捕获组决定拆分后新列），通常与 `names_to = c(...)` 配合使用 |
| `values_drop_na` | 是否删除 `NA` 值的行（默认 `FALSE`：保留所有组合） |

---

## 2. 基础示例

### 示例数据

```r
library(tidyr)
library(dplyr)

df <- tibble(
  id     = 1:3,
  gene_A = c(10, 20, 30),
  gene_B = c(15, 25, 35)
)

```

### 2.1 将 `gene_A` 和 `gene_B` 拉长

```r
pivot_longer(
  df,
  cols       = c(gene_A, gene_B),
  names_to   = "gene",
  values_to  = "expression"
)

```

**输出**

| id | gene | expression |
| --- | --- | --- |
| 1 | gene_A | 10 |
| 1 | gene_B | 15 |
| 2 | gene_A | 20 |
| … | … | … |

---

## 3. 辅助选择

利用 `select()` 语法，快速选择一组列：

```r
pivot_longer(
  df,
  cols      = starts_with("gene"),
  names_to  = "gene",
  values_to = "expression"
)

```

---

## 4. 列名拆分

当列名中蕴含多个信息时，可拆分为多列：

```r
df2 <- tibble(
  id  = 1:2,
  A_1 = c(5, 6),
  A_2 = c(7, 8),
  B_1 = c(9, 10)
)

pivot_longer(
  df2,
  cols         = -id,
  names_to     = c("type", "replicate"),
  names_sep    = "_",
  values_to    = "value"
)

```

**输出**

| id | type | replicate | value |
| --- | --- | --- | --- |
| 1 | A | 1 | 5 |
| 1 | A | 2 | 7 |
| 1 | B | 1 | 9 |
| … | … | … | … |

---

## 5. 正则拆分

使用正则捕获组更灵活：

```r
pivot_longer(
  df2,
  cols          = -id,
  names_to      = c("type", "replicate"),
  names_pattern = "([A-Z])_(\\d)",
  values_to     = "value"
)

```

---

## 6. 去除缺失值

当部分组合不存在时，可删除 `NA` 行：

```r
pivot_longer(
  df2,
  cols           = -id,
  names_to       = c("type", "replicate"),
  names_sep      = "_",
  values_to      = "value",
  values_drop_na = TRUE
)

```

---

## 7. 使用建议

- **可视化前**：将宽表拉成长表后，便可直接用 `ggplot(aes(color = gene)) + geom_line(aes(x = id, y = expression))`
- **模型输入**：许多建模工具都要求“长格式”或“一行一观测”
- **分组拆分**：结合 `names_sep`/`names_pattern`，快速从列名提取元信息
- **与 `pivot_wider()` 对应**：二者配合，可在多表连接和数据 reshape 间自由切换

---

> 总结
> 
> 
> `pivot_longer()` 是实现“tidy data” 的重要一环。无论是简单合并多列，还是复杂拆分列名，它都能让数据变得整洁，后续分析流程更顺畅！
>
