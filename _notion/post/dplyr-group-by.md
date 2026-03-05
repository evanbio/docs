`group_by()` 用于为数据添加分组信息，**本身不修改数据内容**，但后续的 `summarise()`、`mutate()`、`filter()` 等操作将基于这些分组分别执行。它是 `dplyr` 工作流的核心。

---

## 1. 函数原型

```r
group_by(.data, ..., .add = FALSE)

```

| 参数 | 说明 |
| --- | --- |
| `.data` | 输入的数据框或 `tibble` |
| `...` | 要分组的列（一个或多个变量名或表达式） |
| `.add` | 是否在已有分组基础上**添加**新分组（`TRUE`／`FALSE`） |

---

## 2. 示例数据

```r
library(dplyr)

df <- tibble(
  group = c("A", "A", "B", "B", "C"),
  score = c(10, 12, 15, 14, 13)
)

df2 <- tibble(
  group  = c("A", "A", "B", "B", "C"),
  gender = c("F", "M", "F", "F", "M"),
  score  = c(10, 12, 15, 14, 13)
)

```

---

## 3. 核心用法

### 3.1 按单列分组并汇总

```r
df %>%
  group_by(group) %>%
  summarise(
    mean_score = mean(score),
    .groups     = "drop"
  )

```

*说明*：对每个 `group` 计算 `score` 平均值，最后用 `.groups = "drop"` 取消分组。

---

### 3.2 按多列分组

```r
df2 %>%
  group_by(group, gender) %>%
  summarise(
    mean_score = mean(score),
    .groups     = "drop"
  )

```

*说明*：先按 `group` 再按 `gender` 分组，两变量联合分组后分别计算均值。

---

### 3.3 组内排名

```r
df %>%
  group_by(group) %>%
  mutate(
    rank_in_group = rank(-score)
  )

```

*说明*：对每个 `group` 内的 `score` 从大到小排名。

---

## 4. `.groups` 参数（仅在 `summarise()` 中）

| 值 | 含义 |
| --- | --- |
| `"drop"` | 汇总后取消所有分组（最常用） |
| `"drop_last"` | 只去掉最内层分组，保留上层分组 |
| `"keep"` | 保留全部分组，用于后续分组操作 |
| `"rowwise"` | 按行处理（与 `rowwise()` 结合使用） |

---

## 5. 进阶技巧

- **查看当前分组**：`group_vars(df %>% group_by(...))`
- **取消分组**：使用 `ungroup()`
- **嵌套分组**：`.add = TRUE` 在已有分组上添加新的分组变量
- **过滤组**：`filter()` 在分组上下文中可搭配 `n()`、`mean()` 等使用

---

> 总结
> 
> - `group_by()` 只是“打标签”，不会修改数据；
> - 后续的 `summarise()`、`mutate()` 等操作会自动按标签分组计算；
> - 合理使用 `.groups` 参数可控制分组生命周期；
> - 与 `ungroup()`、`filter()`、`arrange()` 等组合，构建高效的数据处理流水线。
