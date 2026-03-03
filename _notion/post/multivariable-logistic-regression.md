## 1. 引言

逻辑回归是统计与数据科学中最常用的分类模型之一，当结局变量是**二分类**（如疾病/无疾病）时，它能有效刻画自变量与结局之间的关系。

当我们同时考虑多个影响因素时，就需要用到 **多因素逻辑回归（Multivariable Logistic Regression）**。

相比单因素分析，多因素模型能：

- 控制混杂因素
- 提供每个自变量在控制其他变量后的独立效应
- 为预测模型奠定基础

---

## 2. 模型原理

### 2.1 数学表达式

逻辑回归通过 logit 变换，将概率限制在 0–1 之间：

$$
\log\frac{p}{1-p} = \beta_0 + \beta_1 X_1 + \beta_2 X_2 + \dots + \beta_k X_k
$$

- $p$：事件发生的概率（如患病概率）
- $X_i$：第 $i$ 个自变量
- $\beta_i$：系数（log odds）

---

### 2.2 系数解释

- 系数 β ：对数优势比（log odds）
- **指数化后**：优势比（Odds Ratio, OR）
    - OR > 1：风险增加
    - OR < 1：风险降低
    - OR = 1：无关联

---

## 3. 数据准备与模拟

我们模拟一个包含 500 个样本的数据集，包括：

- **年龄（age）**：连续变量
- **性别（sex）**：二分类变量
- **吸烟（smoking）**：二分类变量
- **BMI**：连续变量
- **高血压（hypertension）**：结局变量（二分类）

```r
set.seed(123)
n <- 500
df <- data.frame(
  age = rnorm(n, mean = 50, sd = 10),
  sex = factor(sample(c("Male", "Female"), n, replace = TRUE)),
  smoking = factor(sample(c("Yes", "No"), n, replace = TRUE, prob = c(0.3, 0.7))),
  bmi = rnorm(n, mean = 25, sd = 4)
)

# 生成二分类结局
lin_pred <- -6 + 0.05 * df$age + 0.8 * (df$sex == "Male") + 1.2 * (df$smoking == "Yes") + 0.1 * df$bmi
prob <- exp(lin_pred) / (1 + exp(lin_pred))
df$hypertension <- rbinom(n, 1, prob)

```

---

## 4. 模型拟合

```r
m <- glm(hypertension ~ age + sex + smoking + bmi,
         data = df,
         family = binomial(link = "logit"))

summary(m)

```

输出结果会显示：

- 每个变量的系数、标准误、z 值和 p 值
- AIC、残差偏差等整体拟合指标

---

## 5. 系数转换为 OR

```r
or <- exp(coef(m))
ci <- exp(confint(m))
result <- cbind(OR = or, LCL = ci[,1], UCL = ci[,2])
round(result, 3)

```

解释：

- **OR**：在其他变量保持不变的情况下，该变量每增加一个单位（或从参照组切换到该水平），结局的优势变化倍数
- **LCL/UCL**：95% 置信区间

---

## 6. 模型拟合度评价

### 6.1 偏差检验（Deviance）

- 在 `summary(m)` 中比较 Null deviance 与 Residual deviance
- 差值显著（用卡方检验）说明模型拟合显著优于空模型

---

### 6.2 Hosmer–Lemeshow 检验

```r
library(ResourceSelection)
hoslem.test(df$hypertension, fitted(m))

```

- p 值 > 0.05：预测概率与实际观测一致性较好

---

### 6.3 ROC & AUC

```r
library(pROC)
roc_obj <- roc(df$hypertension, fitted(m))
plot(roc_obj)
auc(roc_obj)

```

- AUC 越接近 1，模型区分能力越强

---

### 6.4 校准曲线

```r
library(rms)
dd <- datadist(df)
options(datadist = "dd")
cal <- calibrate(lrm(hypertension ~ age + sex + smoking + bmi, data = df),
                 method = "boot", B = 200)
plot(cal)

```

- 检查预测概率与实际概率的吻合程度

---

## 7. 结果报告建议

在正式分析报告中，可以这样组织：

1. **研究问题**（结局、主要暴露、协变量）
2. **模型形式**（逻辑回归）
3. **系数、OR 与 95% CI**
4. **显著性检验结果**
5. **模型拟合度指标**（AIC、Hosmer–Lemeshow、AUC）
6. **校准度评价**

---

## 8. 小结

- 多因素逻辑回归可同时评估多个变量的独立效应
- 结果解读时务必报告 OR 及置信区间
- 模型评价要结合 **拟合度 + 区分能力 + 校准度**
- 在临床或政策研究中，建议进一步结合决策曲线分析（DCA）
