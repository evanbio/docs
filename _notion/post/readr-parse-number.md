`parse_number()` 是 **`readr`** 包中用于**从混合文本中解析数值**的便捷函数。它会忽略非数字字符（如单位、货币符号、百分号等），并将提取出的数字转换为双精度数值（`double`）。

---

## 1. 函数原型

```r
parse_number(x,
             locale = default_locale(),
             ...)

```

| 参数 | 说明 |
| --- | --- |
| `x` | 要解析的字符向量（`character`） |
| `locale` | 本地化设置，可控制小数点符号、千分位分隔符、货币符号等（`readr::default_locale()`） |
| `...` | 其他传递给底层解析器的参数 |

---

## 2. 基本示例

```r
library(readr)

parse_number("Weight: 65kg")      # 返回 65
parse_number("$123.45")           # 返回 123.45
parse_number("10,000 people")     # 返回 10000
parse_number("约为50.2%")         # 返回 50.2

```

---

## 3. 场景演示

### 3.1 带单位的数据

```r
parse_number(c("180 cm", "2.3 mg/L", "50μg"))
# [1] 180.0   2.3  50.0

```

### 3.2 清洗价格或金额

```r
prices <- c("€1.234,56", "$789.00", "￥¥ 345,00")
# 欧式格式用逗号做小数点
parse_number(prices, locale = locale(decimal_mark = ","))
# [1] 1234.56  789.00  345.00

```

### 3.3 处理百分比

```r
rates <- c("12%", "5.5%", "约 100%")
pct <- parse_number(rates) / 100
# [1] 0.12 0.055 1.00

```

---

## 4. 批量清洗示例

配合 `dplyr::mutate()` 和 `across()`，一次处理多列：

```r
library(dplyr)

df <- tibble(
  weight = c("65kg", "72kg", "88kg"),
  height = c("180cm", "175cm", "170cm"),
  price  = c("$10.00", "$20.50", "$30.75")
)

df %>%
  mutate(
    across(c(weight, height, price),
           ~ parse_number(.x,
                          locale = locale(decimal_mark = ".")))
  )

```

---

## 5. 小贴士

- 自动忽略所有前后非数字字符，保留纯数字及小数点。
- 字符串中无数字时返回 `NA`。
- 若要处理带分组千分位（如 `1,234`）或欧式小数格式（`1.234,56`），需调整 `locale`：
    
    ```r
    parse_number("1.234,56", locale = locale_decimal(decimal_mark = ","))
    
    ```
    
- 对百分比除以 100，可写作 `parse_number(x) / 100`。
- 对于复杂的格式（如负号、括号表示负值），可结合正则预处理或后续 `sign()` 调整。

---

> 总结
> 
> 
> `parse_number()` 在清洗带有单位、符号或千分位分隔符的字符数据时极其高效，配合 `dplyr` 管道可快速完成批量数值提取，是日常数据预处理的必备武器。
>
