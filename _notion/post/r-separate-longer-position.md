`separate_longer_position()` 是 `tidyr` 中用于将一个字符列**按固定字符宽度拆成多行**的函数。

适用场景：

- DNA 序列
- 连续编码
- 对称字符串
- 任何需要等间距切割的文本

---

### ✅ 基本语法

```r
separate_longer_position(data, col, width)

```

| 参数 | 说明 |
| --- | --- |
| `data` | 数据框 |
| `col` | 要拆分的列（字符型） |
| `width` | 每段字符的长度（整数） |

---

### 🧪 示例 1：拆分字符串每 2 个字符为一行

```r
library(tidyr)

df <- tibble(id = 1, code = "ABCDEF")

df %>%
  separate_longer_position(code, width = 2)

```

| id | code |
| --- | --- |
| 1 | AB |
| 1 | CD |
| 1 | EF |

---

### 🧪 示例 2：批量处理序列

```r
df <- tibble(seq_id = c("s1", "s2"),
             seq = c("ATGCTA", "CGTAAA"))

df %>%
  separate_longer_position(seq, width = 3)

```

| seq_id | seq |
| --- | --- |
| s1 | ATG |
| s1 | CTA |
| s2 | CGT |
| s2 | AAA |
