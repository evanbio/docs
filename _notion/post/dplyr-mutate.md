`mutate()` 是 **`dplyr`** 中用于**添加、修改或替换列**的核心函数。从最新版起，它支持通过 `.before`、`.after` 和 `.keep` 参数，**精准控制新列插入位置**及**原始列的保留策略**，助你快速构建干净的特征表。

---

## 1. 函数原型

```r
mutate(.data,
       ...,
       .before = NULL,
       .after  = NULL,
       .keep   = c("all", "used", "unused", "none"))
```

| 参数 | 含义 |
| --- | --- |
| `...` | 一个或多个新列表达式（或对现有列的修改） |
| `.before` | 新列插入到指定列之前（不可与 `.after` 同时使用） |
| `.after` | 新列插入到指定列之后（不可与 `.before` 同时使用） |
| `.keep` | 控制保留哪些原始列：• `"all"`：保留所有（默认）• `"used"`：仅保留表达式中用到的原列• `"unused"`：保留未使用的原列• `"none"`：只保留新列 |

---

## 2. 示例与场景

先定义示例数据：

```r
library(dplyr)

df <- tibble(
  name  = c("Alice", "Bob", "Charlie"),
  score = c(90, 85, 88),
  age   = c(20, 21, 19)
)

```

### 2.1 默认行为：保留所有列

```r
mutate(df,
       double_score = score * 2)

```

- **说明**：新增 `double_score`，默认在最后一列后追加，保留原 `name`、`score`、`age`。

---

### 2.2 指定插入位置

- **在 `score` 前**：
    
    ```r
    mutate(df,
           double_score = score * 2,
           .before = score)
    
    ```
    
- **在 `name` 后**：
    
    ```r
    mutate(df,
           double_score = score * 2,
           .after = name)
    
    ```
    

---

### 2.3 精细保留原列

- **仅保留用到的原列**（`score` 会被用，`name`、`age` 会去除）：
    
    ```r
    mutate(df,
           double_score = score * 2,
           .keep = "used")
    
    ```
    
- **只输出新列**（完全丢弃原始列）：
    
    ```r
    mutate(df,
           double_score = score * 2,
           .keep = "none")
    
    ```
    
- **保留未使用的原列**（只保留 `name`、`age`）：
    
    ```r
    mutate(df,
           double_score = score * 2,
           .keep = "unused")
    
    ```
    

---

## 3. 高级技巧

- 若要**重排列**，可在 `mutate()` 后链入 `relocate()`：
    
    ```r
    df %>%
      mutate(new = score / age) %>%
      relocate(new, .after = name)
    
    ```
    
- **中间计算**：用 `.keep = "none"` 只输出最终特征，避免临时列污染结果表。
- **报告输出**：结合 `.before`/`.after`，让表格列顺序更直观，便于导出报告。

---

> 总结
> 
> - `.before`/`.after`：精准插入新列；
> - `.keep`：按需保留原始列，提升特征工程清洁度；
> - 与 `relocate()`、`select()` 等组合，可轻松管理复杂数据框列顺序。
> 
> 掌握这些参数后，你的 `mutate()` 就不仅是“加列”，更是“整理整洁的特征表”！
>
