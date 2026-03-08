`foreach` 包是R处理批量循环任务的利器，

优点包括：无需提前生成结果容器、自动拼接结果、灵活设定并行与容错，非常适合高通量和复杂批处理。

---

## 1. foreach基本用法（%do%）

```r
library(foreach)
foreach(i = 1:5) %do% {
  print(i)
}
```

- 等价于for循环，但更优雅、结果可控。

## 2. 自动拼接（.combine参数）

```r
foreach(i = 1:4, .combine = c) %do% sqrt(i)
# 输出：1.000000 1.414214 1.732051 2.000000

foreach(i = 1:3, .combine = rbind) %do% data.frame(a = i, b = i^2)

```

- `.combine = c/list/rbind/cbind/data.frame`自动把结果拼接成向量、list或表格。

---

## 3. 错误捕获（.errorhandling参数）

```r
foreach(i = 1:4, .errorhandling = "pass") %do% {
  if (i == 2) stop("Test error")
  i
}
# 会跳过第2个循环，返回其他结果

```

- 常用："pass"（遇错跳过）、"stop"（遇错中断）、"remove"（丢弃出错结果）。

---

## 4. 并行处理（%dopar%）

```r
library(doParallel)
registerDoParallel(cores = 2)
foreach(i = 1:4) %dopar% sqrt(i)
# 一行代码切换为多核并行

```

---

## 5. 应用tips与场景

- 不用事先准备结果list，代码极简
- 支持大批量模拟/文件/模型训练等批量任务
- 和for循环相比，自动管理输出和容错，适合自动化分析流程

---

## 6. 常见易错

- 结果自动拼接，但若返回结构不一致可能报错
- 并行时要预先注册核心
- .errorhandling虽可跳过报错，但需要后续检查缺失/失败部分

---

本页持续补充foreach相关的高频用法、踩坑和项目经验。
