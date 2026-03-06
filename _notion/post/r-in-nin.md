## 1. `%in%` 运算符：判断元素是否属于集合

```r
c('Hi', 'Wor', 2, 1, 3) %in% c('Hello', 'World', 1, 2, 3)
# 结果: FALSE FALSE TRUE TRUE TRUE
```

- 判断每个元素是否在目标集合中，返回逻辑向量
- 常用于批量过滤、子集选取、数据归属判断

---

## 2. `%nin%` 运算符（evanverse扩展）：判断元素不属于集合

```r

# 安装（首次使用时）
# remotes::install_github("evanbio/evanverse")

# 载入
library(evanverse)

# 用法
c("A", "B", "C") %nin% c("B", "D")
# 结果: TRUE FALSE TRUE
```

- 判断每个元素是否“不属于”目标集合，返回逻辑向量
- 适合反向筛选、批量剔除、查找非交集元素

---

## 3. 应用场景

- 批量数据过滤、差集筛选、标签/ID判断
- 与 which()/any()/all() 组合做复杂逻辑判断
- `%nin%` 为 `%in%` 的语义化补充，更易读易用

---

> 本页可长期补充集合归属/反归属的典型代码和实际项目经验。
>
