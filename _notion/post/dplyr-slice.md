`slice_*()` 系列是 **`dplyr`** 提供的行切片工具，专注于**按行号或规则提取**数据框中的行。常用于“取前 N 条”“取组内最大/最小”“随机抽样”等场景，功能比单纯的 `filter()` 更灵活。

---

## 1. 函数概览

| 函数 | 功能说明 |
| --- | --- |
| `slice(data, 1:5)` | 按 **行号** 提取指定行 |
| `slice_head()` | 提取每组的前 **n** 行（默认 `n = 1`） |
| `slice_tail()` | 提取每组的后 **n** 行（默认 `n = 1`） |
| `slice_min()` | 提取每组中某列的 **最小值** 所在行 |
| `slice_max()` | 提取每组中某列的 **最大值** 所在行 |
| `slice_sample()` | 随机抽样行，可设定数量或比例 |

---

## 2. 示例数据

```r
library(dplyr)

df <- tibble(
  group = c("A", "A", "B", "B", "C"),
  score = c(10, 12, 15, 14, 13)
)

```

---

## 3. 典型用法

### 3.1 按行号切片

提取第 1 至 2 行：

```r
slice(df, 1:2)

```

---

### 3.2 组内前 N 行

每个 `group` 取第一条记录：

```r
df %>%
  group_by(group) %>%
  slice_head(n = 1)

```

---

### 3.3 组内最大值行

按 `score` 提取每组最高分那行，且 **不保留并列**：

```r
df %>%
  group_by(group) %>%
  slice_max(score, n = 1, with_ties = FALSE)

```

- `with_ties = TRUE` 时，会保留所有并列最高行。

---

### 3.4 随机抽样

- **每组抽 2 行**（若组大小不足会报错或需设置 `replace = TRUE`）：
    
    ```r
    df %>%
      group_by(group) %>%
      slice_sample(n = 2)
    
    ```
    
- **全表按比例抽样**（40%）：
    
    ```r
    df %>%
      slice_sample(prop = 0.4)
    
    ```
    

---

### 3.5 组内最小值行

提取每组最低分那行：

```r
df %>%
  group_by(group) %>%
  slice_min(score, n = 1)

```

---

## 4. 使用建议

- **行版 `select()`**：`slice()` 系列专注行操作，与 `select()` 聚焦列操作形成互补。
- **配合 `group_by()`**：针对分组提取前/后/极值记录时，`slice_*()` 比 `filter(rank(...))` 更简洁。
- **随机抽样**：用于快速制作训练/测试集，或模拟重抽样。
- **缺失行处理**：在 `slice_head()`/`slice_tail()` 中可传 `prop` 或使用 `n_max` 保证不会超出。

---

> 总结
> 
> 
> 通过 `slice_head()`、`slice_tail()`、`slice_min()`、`slice_max()`、`slice_sample()` 等函数，您可以轻松实现各种行级别的提取需求，无论是按位置、极值还是随机，都只需一行代码完成。
>
