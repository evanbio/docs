`separate_wider_delim()` 是 `tidyr` 的现代函数，用于将一个列中包含分隔符的字符串**横向拆分为多个新列**。

它是 `separate()` 的推荐替代版本，语义更清晰、行为更一致，并提供更强的参数控制。

---

### ✅ 基本语法

```r
separate_wider_delim(data, col, delim, names, too_few = "error", too_many = "drop")

```

| 参数 | 含义 |
| --- | --- |
| `data` | 数据框 |
| `col` | 要拆分的列名 |
| `delim` | 拆分用的分隔符，如 `"_"`、`","` |
| `names` | 拆分后新列的名字（字符向量） |
| `too_few` | 分裂结果少于 `names` 长度时的处理方式（默认 `"error"`） |
| `too_many` | 分裂结果多于 `names` 长度时的处理方式（默认 `"drop"`） |

---

### 🧪 示例 1：按下划线 `_` 拆成三列

```r
library(tidyr)

df <- tibble(code = c("A_B_C", "D_E_F"))

df %>%
  separate_wider_delim(code, delim = "_", names = c("x", "y", "z"))

```

| x | y | z |
| --- | --- | --- |
| A | B | C |
| D | E | F |

---

### 🧪 示例 2：处理过多或不足字段

```r
df <- tibble(x = c("1_2", "3_4_5"))

df %>%
  separate_wider_delim(x, delim = "_", names = c("a", "b"), too_many = "merge")

```

| a | b |
| --- | --- |
| 1 | 2 |
| 3 | 4_5 |
