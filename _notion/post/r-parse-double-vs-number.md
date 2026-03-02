| 函数 | 类型转换 | 核心用途 | 是否保留非数字字符 |
| --- | --- | --- | --- |
| `parse_double()` | 字符 → double | **严格解析浮点数**（不能含单位/符号） | ❌ 不允许 |
| `parse_number()` | 字符 → numeric | **提取并解析字符串中的数字部分** | ✅ 自动剥离前后字符 |

---

### ✅ `parse_double()`：严格解析

```r
library(readr)

parse_double("3.14")
# [1] 3.14

parse_double("3.14 kg")
# Error: problems parsing

parse_double("1e5")
# [1] 1e+05

```

- 仅接受合法的数字格式
- 适合在 **结构化数据列** 中做类型转换（如手动读取 CSV 并指定列类型）
- 相当于 `as.double()` + locale-aware 处理

---

### ✅ `parse_number()`：宽容提取

```r
parse_number("3.14 kg")
# [1] 3.14

parse_number("$123.45")
# [1] 123.45

parse_number("Weight: 80kg")
# [1] 80

```

- 自动提取字符串中的 **数字部分**
- 适合清洗 messy 文本（如网页或报告导出的 CSV）
- 默认保留 **正负号、小数点、科学计数法**
