## **1. 生存分析简介**

生存分析（Survival Analysis）用于研究**从起始事件到目标事件发生所经历的时间分布**，广泛应用于医学（如总生存期、无进展生存期）、工程（零件失效时间）、经济等领域。

特点：

- 能处理**删失（censoring）**数据
- 能展示时间与生存概率的关系
- 可进行不同组之间的比较

---

## **2. 生存分析所需数据**

生存分析至少需要两个核心变量：

1. **time**：从起始时间点到事件发生或观察截止的时间（单位可为天、月、年）
2. **status**：事件状态
    - 1 = 事件已发生（如死亡、复发）
    - 0 = 删失（观测截止时未发生事件 / 失访）

---

## **3. time 与 status 的含义**

- **time**：时间长度，例如“患者从手术到死亡的天数”
- **status**：0 表示删失（还活着或未复发），1 表示事件已发生（死亡、复发等）

---

## **4. 常用 R 包与函数**

- **核心包**：`survival`（拟合模型）、`survminer`（绘图与可视化）
- **常用函数**：
    - `Surv(time, status)`：创建生存对象
    - `survfit()`：拟合 Kaplan–Meier 生存曲线
    - `ggsurvplot()`：绘制 KM 曲线（`survminer` 包）

---

## **5. 示例数据：`lung` 数据集**

`survival` 包自带的肺癌患者数据，核心变量：

- `time`：随访时间（天）
- `status`：1 = 删失，2 = 死亡（需要转换成 0/1）

```r
library(survival)
library(survminer)

# 加载数据
data(lung)

# 转换 status 为 0/1
lung$status01 <- ifelse(lung$status == 2, 1, 0)  # 1=死亡, 0=删失
lung$sex <- factor(lung$sex, levels = c(1, 2), labels = c("Male", "Female"))

# 创建生存对象
surv_obj <- Surv(time = lung$time, event = lung$status01)

# 拟合 Kaplan–Meier 曲线
fit_km <- survfit(surv_obj ~ sex, data = lung)

# 绘图
ggsurvplot(
  fit_km, data = lung,
  pval = TRUE, conf.int = TRUE, risk.table = TRUE,
  surv.median.line = "hv",
  legend.title = "Sex"
)

```

---

## **6. 中位生存时间**

中位生存时间（Median Survival Time）：生存概率降到 50% 时的时间点。

```r
fit_km
# 或者：
summary(fit_km)$table[ , "median"]

```

---

## **7. 95% 置信区间**

可以直接从 `summary()` 结果获取，也可以用 `Hmisc::bootkm()` 进行 bootstrap 估计：

```r
library(Hmisc)
# 女性中位生存时间的 bootstrap 置信区间
median_female <- bootkm(surv_obj[lung$sex == "Female"], q = 0.5, B = 999)
quantile(median_female, c(0.025, 0.975), na.rm = TRUE)

```

---

## **8. 多分组比较**

除了二分类变量（如性别），也可以用多分类变量（如 `ph.ecog`）：

```r
fit_multi <- survfit(Surv(time, status01) ~ factor(ph.ecog), data = lung)
ggsurvplot(fit_multi, data = lung, pval = TRUE, risk.table = TRUE)

```

---

## **9. 两两比较**

多组间生存差异可以用 `pairwise_survdiff()`：

```r
pairwise_survdiff(Surv(time, status01) ~ ph.ecog, data = lung)

```

默认是 log-rank 检验，可选择 p 值调整方法（如 `"BH"`）。

---

## **10. 累积风险函数**

累积风险（Cumulative Hazard）描述随时间累积的事件风险，可用：

```r
ggsurvplot(fit_km, data = lung, fun = "cumhaz")

```

曲线上升越快，说明单位时间内事件发生的概率越大。
