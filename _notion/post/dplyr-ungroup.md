当你使用 `group_by()` 为数据添加分组后，随后的大多数 `dplyr` 操作（如 `summarise()`、`mutate()`、`arrange()`）都会在“每个组”内部执行。有时，你需要在分组计算完成后**回到整体数据级别**，这时就得用到 `ungroup()`。

---

## 1. 何时需要 `ungroup()`

- **全局排序**：分组汇总后，若想对整个表按某列排序，而非在每组内部排序。
- **后续管道操作**：继续使用 `filter()`、`mutate()`、`slice_*()` 等时，不希望它们按旧的分组规则生效。
- **嵌套分组清理**：在多层分组的场景中，去除所有分组或部分分组以简化后续步骤。

---

## 2. 基本用法

```r
ungroup(data)

```

- `data`：通常是 `group_by()` 后的结果（一个 tibble/data.frame）。

---

## 3. 示例演示

### 示例数据

```r
library(dplyr)

df <- tibble(
  group = c("A", "A", "B", "B", "C"),
  score = c(10, 12, 15, 14, 13)
)

```

---

### 3.1 取消分组后进行全局排序

按组计算平均值，然后取消分组并对整个结果做降序排列：

```r
df %>%
  group_by(group) %>%
  summarise(mean_score = mean(score), .groups = "drop") %>%
  ungroup() %>%
  arrange(desc(mean_score))

```

> 如果省略 ungroup()，arrange() 会被当作“组内排序”，最终可能无法实现全局排名。
> 

---

### 3.2 嵌套分组与取消

先在组内做排名，再取消分组后计算跨组排名：

```r
df %>%
  group_by(group) %>%
  mutate(rank_in_group = rank(-score)) %>%
  ungroup() %>%
  mutate(overall_rank = rank(-score))

```

- `rank_in_group`：每个组内部的分数排名
- `overall_rank`：全表范围内的分数排名

---

## 4. 小贴士

- `ungroup()` **只移除分组属性**，不会改变数据本身内容或列。
- 如果数据上已有多层分组，`ungroup()` 会一次性清除所有分组。
- 若只想去掉最内层分组，可在 `summarise()` 中使用 `.groups = "drop_last"`。
- 查看当前分组信息：`group_vars(df %>% group_by(...))`，完全取消分组后可用 `group_vars()` 验证结果为空。

---

> 总结
> 
> 
> 在使用 `dplyr` 管道处理时，合理地**打开**（`group_by()`）与**关闭**（`ungroup()`）分组，使你的数据操作既具备分组粒度，也能灵活切换到全局视角。掌握它，可以避免许多“意外组内排序”或“分组污染”问题。
>
