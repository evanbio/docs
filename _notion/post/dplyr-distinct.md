`distinct()` 是 **`dplyr`** 包中用于去重的函数，能从数据框中**提取唯一值组合**。常见于数据清洗、探索与样本抽取等流程。

---

## 1. 函数原型

```r
distinct(.data, ..., .keep_all = FALSE)
```

| 参数 | 含义 |
| --- | --- |
| `.data` | 数据框（`data.frame` 或 `tibble`） |
| `...` | 指定要去重的列（一个或多个表达式），默认对所有列去重 |
| `.keep_all` | 是否保留未参与去重的其他列（`TRUE`：保留整行，`FALSE`：只返回去重列） |

---

## 2. 核心场景与示例

首先准备示例数据：

```r
library(dplyr)
df <- tibble(
  name  = c("Alice", "Bob", "Alice", "Alice", "Bob"),
  score = c(90, 85, 90, 92, 88),
  age   = c(20, 21, 20, 23, 21),
  time  = as.Date(c("2025-01-01","2025-01-02","2025-01-03","2025-01-04","2025-01-05"))
)

```

### 2.1 完全去重（对所有列）

```r
distinct(df)
```

*输出：*

只保留行完全相同的记录一次。

---

### 2.2 按指定列去重

仅提取 `name` 与 `score` 的唯一组合：

```r
distinct(df, name, score)

```

*输出：*

返回所有不同的 `(name, score)` 对。

---

### 2.3 保留整行信息

对 `name` 去重，保留每个唯一 `name` 的整行数据（默认保留**第一次**出现那条）：

```r
distinct(df, name, .keep_all = TRUE)
```

*输出：*

每个 `name` 只出现一次，且带回对应的 `score`、`age`、`time`。

---

### 2.4 控制保留记录顺序

有时需要“按时间保留最新”或“按分数保留最高”：

```r
# 按 time 降序排序，再按 name 去重 → 保留每人最新记录
df %>%
  arrange(desc(time)) %>%
  distinct(name, .keep_all = TRUE)

# 按 score 降序排序，再按 name 去重 → 保留每人最高分记录
df %>%
  arrange(desc(score)) %>%
  distinct(name, .keep_all = TRUE)
```

---

## 3. 实用技巧

- **快速查看某列类别**：`distinct(df, some_column)`
- **配合 `count()`**：先 `distinct(df, col1, col2) %>% count(col1)`
- **分组抽样**：按某列去重并保留全行，相当于每组抽一条
- **管道友好**：任何 `dplyr` 流水线中都可随时插入 `distinct()`

---

> 小结
> 
> - `distinct()` 是数据清洗中最常用的“去重”工具；
> - 默认对所有列完全去重，指定列后只看列组合；
> - 设置 `.keep_all = TRUE` 可保留全行；
> - 配合 `arrange()`，即可灵活选择保留“最新”“最高”“最早”等记录。
