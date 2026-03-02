`separate_wider_position()` 是 `tidyr` 中用于**按字符宽度将一个字符串列拆分成多个新列**的函数。

适用场景：

- 固定格式字符串解析
- 结构化编码数据
- 嵌入式标签解析

---

### ✅ 基本语法

```r
separate_wider_position(data, col, widths, names, too_short = "error")

```

| 参数 | 含义 |
| --- | --- |
| `data` | 输入数据框 |
| `col` | 要拆分的列名（字符串列） |
| `widths` | 每列的宽度（字符数），必须与 `names` 一一对应 |
| `names` | 拆分后的列名向量 |
| `too_short` | 字符长度不足时的处理方式（`"error"`, `"pad"` 等） |

---

### 🧪 示例 1：按宽度分割字符串为多列

```r
library(tidyr)

df <- tibble(code = "ABCDEF")

df %>%
  separate_wider_position(
    code,
    widths = c(2, 2, 2),
    names = c("x", "y", "z")
  )

```

| x | y | z |
| --- | --- | --- |
| AB | CD | EF |

---

### 🧪 示例 2：处理不够长的字符串

```r
df <- tibble(code = c("ABCDEF", "XYZ"))

df %>%
  separate_wider_position(
    code,
    widths = c(a = 2, b = 2, c = 2),
    too_few = "align_start"
  )

```

| a | b | c |
| --- | --- | --- |
| AB | CD | EF |
| XY | Z |  |
