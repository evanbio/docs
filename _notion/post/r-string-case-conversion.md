在 R 语言的数据清洗和文本分析中，字符串标准化与批量变换极为常见。**stringr** 包作为 tidyverse 生态的重要成员，提供了一套高效、风格统一的字符串处理函数，极大提升了代码的易读性与批量处理能力。本文以“大小写转换”为切入点，系统梳理 stringr 主要方法与典型场景，助你轻松应对各种文本数据任务！

---

## 一、为什么推荐 stringr？

- **统一前缀**（全部 str_ 开头，易记易补全）
- **向量化友好**（一行处理整个向量/列）
- **locale 适配**（处理多语言更灵活）
- **管道友好**（%>% 或者 |> 下表达清晰）

---

## 二、核心方法一览

| 功能 | stringr 方法 | 典型用法 | 说明 |
| --- | --- | --- | --- |
| 全部小写 | `str_to_lower()` | `str_to_lower(x)` | 支持 locale |
| 全部大写 | `str_to_upper()` | `str_to_upper(x)` | 支持 locale |
| 单词首字母大写 | `str_to_title()` | `str_to_title(x)` | 英文常用，中文慎用 |

### 示例代码

```r
library(stringr)
x <- c("bIoINFO", "hello world", "R语言", "张三")

str_to_lower(x)   # [1] "bioinfo" "hello world" "r语言" "张三"
str_to_upper(x)   # [1] "BIOINFO" "HELLO WORLD" "R语言" "张三"
str_to_title(x)   # [1] "Bioinfo" "Hello World" "R语言" "张三"

```

- **locale 参数**
    
    处理特定语言：
    
    `str_to_upper("straße", locale = "de")  # "STRASSE"`
    

---

## 三、批量数据清洗场景

### 1. 批量标准化数据框中的列

```r
library(dplyr)
df <- tibble(name = c("zhang san", "LI Si"), city = c("beijing", "SHANGHAI"))
df %>% mutate(across(everything(), str_to_title))
# A tibble: 2 × 2
#   name      city
#   <chr>     <chr>
# 1 Zhang San Beijing
# 2 Li Si     Shanghai

```

### 2. 标签分组统一（全部大写/小写）

```r
df$city <- str_to_upper(df$city)

```

---

## 四、stringr 拓展方法推荐

除了大小写，还有很多实用字符串操作，常用于数据清洗：

| 功能 | 方法 | 示例 |
| --- | --- | --- |
| 去除空格 | `str_trim()` | `str_trim("  hello  ")` |
| 去除换行 | `str_squish()` | `str_squish("a \n b  c")` |
| 替换内容 | `str_replace_all()` | `str_replace_all(x, "old", "new")` |
| 检查开头/结尾 | `str_starts()`, `str_ends()` | `str_starts(x, "a")` |
| 拆分 | `str_split()` | `str_split(x, ",")` |
| 合并 | `str_c()` | `str_c("a", "b", sep = "-")` |
| 字符串长度 | `str_length()` | `str_length(x)` |

### 例子：

```r
# 去除多余空格和换行
str_squish("   hello   world  \n  test  ") # "hello world test"

# 替换字符串
str_replace_all("apple, banana", "a", "A") # "Apple, bAnAnA"

# 判断字符串结尾
str_ends("filename.csv", ".csv")           # TRUE

```

---

## 五、与 base R 对比

- base R：`tolower()`、`toupper()`、`tools::toTitleCase()`
    
    缺点：中文支持有限，风格不统一，不支持 locale
    
- stringr：str_to_* 系列，风格统一、向量化、管道友好，强烈推荐 tidyverse 用户优先使用。

---

## 六、常见问题与小贴士

- **中文首字母大写？**
    
    目前 `str_to_title()` 对中文字符无效，但不会报错。一般中文不用大小写转换。
    
- **批量处理多列/全数据框**：结合 dplyr 的 `mutate(across(...))` 非常高效。
- **正则表达式处理**：stringr 大部分函数支持正则，非常适合复杂文本变换。
