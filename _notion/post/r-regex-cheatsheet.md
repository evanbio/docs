## 1. 常用正则表达式语法速查

| **模式** | **含义** | **示例** | **匹配内容** |
| --- | --- | --- | --- |
| . | 任意单字符 | "a.c" | "abc", "a3c" |
| [abc] | a 或 b 或 c | "a[bc]d" | "abd", "acd" |
| [a-z] | a到z任意小写字母 | "[a-z]+" | "hello", "abc" |
| [^abc] | 除a/b/c外任意字符 | "[^a-c]" | "d", "e", "1" |
| \d | 数字 (0-9) | "\\d+" | "123", "42" |
| \D | 非数字 | "\\D+" | "abc", "Hello" |
| \w | 字母/数字/下划线 | "\\w+" | "R_Studio", "data123" |
| \W | 非字母/数字/下划线 | "\\W+" | "@$%", " " |
| \s | 空白符 | "\\s+" | "   ", "\t" |
| \S | 非空白 | "\\S+" | "data" |
| ^ | 匹配字符串开头 | "^Hello" | "Hello world" |
| $ | 匹配字符串结尾 | "end$" | "This is the end" |
| a\|b | 匹配a或b | "cat\|dog" | "cat", "dog" |
| ( ) | 分组 | "(ab)+" | "abab", "ab" |
| {n} | n次重复 | "a{3}" | "aaa" |
| {n,} | 至少n次 | "a{2,}" | "aa", "aaaa" |
| {n,m} | n到m次 | "a{2,4}" | "aa", "aaa", "aaaa" |
| ? | 0或1次 | "a?" | "", "a" |
| + | 1次或多次 | "a+" | "a", "aaa" |
| * | 0次或多次 | "a*" | "", "a", "aaa" |

> 注意：在R字符串中，反斜杠需双写，如 "\\\\d+"。
> 

---

## 2. R 常用字符串正则函数

| **函数** | **作用/说明** | **举例** |
| --- | --- | --- |
| `grep(pattern, x)` | 返回匹配元素的位置/下标 | `grep("^H", c("Hello","World")) # 1` |
| `grepl(pattern, x)` | 返回逻辑值，判断元素是否匹配 | `grepl("o", c("Hello", "World")) # TRUE TRUE` |
| `sub(pattern, rep, x)` | 替换第一个匹配项 | `sub("a", "A", "abcda") # "Abcda"` |
| `gsub(pattern, rep, x)` | 替换所有匹配项 | `gsub("a", "A", "abcda") # "AbcdA"` |
| `regexpr(pattern, x)` | 返回首次匹配的位置及长度 | `regexpr("\\\\d+", "year2025")` |
| `gregexpr(pattern, x)` | 返回所有匹配的位置及长度 | `gregexpr("\\\\d+", "2025年1月30日")` |
| `strsplit(x, pattern)` | 按正则模式拆分字符串 | `strsplit("a,b,c", ",") # "a" "b" "c"` |

---

## 3. R正则表达式典型用法案例

### （1）提取所有数字

```r
x <- "日期：2025年1月30日"
regmatches(x, gregexpr("\\\\d+", x))
# 结果: list("2025", "1", "30")
```

### （2）替换所有小写a为A

```r
gsub("a", "A", c("abcda", "adcba"))
# 结果: "AbcdA" "AdcbA"

```

### （3）检测以“R”开头的字符串

```r
grepl("^R", c("R语言", "Python", "Ruby"))
# 结果: TRUE FALSE TRUE

```

### （4）分割字符串

```r
strsplit("ID:001;ID:002;ID:003", ";")
# 结果: list(c("ID:001", "ID:002", "ID:003"))

```

---

## 4. 进阶技巧与小结

- `*`、`+` 默认是**贪婪匹配**，`*?`、`+?` 为**非贪婪匹配**
- 支持Unicode字符匹配（如 `[\u4e00-\u9fff]` 匹配中文）
- 常与 `dplyr::filter()`、`stringr` 系列函数组合用
- 复杂场景可用 [regex101.com](https://regex101.com/) 等在线调试工具

---

## 5. Learning Resources

- [RegexOne 在线正则表达式互动教程](https://regexone.com/)
