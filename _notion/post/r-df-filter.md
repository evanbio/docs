整理常用的 R 条件筛选操作，每一类都用具体小数据框举例，直接上手。

```r
df <- data.frame(
  id = 1:8,
  group = c("A", "B", "A", "B", "C", "C", "A", "B"),
  score = c(95, 81, 88, 60, 72, NA, 87, 100),
  label = c("pos", "neg", "pos", "neg", "pos", "neg", "neg", "pos")
)
df
```

| id | group | score | label |
| --- | --- | --- | --- |
| 1 | A | 95 | pos |
| 2 | B | 81 | neg |
| 3 | A | 88 | pos |
| 4 | B | 60 | neg |
| 5 | C | 72 | pos |
| 6 | C | NA | neg |
| 7 | A | 87 | neg |
| 8 | B | 100 | pos |

---

## 1. 筛选属于某向量的所有行

**需求**：提取所有 id 属于 1、3、5 的行。

```r
target <- c(1, 3, 5)
df %>% filter(id %in% target)

```

**输出：**

| id | group | score | label |
| --- | --- | --- | --- |
| 1 | A | 95 | pos |
| 3 | A | 88 | pos |
| 5 | C | 72 | pos |

---

## 2. 多条件组合筛选

**需求**：group 为 "A" 并且 score ≥ 90 的行。

```r
df %>% filter(group == "A" & score >= 90)
```

**输出：**

| id | group | score | label |
| --- | --- | --- | --- |
| 1 | A | 95 | pos |

---

## 3. 字符串条件筛选

**需求**：label 为 "pos" 的所有行。

```r
df %>% filter(label == "pos")

```

**输出：**

| id | group | score | label |
| --- | --- | --- | --- |
| 1 | A | 95 | pos |
| 3 | A | 88 | pos |
| 5 | C | 72 | pos |
| 8 | B | 100 | pos |

---

## 4. 缺失值相关筛选

**需求**：筛选出 score 缺失的行。

```r
df %>% filter(is.na(score))

```

**输出：**

| id | group | score | label |
| --- | --- | --- | --- |
| 6 | C | NA | neg |

---

## 5. 区间筛选

**需求**：score 介于 80 和 95（含）之间的所有行。

```r
df %>% filter(score >= 80 & score <= 95)

```

**输出：**

| id | group | score | label |
| --- | --- | --- | --- |
| 1 | A | 95 | pos |
| 2 | B | 81 | neg |
| 3 | A | 88 | pos |

---

## 6. 基础R写法对照

```r
df[df$id %in% c(1, 3, 5), ]
df[df$group == "A" & df$score >= 90, ]
df[df$label == "pos", ]
df[is.na(df$score), ]

```

---

## tips

- `%in%` 比多个“==”连接更简洁高效
- 多条件注意括号优先级
- 筛选字符要区分大小写
- 遇到类型不匹配先转换（as.character/as.numeric）
