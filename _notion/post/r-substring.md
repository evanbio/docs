在处理标签、ID、样本名、文件名等字符串时，常需要**批量提取某一段字符**（子串/substring）。R有基础和tidyverse两套常用方法。

---

## 1. 基础R：substring()

```r
a <- c("hello", "world", "123456")
# 提取第2~4个字符
substring(a, 2, 4)
# 结果: "ell" "orl" "234"

```

- **起止均为正整数，下标从1开始，区间为闭区间**

---

## 2. stringr::str_sub()（更灵活，支持负数）

```r
library(stringr)
a <- "hello world"
# 提取第3到倒数第2个字符
str_sub(a, 3, -2)
# 结果: "llo worl"

```

- **支持负数下标，-1代表倒数第1位**
- 向量化兼容性更好，推荐复杂批量场景优先用

---

## 3. 常见应用场景

- 批量截取ID/条形码/日期（如只保留前6位或后4位）
- 处理批量文件名/样本标签重命名
- 提取生信分析中的染色体/位点/批次编号

---

## 4. 易错与tips

- substring只支持正下标，str_sub支持负下标
- str_sub向量化更优，复杂字符串建议优先用
- 两者都支持向量输入，自动recycle参数

---

## 5. 典型例子对比

```r
vec <- c("ABCDEF", "ghijkl", "123456")
substring(vec, 2, 4)      # "BCD" "hij" "234"
str_sub(vec, 2, 4)        # "BCD" "hij" "234"
str_sub(vec, -3, -1)      # "DEF" "jkl" "456"

```
