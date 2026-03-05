`pivot_wider()` 是 **`tidyr`** 中的逆向变形工具，与 `pivot_longer()` 配对使用，可将“长格式”数据恢复成“宽格式”。常用于生成交叉表、热图输入或还原模型输出。

---

## 1. 函数原型

```r
pivot_wider(
  data,
  names_from,
  values_from,
  values_fill  = NULL,
  names_prefix = NULL,
  names_sep    = "_"
)

```

| 参数 | 含义 |
| --- | --- |
| `data` | 长格式输入数据框 |
| `names_from` | 将哪一列的值转成新列名 |
| `values_from` | 将哪一列的值填入新列 |
| `values_fill` | 缺失时填充值，如 `0` 或 `NA` |
| `names_prefix` | 展开后的列名前缀 |
| `names_sep` | 多个 `names_from` 时的连接符，默认 `_` |

---

## 2. 基础示例

### 示例数据

```r
library(tidyr)
library(dplyr)

df_long <- tibble(
  id    = c(1, 1, 2, 2),
  key   = c("A", "B", "A", "B"),
  value = c(10, 20, 30, 40)
)

```

### 2.1 简单展开

将 `key` 的值变成列名，`value` 填入对应位置：

```r
pivot_wider(
  df_long,
  names_from  = key,
  values_from = value
)

```

**结果：**

| id | A | B |
| --- | --- | --- |
| 1 | 10 | 20 |
| 2 | 30 | 40 |

---

## 3. 缺失值填充

当某些组合不存在时，可用 `values_fill` 补全：

```r
df2 <- tibble(
  name  = c("Alice", "Alice", "Bob"),
  test  = c("Math",   "Science", "Math"),
  score = c(80,       90,        70)
)

pivot_wider(
  df2,
  names_from   = test,
  values_from  = score,
  values_fill  = 0
)

```

*结果*：Bob 的 Science 列会填 0 而非 NA。

---

## 4. 多值列同时展开

当除了 `value` 还有其它测量列时，一次展开多个：

```r
df3 <- tibble(
  id   = c(1, 1, 2, 2),
  key  = c("A", "B", "A", "B"),
  val1 = c(10, 20, 30, 40),
  val2 = c(1,   2,  3,  4)
)

pivot_wider(
  df3,
  names_from   = key,
  values_from  = c(val1, val2)
)

```

*结果列*：`val1_A`, `val1_B`, `val2_A`, `val2_B`。

---

## 5. 使用建议

- **交叉表构建**：配合 `count()`、`complete()`，轻松生成频数或统计量矩阵。
- **热图准备**：将长表转宽表后，可以直接用 `pheatmap()`、`geom_tile()` 等可视化。
- **逆向验证**：与 `pivot_longer()` 互为逆操作，来回检验数据完整性。
- **填充值注意**：根据分析需求选择合理的 `values_fill`，避免误将 0 当真实观测。

---

> 对照一览
> 
> 
> 
> | 操作 | 函数 | 功能描述 |
> | --- | --- | --- |
> | 宽 → 长 | `pivot_longer()` | 多列 → 两列（变量＋值） |
> | 长 → 宽 | `pivot_wider()` | 两列 → 多列 |

掌握这两大 reshape 函数，让你的数据在“宽”与“长”之间自由切换，满足各种统计与可视化需求！
