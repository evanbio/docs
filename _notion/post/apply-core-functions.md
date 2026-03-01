R 语言里所谓的 *apply 家族*，其实是一些简化循环操作的函数。

它们让我们可以用更简洁的方式，对矩阵、列表、数据框做批量计算。

这里总结最常用的 5 个成员：

---

## 1. `apply()`

- **适用对象**：矩阵、数组
- **作用**：按行或列执行函数
- **关键参数**：`MARGIN=1` 行，`MARGIN=2` 列

```r
m <- matrix(1:6, nrow=2)
apply(m, 1, sum)   # 每行求和
apply(m, 2, mean)  # 每列均值

```

⚠️ 数据框会被强制转成矩阵（可能全变字符），所以数据框通常不用 `apply`。

---

## 2. `lapply()`

- **适用对象**：列表、向量、数据框（当作列的列表）
- **返回值**：总是 **列表**

```r
lapply(1:3, function(x) x^2)
lapply(iris, class)   # 每列的数据类型

```

👉 最稳妥，不会丢信息。

---

## 3. `sapply()`

- **在 lapply 基础上尝试简化**结果
- 标量 → 向量；等长向量 → 矩阵

```r
sapply(1:5, sqrt)      # 向量
sapply(iris[1:4], mean) # 各列均值，向量

```

⚠️ 有时会被“过度简化”，结果形状不如预期。

---

## 4. `vapply()`

- **跟 sapply 类似，但更安全**
- 需要指定返回值类型模板 `FUN.VALUE`

```r
vapply(1:3, function(x) x^2, numeric(1))

```

👉 推荐在写正式/生产代码时用，避免类型意外。

---

## 5. `tapply()`

- **分组聚合**：对向量按因子分组，计算统计量

```r
tapply(iris$Sepal.Length, iris$Species, mean)

```

相当于“group by + summarize”。

---

✏️ 笔记建议：

平时写探索性代码 → 用 `sapply`/`lapply` 就够

写正式脚本/函数 → `vapply` 更稳

做分组统计 → `tapply` 简洁直接
