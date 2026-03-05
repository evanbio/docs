`count()` 是 **`dplyr`** 提供的用于**统计分组频数**的高效函数，本质上等同于 `group_by(...) %>% summarise(n = n())`，但更简洁易用，支持多列分组、降序排序与加权计数。

---

## 1. 函数原型

```r
count(data, ..., sort = FALSE, name = "n", wt = NULL)
```

| 参数 | 含义 |
| --- | --- |
| `data` | 输入数据框 |
| `...` | 一个或多个分组变量 |
| `sort` | 是否按频次降序排列（`TRUE`：最高频先显示） |
| `name` | 结果频次数量列名称（默认 `"n"`） |
| `wt` | 权重变量：对该列求和而非行数，用于加权计数 |

---

## 2. 示例演示

先准备示例数据：

```r
library(dplyr)
df <- tibble(
  name  = c("Alice", "Bob", "Alice", "Alice", "Bob", "Charlie"),
  score = c(90, 85, 90, 92, 88, 91)
)

```

### 2.1 按单列计数

统计每个 `name` 的出现次数：

```r
count(df, name)
```

| name | n |
| --- | --- |
| Alice | 3 |
| Bob | 2 |
| Charlie | 1 |

---

### 2.2 多列组合计数

统计每种 `(name, score)` 的组合次数：

```r
count(df, name, score)
```

---

### 2.3 加权计数

将 `score` 作为权重，对每个 `name` 求 `score` 之和：

```r
count(df, name, wt = score)

```

| name | n |
| --- | --- |
| Alice | 272 |
| Bob | 173 |
| Charlie | 91 |

---

### 2.4 降序排列并自定义列名

按频次降序，并将计数列命名为 `freq`：

```r
count(df, name, sort = TRUE, name = "freq")

```

| name | freq |
| --- | --- |
| Alice | 3 |
| Bob | 2 |
| Charlie | 1 |

---

## 3. 实战应用建议

- **可视化前置**：`df %>% count(category) %>% ggplot(aes(category, n)) + geom_col()`
- **快速频率表**：数据探索时，瞬间了解类别分布
- **加权统计**：处理计数以外的“求和”需求，如销售额、时长之和
- **管道优雅**：与 `filter()`、`mutate()` 搭配使用，写出更流畅的流水线

---

> Tip
> 
> 
> `count()` 是 `tidyverse` 中最常用也是最高效的分组计数方法，有了它就无需再手写 `group_by()` + `summarise()`。如果你有更复杂的统计需求（如多指标同时计数、百分比统计），可以在其后继续 `mutate()` 或 `ungroup()` 等操作。
>
