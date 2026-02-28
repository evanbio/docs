在 R 语言里，循环与函数式编程一直是高频场景。base R 的 `apply` 家族虽然功能强大，但语法繁杂，返回值类型也不总是可控。**purrr** 包（tidyverse 一员）则提供了一套简洁、可预测、函数式风格的工具，极大提升了代码的可读性与稳定性。

这篇笔记梳理了 purrr 的核心功能，方便快速上手。

---

## 1. map 系列函数

`map()` 是 purrr 的核心：对输入向量或列表的每个元素应用函数，结果返回为 **list**。

为了避免结果类型不确定，purrr 还提供了强类型版本：

- `map_lgl()`：返回 logical 向量
- `map_int()`：返回 integer 向量
- `map_dbl()`：返回 double 数值向量
- `map_chr()`：返回 character 向量

```r
library(purrr)

x <- list(1, 2, 3, 4)

map(x, sqrt)           # 返回 list
map_dbl(x, sqrt)       # 返回数值向量
map_int(x, ~ .x^2)     # 匿名函数写法
map_chr(letters[1:5], toupper)

```

> 对比 base R：
> 
> - `lapply()` ≈ `map()`
> - `sapply()` ≈ `map_*()` （但 sapply 返回类型可能不稳定）

---

## 2. 匿名函数写法

purrr 支持公式风格的匿名函数，更简洁：

```r
map_dbl(1:5, ~ .x^2)  # .x 表示当前元素

```

等价于：

```r
map_dbl(1:5, function(x) x^2)

```

---

## 3. map2 与 pmap：多输入并行映射

- `map2(x, y, f)`：两个输入并行映射
- `pmap(list(...), f)`：多个输入并行映射

```r
map2_dbl(1:5, 6:10, ~ .x + .y)

params <- list(a = 1:3, b = 4:6, c = 7:9)
pmap_dbl(params, ~ ..1 + ..2 + ..3)

```

---

## 4. reduce 与 accumulate：归约操作

- `reduce(x, f)`：逐步合并向量
- `accumulate(x, f)`：记录每一步合并结果

```r
reduce(1:5, `+`)
# ((((1+2)+3)+4)+5) = 15

accumulate(1:5, `+`)
# 1, 3, 6, 10, 15

```

---

## 5. safely / possibly / quietly：安全调用

在数据处理中，函数报错往往会打断流程。purrr 提供了优雅的错误处理方式：

```r
safe_log <- safely(log)

safe_log(10)
# list(result = 2.302, error = NULL)

safe_log("a")
# list(result = NULL, error = <错误信息>)

```

如果只想要结果，出错时返回默认值：

```r
safe_log2 <- possibly(log, otherwise = NA)
map_dbl(list(1, 10, "a"), safe_log2)
# 0, 2.302, NA

```

---

## 6. transpose：列表转置

`transpose()` 可以交换 list 的结构，常用于整理嵌套列表：

```r
l <- list(list(a=1, b=2), list(a=3, b=4))
transpose(l)
# list(a = list(1, 3), b = list(2, 4))

```

---

## 7. purrr vs apply 家族对照表

| base R | purrr | 返回结果 |
| --- | --- | --- |
| `lapply(x, f)` | `map(x, f)` | list |
| `sapply(x, f)` | `map_*()` | 确定类型向量 |
| `mapply(f, x, y)` | `map2(x, y, f)` | list/向量 |
| `Reduce(f, x)` | `reduce(x, f)` | 单值 |
| `Filter(f, x)` | `keep(x, f)` | list |
| `Map(f, ...)` | `pmap(list(...), f)` | list |

---

## 总结

- `map()` 家族是核心，优雅替代 `apply` 系列
- `map2` / `pmap` 处理多输入
- `reduce` / `accumulate` 做归约运算
- `safely` / `possibly` 保证健壮性
- `transpose` 整理复杂 list

掌握了这些工具，R 代码不仅更简洁，而且更不容易出错。**purrr = apply 家族的 tidyverse 进阶版**。
