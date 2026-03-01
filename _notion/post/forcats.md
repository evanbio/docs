在 R 中，**factor** 是表示分类变量（categorical variable）的基础数据类型。

虽然 `factor()` 可以创建因子，但在实际数据分析中，我们经常需要对因子进行：

- **排序**（改变绘图或分析的顺序）
- **重命名**（让类别标签更直观）
- **合并**（减少稀有类别）
- **删除**（去掉未使用的 levels）
- **重新编码**（方便分析与可视化）

原生 R 语法可以完成这些任务，但通常较繁琐且可读性差。

`forcats` 是 **tidyverse** 生态中的因子处理工具包，它提供了一套以 `fct_` 开头的函数，**语义清晰、风格统一、可与 dplyr、ggplot2 无缝配合**。

---

### 📦 核心函数速查表

| 函数名 | 用途说明 | 常见场景 |
| --- | --- | --- |
| `fct_inorder()` | 按因子**首次出现顺序**创建 levels | 保留原始顺序绘图 |
| `fct_infreq()` | 按频率降序排列 levels | 条形图按频率排序 |
| `fct_relevel()` | 手动调整因子水平顺序 | 把关键类别放前面 |
| `fct_rev()` | 反转 levels 顺序 | 翻转坐标轴显示 |
| `fct_drop()` | 删除未使用的 levels | 清理多余类别 |
| `fct_lump()` | 聚合低频因子为 `"Other"` | 压缩稀有类别 |
| `fct_recode()` | 重命名 levels（类似 `rename()`） | 改标签 |
| `fct_collapse()` | 多个 levels 合并为一个新组 | 归类 |
| `fct_count()` | 统计每个 level 频数（类似 `count()`） | 快速检查类别分布 |
| `fct_match()` | 检查因子是否包含特定水平 | 数据验证 |

---

### ✨ 详细使用场景与示例

### 1️⃣ 创建分类变量

```r
factor(c("low", "medium", "high"),
       levels = c("low", "medium", "high"),
       ordered = TRUE)

library(forcats)
fct_inorder(c("B", "A", "C", "B"))

```

> fct_inorder() 会根据数据首次出现的顺序来设定 levels，非常适合保留原始顺序绘图。
> 

---

### 2️⃣ 重排序水平

```r
f <- factor(c("low", "medium", "high"))

fct_relevel(f, "high", "medium", "low")  # 自定义顺序
fct_rev(f)                               # 反转顺序

```

> 重排序对 ggplot2 特别重要，可直接影响 x 轴或 y 轴类别的排列。
> 

---

### 3️⃣ 按频率排序（常用于绘图）

```r
f <- c("A", "B", "A", "C", "B", "B")
fct_infreq(f)

```

> 频率高的类别会排在前面，绘制条形图时非常直观。
> 

---

### 4️⃣ 聚合低频类别

```r
f <- c("apple", "apple", "banana", "banana", "kiwi", "orange", "pear")

fct_lump(f, n = 2)
# 保留频率最高的 2 类，其余合并为 "Other"

```

> n 可以指定保留的类别数量，或者用 prop 保留占比。
> 

---

### 5️⃣ 删除未使用的 levels

```r
f <- factor(c("A", "B", "C"), levels = c("A", "B", "C", "D"))
fct_drop(f)

```

> 清理数据后很实用，避免无意义的空类别干扰分析。
> 

---

### 6️⃣ 重命名 & 合并组别

```r
# 重命名
fct_recode(f, Low = "A", High = "C")

# 合并
fct_collapse(f, Fruit = c("apple", "banana"),
                Other = c("kiwi", "orange"))

```

> fct_recode() 适合简单重命名，fct_collapse() 则适合大规模合并。
> 

---

### 💡 总结

- `forcats` 让因子处理更**直观、可读性高、代码更短**。
- 与 `dplyr` 和 `ggplot2` 配合时，特别适合用在 `mutate()` 或绘图的美学映射中。
- 如果你在做分类变量的**整理、排序、清理、合并**，`forcats` 是必备工具。
