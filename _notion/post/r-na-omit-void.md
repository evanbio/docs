## 1. na.omit：批量去除含有NA的行

```r
df <- data.frame(a = c(1, NA, 3), b = c("x", "y", NA))
na.omit(df)
# 去除含NA的整行
# 输出:
#   a b
# 1 1 x
```

- 用于数据框、向量、时间序列等，返回"无NA"的完整观测
- 保留的行会保留原始行号（行名不变）

---

## 2. evanverse::is_void()：更通用的“空值”判定

### 函数设计

`is_void()` 来自 evanverse 包，设计用于灵活判定以下**多种“无效/空值”**：

- `NA`
- `NULL`
- 空字符串 `""`
- 可选：分别控制每种类型是否计为空

### 参数说明

- `x`：向量或列表（支持混合类型）
- `include_na`：是否将`NA`判为空（默认TRUE）
- `include_null`：是否将`NULL`判为空（默认TRUE）
- `include_empty_str`：是否将`""`判为空（默认TRUE）

### 代码定义

```r
is_void <- function(x,
                    include_na = TRUE,
                    include_null = TRUE,
                    include_empty_str = TRUE) {
  if (is.null(x)) return(include_null)
  if (is.list(x)) {
    return(vapply(x, is_void,
                  logical(1),
                  include_na = include_na,
                  include_null = include_null,
                  include_empty_str = include_empty_str))
  }
  void <- rep(FALSE, length(x))
  if (include_na) void <- void | is.na(x)
  if (include_empty_str && is.character(x)) void <- void | x == ""
  void[is.na(void)] <- FALSE
  return(void)
}
```

---

### 示例与进阶用法

```r
is_void(c(NA, "", "text"))
# [1] TRUE TRUE FALSE

is_void(list(NA, "", NULL, "a"))
# [1] TRUE TRUE TRUE FALSE

is_void("NA", include_na = FALSE)
# [1] FALSE

is_void(NULL)
# [1] TRUE
```

### 进阶场景

- 适用于清理**既有 NA、又有""、还可能混入 NULL**的数据集
- 可用于判断列表、数据框中哪一行/列/元素是“全空”或“部分空”
- 可作为复杂数据导入、整合、去冗余的**前置数据清理工具**

---

### 与基础R判空函数对比

| 功能 | is.na | na.omit | is_void（evanverse） |
| --- | --- | --- | --- |
| 识别 NA | ✔ | ✔ | ✔ |
| 识别 NULL | × | × | ✔（可选） |
| 识别空字符串 | × | × | ✔（可选） |
| 支持向量/列表 | ✔ | ✔ | ✔（列表递归） |
| 参数自定义 | × | × | ✔ |
| 适用范围 | 仅NA | 仅NA | NA、NULL、"" 可灵活扩展 |

---

## 3. 场景推荐与组合技巧

- 用 `na.omit()` 快速剔除含 NA 行
- 用 `is_void()` 做更灵活的批量判空/数据清洗、特别是数据导入和日志/接口返回等**不标准“空值”场景**
- 可结合 `apply()`、`purrr::map()` 等函数，对数据框或嵌套结构做批量空值检测

---

> 本页可补充其它如is.na()、complete.cases()、tidyr::drop_na()等判空方法。
> 
> 
> 如需结合evanverse包更多实用工具，请补充用例或实际项目经验。
>
