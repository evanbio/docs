## 1. sample 随机抽样

```r
sample(x, size, replace = FALSE)
# 从向量x中随机抽取size个元素，replace=TRUE表示可重复抽样
sample(1:10, 3)
# 例如从1到10中抽3个数
```

---

## 2. rev 反转向量

```r
rev(x)
# 返回x的反向排列
rev(1:5)    # 结果: 5 4 3 2 1

```

---

## 3. sort 排序

```r
sort(x, decreasing = FALSE)
# 按升序排序x，decreasing=TRUE为降序
sort(c(3, 1, 5, 2))   # 结果: 1 2 3 5

```

---

## 4. order 排序索引

```r
order(x, decreasing = FALSE)
# 返回排序后各元素的原始索引
x <- c(3, 1, 5, 2)
order(x)              # 结果: 2 4 1 3
x[order(x)]           # 按升序重排x: 1 2 3 5

```

---

## 5. 典型应用场景

- 数据采样/重采样、交叉验证等分析流程
- 反转时间序列、基因序列等
- 对向量/数据框排序、排名与重新排列
- 用 `order()` 进行复杂多列排序或分组

---

> 本页可长期补充如rank/rle等常用向量/排序函数的小技巧。
>
