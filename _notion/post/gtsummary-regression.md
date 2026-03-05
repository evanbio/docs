gtsummary 不仅仅能生成高质量的三线表、基线表，对于**线性回归、逻辑回归、Cox回归等模型**的结果整理与美化也是顶级利器。下面详细演示基础用法、参数调优、模型合并与生存分析等全部流程！

## 1. **基础回归模型（线性/逻辑回归）**

gtsummary 支持直接对**线性回归 (`lm`)、广义线性回归 (`glm`)、Cox 回归 (`coxph`)** 等模型结果美化输出。

### 1.1 线性回归示例（连续因变量）

```r
library(gtsummary)
library(dplyr)

data(trial)

# 拟合线性回归模型
lm_fit <- lm(marker ~ age + grade + trt, data = trial)

# 美化回归结果
tbl_reg <- tbl_regression(
  lm_fit,
  label = list(
    age ~ "Age (years)",
    grade ~ "Tumor Grade",
    trt ~ "Treatment"
  )
)
tbl_reg
```

---

### 1.2 逻辑回归（因变量为二分类）

```r
glm_fit <- glm(response ~ age + stage + grade + trt, data = trial, family = binomial)

tbl_logit <- tbl_regression(
  glm_fit,
  exponentiate = TRUE, # 结果按 OR(优势比) 输出
  label = list(
    age ~ "Age (years)",
    stage ~ "T Stage",
    grade ~ "Tumor Grade",
    trt ~ "Treatment"
  )
)
tbl_logit

```

> exponentiate = TRUE 会自动将logit系数转为 OR 和95%CI，适合医学论文！
> 

---

## 2. **常用参数说明**

| 参数 | 作用 | 说明 |
| --- | --- | --- |
| `exponentiate = TRUE` | 输出exp(β) | logistic, Cox回归时自动展示OR/HR及CI |
| `label = list()` | 自定义变量标签 | 让表格更美观、规范 |
| `show_single_row = c("xxx")` | 单行展示二分类 | 只输出一个水平，常见于哑变量 |
| `pvalue_fun = function(x) format(x, digits=2)` | p值美化 | 设置p值小数位等格式 |
| `conf.level = 0.95` | CI置信度 | 默认为0.95，可自定义 |
| `include = c(var1, var2)` | 指定展示变量 | 仅显示感兴趣变量 |

---

## 3. **多模型合并（tbl_merge）**

常见于“**多重回归模型并列**”论文 Table 2/Table 3：

```r
tbl_m1 <- tbl_regression(glm(response ~ age + trt, trial, family = binomial), exponentiate = TRUE)
tbl_m2 <- tbl_regression(glm(response ~ age + trt + stage, trial, family = binomial), exponentiate = TRUE)
tbl_merged <- tbl_merge(
  tbls = list(tbl_m1, tbl_m2),
  tab_spanner = c("Model 1", "Model 2")
)
tbl_merged

```

---

## 4. **美化&显著性标注**

```r
tbl_logit %>%
  bold_p(t = 0.3) %>%                 # 显著p值加粗（自定义阈值）
  italicize_labels() %>%              # 变量标签斜体
  modify_caption("**Table 2. Factors associated with Tumor Response (Logistic Regression)**")  # 设置标题

```

---

## 5. **Cox生存分析输出**

### 5.1 单变量和多变量Cox回归

```r
library(survival)
# Cox多变量回归
cox_fit <- coxph(Surv(ttdeath, death) ~ age + grade + trt, data = trial)

tbl_cox <- tbl_regression(
  cox_fit,
  exponentiate = TRUE,   # HR及CI
  label = list(
    age ~ "Age (years)",
    grade ~ "Tumor Grade",
    trt ~ "Treatment"
  )
)
tbl_cox
```

### 5.2 单变量Cox回归批量输出

```r
tbl_uv <- trial %>%
  select(ttdeath, death, age, grade, trt) %>%
  tbl_uvregression(
    method = coxph,
    y = Surv(ttdeath, death),
    exponentiate = TRUE
  )
tbl_uv

```

### 5.3 合并单变量+多变量Cox回归

```r
tbl_cox_merge <- tbl_merge(
  tbls = list(tbl_uv, tbl_cox),
  tab_spanner = c("Univariable", "Multivariable")
)
tbl_cox_merge
```

---

## 6. **输出与美化**

- `bold_p(t = 0.05)` 小于0.05的p值加粗
- `bold_labels()` 变量名加粗
- `modify_header(estimate ~ "HR", conf.low ~ "95%CI下限", ...)` 自定义列名
- `modify_caption("表2. Cox回归分析结果")` 加标题
- 支持`as_flex_table()`、`as_gt()`导出Word/PDF/PNG

```r
tbl_cox_merge %>%
  bold_labels() %>%
  modify_caption("**Table 2. Cox regression for overall survival**")
```

---

## 7. **导出为Word/PDF/图片**

```r
library(flextable)
tbl_cox_merge %>% as_flex_table() %>% save_as_docx(path = "cox_table.docx")

library(gt)
tbl_cox_merge %>% as_gt() %>% gtsave("cox_table.pdf")
tbl_cox_merge %>% as_gt() %>% gtsave("cox_table.png")

```

---

## 8. **Tips与进阶**

- 支持变量筛选、分组展示、列名行名中文美化、P值格式灵活调整
- 支持多模型、单变量、多变量批量输出与拼表
- 适合SCI、医学论文、基金报告、毕业论文等任意统计结果可视化场景
