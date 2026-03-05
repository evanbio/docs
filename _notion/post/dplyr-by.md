从 **`dplyr` 1.1.0** 起，你可以在 `summarise()`、`mutate()`、`filter()` 等函数中用 **`.by`** 参数，**一行完成分组 + 计算**，不再需要先写 `group_by()`，也无需再手动 `ungroup()`。

---

## 1. 为什么用 `.by`

- 省去 `group_by()`/`ungroup()`，让管道更简洁
- 直接在目标函数内指定分组，意图更直观
- 默认**不保留分组结构**，后续操作回归全局数据

---

## 2. 函数原型

```r
# 分组汇总
summarise(.data, ..., .by = <column or vector_of_columns>)

# 分组变换
mutate(.data, ..., .by = <column or vector_of_columns>)

# 分组筛选
filter(.data, <cond>, .by = <column or vector_of_columns>)

```

- `.by` 可传单列名，也可传向量 `c(col1, col2)`
- 等价于：
    
    ```r
    data %>%
      group_by(...) %>%
      ACTION(...) %>%
      ungroup()
    
    ```
    

---

## 3. 示例数据

```r
library(dplyr)

df <- tibble(
  group  = c("A", "A", "B", "B", "C"),
  gender = c(NA, NA, NA, NA, NA),  # 示例 3 用
  score  = c(10, 12, 15, 14, 13)
)

df2 <- tibble(
  group  = c("A", "A", "B", "B", "C"),
  gender = c("F", "M", "F", "F", "M"),
  score  = c(10, 12, 15, 14, 13)
)

```

---

## 4. 核心用法示例

### 4.1 `.by` + `summarise()`

按 `group` 计算组内平均，结果不保留分组结构：

```r
summarise(df,
          mean_score = mean(score),
          .by       = group)

```

| group | mean_score |
| --- | --- |
| A | 11 |
| B | 14.5 |
| C | 13 |

---

### 4.2 `.by` + `mutate()`

按 `group` 计算组均值并新增列：

```r
mutate(df,
       group_mean = mean(score),
       .by        = group)

```

*效果*：`df` 中每行多了一列 `group_mean`，值为对应分组的平均分。

---

### 4.3 多列分组

同时按 `(group, gender)` 分组计算：

```r
summarise(df2,
          mean_score = mean(score),
          .by        = c(group, gender))

```

*效果*：得到每个 `(group, gender)` 的平均分，分组更细。

---

### 4.4 `.by` + `filter()`

按组筛选：例如保留每组分数大于组均值的行：

```r
df2 %>%
  filter(score > mean(score), .by = c(group, gender))

```

---

## 5. 小贴士

- **链式阅读**：把分组逻辑直接写在操作函数中，减少管道层级
- **无分组残留**：无需再写 `ungroup()`，避免分组影响后续步骤
- **可用于所有分组敏感函数**：`summarise()`、`mutate()`、`filter()`、甚至 `arrange()`
- **适合一次性、临时分组计算**：当不需要后续继续分组时，首选 `.by`

---

> 总结
> 
> 
> `.by` 让你的分组计算更**简洁**、**直观**，无需再写 `group_by()`/`ungroup()`。在日常数据分析中，凡是“一次性”的聚合、变换或筛选，都可以优先考虑使用 `.by`！
>
