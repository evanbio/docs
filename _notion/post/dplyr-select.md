`select()` 是 **`dplyr`** 中用于**选择、重排或排除列**的利器。当数据框列数众多时，配合多种辅助函数，一行即可筛出所需变量。

---

## 1. 函数原型

```r
select(.data,
       ...,
       .before = NULL,
       .after  = NULL)
```

- `...` 支持 列名、下标、负号 排除；
- `.before` / `.after`：将匹配列移动到目标位置。

---

## 2. 常用辅助函数

| 函数 | 功能说明 | 示例 |
| --- | --- | --- |
| `starts_with("x")` | 列名以 `"x"` 开头 | `select(df, starts_with("gene"))` |
| `ends_with("_y")` | 列名以 `"_y"` 结尾 | `select(df, ends_with("_1"))` |
| `contains("id")` | 列名包含 `"id"` | `select(df, contains("core"))` |
| `matches("^s")` | 列名正则匹配 | `select(df, matches("^s"))` |
| `num_range("X", 1:3)` | 列名按数字序列（如 X1, X2, X3） | `select(df2, num_range("X", 1:2))` |
| `where(is.numeric)` | 选择所有数值型列 | `select(df, where(is.numeric))` |
| `where(is.character)` | 选择所有字符型列 | `select(df, where(is.character))` |

---

## 3. 示例演示

先看示例数据：

```r
library(dplyr)

df <- tibble(
  id       = 1:3,
  gene_a   = c(1.2, 3.4, 5.6),
  gene_b   = c(7.8, 9.0, 1.1),
  name     = c("A", "B", "C"),
  score_1  = c(10, 20, 30),
  score_2  = c(40, 50, 60),
  note     = c("pass", "fail", "pass")
)
df2 <- tibble(X1 = 1, X2 = 2, X3 = 3)

```

### 3.1 选出所有 `gene_` 列

```r
select(df, starts_with("gene"))

```

---

### 3.2 选出以 `_1` 结尾的列

```r
select(df, ends_with("_1"))

```

---

### 3.3 查找包含 `"core"` 的列

```r
select(df, contains("core"))

```

---

### 3.4 按正则匹配列名（字母 s 开头）

```r
select(df, matches("^s"))

```

---

### 3.5 选取 X1、X2 编号列

```r
select(df2, num_range("X", 1:2))

```

---

### 3.6 只保留数值型列

```r
select(df, where(is.numeric))

```

---

### 3.7 排除 `note` 列

```r
select(df, -note)
# 或
select(df, !starts_with("score"))

```

---

## 4. 插入与重排

- **将 `note` 列移动到最前**：
    
    ```r
    select(df, note, .before = everything())
    
    ```
    
- **在 `id` 后插入 `gene_a`**：
    
    ```r
    select(df, id, gene_a, .after = id)
    
    ```
    

---

## 5. 小贴士

- **组合多种匹配**：
    
    `select(df, starts_with("gene"), ends_with("_2"))`
    
- **排除一组**：
    
    `select(df, -matches("score"))`
    
- **与管道结合**：在载入、过滤后直接 `select()` 出报告所需列
- **高效报表**：为导出表格或绘图预先裁剪无关变量

---

> 总结
> 
> 
> 利用这些辅助函数，`select()` 能让你快速锁定变量名模式，不再苦于手动打长长的列名列表。掌握它，数据预处理效率瞬间飞升！
>
