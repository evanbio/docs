在 R 语言中，数据类型（Data Types）是数据分析的基础。不同的数据类型决定了数据存储方式、可进行的操作以及在建模中的意义。本文将从 **基本类型**、**复合结构**、**分类变量**、**数值变量** 等角度展开，并在最后提供一张 **总结表格**。

---

## 1. 基本数据类型（Atomic Types）

R 的基本原子类型包括：

- **Numeric（数值型）**：默认是双精度浮点数。
- **Integer（整型）**：后缀 `L` 表示整数。
- **Character（字符型）**：文本字符串。
- **Logical（逻辑型）**：布尔值 TRUE/FALSE。
- **Complex（复数型）**：含有虚部的数。
- **Raw（二进制型）**：低级别字节数据。

```r
num <- 3.14      # numeric
int <- 10L       # integer
txt <- "Hello"   # character
lgc <- TRUE      # logical
cmp <- 2 + 3i    # complex

```

---

## 2. 特殊值（Special Values）

- `NA`：缺失值（Not Available）
- `NaN`：非数值（Not a Number，例如 0/0）
- `Inf` 和 `-Inf`：无穷大与负无穷大

```r
c(1, NA, NaN, Inf, -Inf)

```

---

## 3. 复合数据结构（Composite Structures）

### 3.1 向量（Vector）

同类型元素的一维数组。

```r
v <- c(1, 2, 3)

```

### 3.2 矩阵（Matrix） & 数组（Array）

矩阵是二维，数组可以是多维。

```r
m <- matrix(1:6, nrow = 2, ncol = 3)
a <- array(1:8, dim = c(2, 2, 2))

```

### 3.3 列表（List）

可存放不同类型的元素。

```r
lst <- list(id = 1, name = "Alice", score = c(90, 95, 88))

```

### 3.4 数据框（Data Frame）

表格型数据结构，每列可以是不同类型。

```r
df <- data.frame(
  name = c("Alice", "Bob"),
  age = c(23, 25),
  gender = c("F", "M")
)

```

---

## 4. 数值变量（Quantitative Variables）

### 4.1 连续型（Continuous）

可取无限多个值，常见于测量数据。

```r
height <- c(160.2, 172.5, 168.9)  # 身高（连续）

```

### 4.2 离散型（Discrete）

只能取有限或可数的值，常见于计数数据。

```r
children <- c(0L, 1L, 2L, 3L)  # 孩子个数（离散）

```

---

## 5. 分类变量（Categorical Variables）

### 5.1 名义型（Nominal）

- 无顺序的分类
- 常用于性别、血型等

```r
sex <- factor(c("Male", "Female", "Female"))
levels(sex)  # "Female" "Male"

```

### 5.2 有序型（Ordinal）

- 有顺序关系
- 典型例子：教育程度、疼痛等级

```r
edu <- factor(
  c("Bachelor", "Master", "PhD"),
  levels = c("Bachelor", "Master", "PhD"),
  ordered = TRUE
)

```

> ⚠️ 有序因子支持比较操作：
> 

```r
edu[1] < edu[3]   # TRUE
```

---

## 6. 类型检查与转换

- 类型检查：`class()`, `typeof()`, `is.numeric()`, `is.factor()`
- 类型转换：`as.numeric()`, `as.character()`, `as.factor()`

```r
x <- as.factor(c("A", "B", "A"))
as.numeric(x)  # 转换为整数编码

```

---

## 7. 总结表格

| 类型大类 | 子类型/说明 | 示例 | 典型应用 |
| --- | --- | --- | --- |
| **基本类型** | Numeric（数值型） | `3.14` | 数学计算 |
|  | Integer（整数型） | `10L` | 计数、索引 |
|  | Character（字符型） | `"Hello"` | 标签、文本 |
|  | Logical（逻辑型） | `TRUE/FALSE` | 条件判断 |
|  | Complex（复数型） | `2+3i` | 数学建模 |
|  | Raw（二进制型） | `charToRaw("R")` | 字节存储 |
| **特殊值** | `NA`, `NaN`, `Inf`, `-Inf` | `0/0`, `1/0` | 缺失/无穷 |
| **结构化类型** | 向量（Vector） | `c(1,2,3)` | 一维数据 |
|  | 矩阵（Matrix） | `matrix(1:6,2,3)` | 二维数据 |
|  | 数组（Array） | `array(1:8,c(2,2,2))` | 多维数据 |
|  | 列表（List） | `list(a=1,b="x")` | 混合对象 |
|  | 数据框（Data Frame） | `data.frame(x=1:3,y=c("A","B","C"))` | 表格数据 |
| **数值变量** | 连续型（Continuous） | 身高、体重 | 测量数据 |
|  | 离散型（Discrete） | 孩子个数 | 计数数据 |
| **分类变量** | 名义型（Nominal，无序） | 性别、血型 | 分组变量 |
|  | 有序型（Ordinal，有序） | 教育水平、疼痛等级 | 排序比较 |

---

## 8. 小结

- **R 的核心是向量化**，所有对象都由基本数据类型组合而来。
- **数值型变量**可以细分为连续与离散；**分类变量**可以细分为名义与有序。
- 掌握这些区分，有助于建模时选择合适的统计方法（如：连续变量用回归分析，有序变量可用有序 logistic 回归，分类变量可用卡方检验）。
