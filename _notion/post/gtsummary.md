## 1. 加载必要包与数据

```r
# 如未安装请先运行
install.packages("gtsummary")

library(gtsummary)
library(dplyr)

# 加载示例数据 trial
data(trial)
```

---

## 2. 默认生成分组汇总表（基础三线表）

我们用 `tbl_summary()` 快速生成一个分组描述性统计表（这里分组变量为 `trt`，即药物分组）：

```r
tbl_default <- tbl_summary(
  data = trial,
  by   = trt
)
print(tbl_default)
```

**说明：**

- 该表默认会自动识别变量类型，连续变量输出中位数 (四分位数)，分类型变量输出频数和百分比。
- 除了 `trt` 外，trial 数据集所有变量均被自动汇总展示。

---

## 3. `tbl_summary()` 核心参数详解与用法

`gtsummary::tbl_summary()` 支持多种参数，让三线表统计和格式满足各种分析需求。以下为最常用参数说明与代码示例：

| 参数（Argument） | 英文说明（Description） | 中文解释 |
| --- | --- | --- |
| `label` | specify the variable labels printed in table | 自定义表格中显示的变量名称 |
| `type` | specify the variable type (e.g. continuous, categorical, etc.) | 强制指定变量类型（连续/分类等） |
| `statistic` | change the summary statistics presented | 指定每列统计量的展示格式 |
| `digits` | number of digits the summary statistics will be rounded to | 结果四舍五入保留的小数位数 |
| `missing` | whether to display a row with the number of missing observations | 控制是否显示缺失值统计行 |
| `missing_text` | text label for the missing number row | 缺失行的标签文本 |
| `missing_stat` | statistic(s) to show on the missing row | 缺失行中显示的统计内容 |
| `sort` | change the sorting of categorical levels by frequency | 分类变量的排序方式 |
| `percent` | print column, row, or cell percentages | 百分比的计算基准（列/行/单元格） |
| `include` | list of variables to include in summary table | 需要汇总展示的变量列表 |

---

### 3.1 只汇总指定变量 & 排除变量

```r
# 只汇总 age 和 response
tbl_subset <- tbl_summary(
  data    = trial,
  include = c(age, response),
  by      = trt
)
print(tbl_subset)

# 排除 marker 和 death，其余变量全部汇总
tbl_exclude <- tbl_summary(
  data    = trial,
  include = -c(marker, death),
  by      = trt
)
print(tbl_exclude)
```

---

### 3.2 指定统计量格式 `statistic`

灵活定义连续、分类变量的统计方式（如均值±SD、频数/比例等）：

```r
# 连续变量用均值±SD，分类变量用 n/N (p%)
tbl_mean_sd_pct <- tbl_summary(
  trial,
  by = trt,
  statistic = list(
    all_continuous()  ~ "{mean} ({sd})",
    all_categorical() ~ "{n}/{N} ({p}%)"
  ),
  missing = "no"
)
print(tbl_mean_sd_pct)

# 单独设定某个变量的统计方式
tbl_age_mean <- tbl_summary(
  trial,
  by = trt,
  statistic = list(
    age ~ "{mean} ({sd})"
  ),
  missing = "no"
)
print(tbl_age_mean)

# 全部连续变量用中位数(IQR)，marker 用均值±SD
tbl_mixed <- tbl_summary(
  trial,
  by = trt,
  statistic = list(
    all_continuous() ~ "{median} ({p25}, {p75})",
    marker          ~ "{mean} ({sd})"
  ),
  missing = "no"
)
print(tbl_mixed)

```

---

### 3.4 小数位控制 `digits`

```r
# 所有连续变量保留1位小数
tbl_digits1 <- tbl_summary(
  trial,
  by     = trt,
  digits = all_continuous() ~ 1,
  missing = "no"
)
print(tbl_digits1)

# 精细设置不同变量小数位
tbl_digits2 <- tbl_summary(
  trial,
  by     = trt,
  digits = list(
    age     ~ 0,
    marker  ~ 2,
    ttdeath ~ 1
  ),
  missing = "no"
)
print(tbl_digits2)

```

---

### 3.5 变量标签重命名 `label`

```r
tbl_labels1 <- tbl_summary(
  trial,
  by    = trt,
  label = list(
    age      ~ "年龄 (years)",
    marker   ~ "Marker Level (ng/mL)",
    stage    ~ "T Stage",
    grade    ~ "Tumor Grade",
    response ~ "Tumor Response",
    death    ~ "死亡情况",
    ttdeath  ~ "生存时间 (months)"
  ),
  missing = "no"
) %>%
  add_overall()
print(tbl_labels1)

```

---

### 3.6 百分比基准 `percent`

```r
# 按列（group）算百分比
tbl_pct_col <- tbl_summary(
  trial,
  by      = trt,
  include = c(grade, response),
  percent = "column",
  missing = "no"
)
print(tbl_pct_col)

# 按行算百分比
tbl_pct_row <- tbl_summary(
  trial,
  by      = trt,
  include = c(grade, response),
  percent = "row",
  missing = "no"
)
print(tbl_pct_row)

# 单元格基准
tbl_pct_cell <- tbl_summary(
  trial,
  by      = trt,
  include = c(grade, response),
  percent = "cell",
  missing = "no"
)
print(tbl_pct_cell)

# 只显示频数
tbl_n_only <- tbl_summary(
  trial,
  by        = trt,
  include   = c(grade, response),
  statistic = all_categorical() ~ "{n}",
  missing   = "no"
)
print(tbl_n_only)

```

---

### 3.7 缺失值展示控制

```r
# 默认行为：仅有缺失的变量才显示缺失行
tbl_missing_def <- tbl_summary(trial, by = trt)
print(tbl_missing_def)

# 不显示缺失行
tbl_missing_no <- tbl_summary(
  trial, by = trt, missing = "no"
)
print(tbl_missing_no)

# 每个变量都显示一行缺失（即使为0）
tbl_missing_always <- tbl_summary(
  trial, by = trt, missing = "always"
)
print(tbl_missing_always)

# 中文标签与缺失统计数
tbl_missing_count <- tbl_summary(
  trial,
  by           = trt,
  missing      = "ifany",
  missing_text = "缺失值",
  missing_stat = "{N_miss}"
)
print(tbl_missing_count)

# 只显示缺失比例
tbl_missing_pct <- tbl_summary(
  trial,
  by           = trt,
  missing      = "ifany",
  missing_text = "缺失值",
  missing_stat = "{p_miss}"
)
print(tbl_missing_pct)

```

---

### 3.8 分类变量排序 sort

```r
# 按字母顺序
tbl_default_sort <- tbl_summary(
  trial,
  by      = trt,
  include = c(grade),
  missing = "no",
  sort    = list(all_categorical() ~ "alphanumeric")
)
print(tbl_default_sort)

# 按频次
tbl_freq_sort <- tbl_summary(
  trial,
  by      = trt,
  include = c(grade),
  missing = "no",
  sort    = list(all_categorical() ~ "frequency")
)
print(tbl_freq_sort)

# 只对 grade 分类变量按频次排序
tbl_grade_freq_only <- tbl_summary(
  trial,
  by      = trt,
  include = c(grade, response),
  missing = "no",
  sort    = list(grade ~ "frequency")
)
print(tbl_grade_freq_only)

```

---

### 3.9 强制指定变量类型 type

```r
# 强制 marker 按分类变量处理
tbl_type1 <- tbl_summary(
  trial,
  by   = trt,
  type = list(marker ~ "categorical"),
  missing = "no"
)
print(tbl_type1)

# 多类型同时指定
tbl_type4 <- tbl_summary(
  trial,
  by   = trt,
  type = list(
    marker   ~ "continuous2",
    grade    ~ "categorical",
    response ~ "dichotomous",
    age      ~ "continuous"
  ),
  statistic = all_continuous()  ~ "{mean} ({sd})",
  missing   = "no"
)
print(tbl_type4)
```

---

## 4. 使用 {gtsummary} 的 add_*() 函数添加统计信息

gtsummary 提供了多个 add_*() 后缀的函数，可以链式添加**总体、样本量、p 值、差异、q 值、统计量标签等**信息，让你的三线表功能更完整、分析结果一目了然。

---

### 4.1 增加总体（Overall）统计列

```r
tbl_overall <- tbl_summary(
  trial,
  by = trt,
  missing = "no"
) %>%
  add_overall()
print(tbl_overall)

```

> 说明：表格最左侧会多出一列“Overall”，展示全体样本的描述统计量。
> 

---

### 4.2 增加分组样本量（N）

```r
tbl_add_n <- tbl_summary(
  trial,
  by = trt,
  missing = "no"
) %>%
  add_n()
print(tbl_add_n)

```

> 说明：在表格左侧增加“N”一列。
> 

---

### 4.3 增加组间差异的 P 值

```r
tbl_add_p <- tbl_summary(
  trial,
  by = trt,
  missing = "no"
) %>%
  add_p()
print(tbl_add_p)

```

> 说明：自动为每个变量添加合适的检验（t 检验、卡方、Fisher），结果表会多出一列 p.value。
> 

---

### 4.4 增加均值差/比值比及置信区间

```r
tbl_add_diff <- tbl_summary(
  trial,
  by = trt,
  statistic = all_continuous() ~ "{mean} ({sd})",
  missing = "no"
) %>%
  add_difference(conf.level = 0.95)
print(tbl_add_diff)

```

> 说明：连续变量为均值差及 CI，二分类变量为比值比（OR）及 CI。
> 

---

### 4.5 增加 Q 值（多重假设校正）

```r
tbl_add_q <- tbl_summary(
  trial,
  by = trt,
  missing = "no"
) %>%
  add_p() %>%
  add_q()
print(tbl_add_q)

```

> 说明：对 p 值进行 FDR 校正（Benjamini-Hochberg 方法），结果多一列 q.value。
> 

---

### 4.6 增加统计量标签

```r
tbl_add_stat_label <- tbl_summary(
  trial,
  by = trt,
  statistic = all_continuous() ~ "{mean} ({sd})",
  missing = "no"
) %>%
  add_stat_label()
print(tbl_add_stat_label)

```

> 说明：在每个变量名后面自动标注所用统计量格式（如“mean (sd)”）。
> 

---

**Tips：**

- 所有 add_*() 函数都可以与前面的 tbl_summary 链式组合。
- 可多个函数一起用，极大丰富三线表内容与解释性。

---

## 5. 使用 {gtsummary} 函数美化和格式化三线表

`gtsummary` 提供一系列美化与格式化函数，可以自定义表头、分组、标题、脚注、加粗/斜体等，轻松实现高质量“出版级”表格。

| 函数 Function | 英文说明 Description | 中文解释 |
| --- | --- | --- |
| `modify_header()` | update column headers | 修改/自定义列标题 |
| `modify_footnote_header()` | update column header footnote | 修改列标题（表头）脚注 |
| `modify_footnote_body()` | update table body footnote | 修改表格主体的脚注 |
| `modify_spanning_header()` | update spanning headers | 添加/修改跨列的大标题 |
| `modify_caption()` | update table caption/title | 设置表格标题/注释 |
| `bold_labels()` | bold variable labels | 变量名称加粗 |
| `bold_levels()` | bold variable levels | 分类变量的水平（分组标签）加粗 |
| `italicize_labels()` | italicize variable labels | 变量名称斜体 |
| `italicize_levels()` | italicize variable levels | 分类变量的水平斜体 |
| `bold_p()` | bold significant p-values | 显著性 p 值加粗 |

---

### 5.1 修改表头标题（modify_header）

可用 `modify_header()` 自定义每一列的标题文本，支持 glue 语法（如 `{level}`、`{n}`）：

```r
tbl_format <- tbl_summary(trial, by = trt) %>%
  modify_header(
    label ~ "**变量**",  # 将“Characteristic”列标题改为加粗“变量”
    all_stat_cols() ~ "**{level}**<br>N = {n}" # 统计量列展示分组与样本量
  )
print(tbl_format)

```

---

### 5.2 跨列大标题（modify_spanning_header）

为分组统计量列添加统一跨列标题：

```r
tbl_span <- tbl_format %>%
  modify_spanning_header(
    all_stat_cols() ~ "**治疗分组**"
  )
print(tbl_span)

```

---

### 5.3 设置表格标题（modify_caption）

为表格整体加上表题说明：

```r
tbl_caption <- tbl_span %>%
  modify_caption("**表1: 患者特征汇总**")
print(tbl_caption)
```

---

### 5.4 添加脚注（modify_footnote）

为任意统计量列或 p 值列添加详细脚注说明：

```r
tbl_foot <- tbl_caption %>%
  modify_footnote(
    all_stat_cols() ~ "分类变量：n (%)；连续变量：均值 (SD)",
    p.value ~ "P 值由卡方或 t 检验获得"
  )
print(tbl_foot)

```

---

### 5.5 美化变量/分组字体（加粗/斜体/突出显著性）

- **变量标签加粗：**
    
    ```r
    tbl_bold <- tbl_foot %>% bold_labels()
    print(tbl_bold)
    ```
    
- **变量水平加粗：**
    
    ```r
    tbl_bold_lv <- tbl_foot %>% bold_levels()
    print(tbl_bold_lv)
    ```
    
- **变量标签斜体：**
    
    ```r
    tbl_italic <- tbl_foot %>% italicize_labels()
    print(tbl_italic)
    ```
    
- **显著 p 值加粗：**
    
    ```r
    tbl_boldp <- tbl_foot %>% bold_p(t = 0.05) # P<0.05 自动加粗
    print(tbl_boldp)
    ```
    

---

### 5.6 其他表格美化主题（主题快速美化）

gtsummary 提供一键主题美化，直接调用即可：

```r
theme_gtsummary_journal("lancet")
theme_gtsummary_compact()
```

---

**Tips：**

- 上述所有美化函数均可链式组合。
- 你可以把美化和 add_*() 一起使用，任意顺序调整，得到符合审美和期刊要求的三线表！

---

## 6. 使用 tidyselect 语法与辅助选择函数

### 6.1 全面支持 tidyselect！

{gtsummary} 所有函数的变量选择（如 `include`, `sort`, `digits`, `label`, `statistic`, `type` 等参数）**完全支持 tidyselect 辅助器**，和 `dplyr::select()` 保持一致，极为强大且易用：

- `starts_with("xxx")`
- `contains("xxx")`
- `ends_with("xxx")`
- `everything()`
- 以及 **负号 - 排除法**
- 甚至可以用 `where(is.numeric)` 选择所有数值型变量

**示例：**

```r
tbl_select <- tbl_summary(
  trial,
  include = starts_with("t"),   # 选中所有以 t 开头的变量
  by = trt
)
print(tbl_select)

```

> 这样可以非常方便地批量处理复杂数据集。
> 

---

### 6.2 all_continuous() / all_categorical() 辅助函数

gtsummary 还提供了便捷函数，用于**批量指定所有连续型或分类变量的统计方式**：

- `all_continuous()` 匹配所有连续型变量
- `all_categorical()` 匹配所有分类变量

**示例：**

```r
tbl_mix <- tbl_summary(
  trial,
  by = trt,
  statistic = list(
    all_continuous()  ~ "{mean} ({sd})",
    all_categorical() ~ "{n} ({p}%)"
  ),
  missing = "no"
)
print(tbl_mix)

```

---

### 6.3 continuous2：连续变量多行摘要（期刊风多行）

有些医学/生信/SCI 期刊要求连续变量一栏**多行展示**（如总例数/中位数/IQR/极值等），此时用 type = "continuous2"！

**示例：**

```r
tbl_cont2 <- tbl_summary(
  trial,
  by = trt,
  include = age,
  type = all_continuous() ~ "continuous2",
  statistic = all_continuous() ~ c(
    "{N_nonmiss}",                # 非缺失样本数
    "{median} ({p25}, {p75})",    # 中位数 (P25, P75)
    "{min}, {max}"                # 最小值, 最大值
  ),
  missing = "no"
)
print(tbl_cont2)

```

---

## 7. 用 `{gt}` 包函数进一步美化 gtsummary 表格

当你用 `gtsummary::as_gt()` 把三线表转成 `gt` 对象后，可以用 gt 包丰富的美化函数自定义表格外观。

---

### 7.1 高亮显著 p 值单元格

```r
gt_table <- as_gt(tbl_summary(trial, by = trt) %>% add_p())

gt_table <- gt_table %>%
  tab_style(
    style = cell_fill(color = "lightyellow"),
    locations = cells_body(
      columns = p.value,
      rows = p.value < 0.2
    )
  )
```

> 效果：自动为所有 p < 0.2 的单元格填充淡黄色背景。
> 

---

### 7.2 统计量列内容居中

```r
gt_table <- gt_table %>%
  cols_align(
    align = "center",
    columns = c("stat_1", "stat_2")
  )

```

> 效果：让所有统计量数据在列中居中显示，风格更统一。
> 

---

### 7.3 添加表格脚注/来源注释

```r
gt_table <- gt_table %>%
  tab_source_note(
    source_note = "数据来源：gtsummary::trial 数据集"
  )

```

> 效果：表格下方自动加上来源说明或备注。
> 

---

### 7.4 单元格字体/背景自定义（进阶）

```r
gt_table <- gt_table %>%
  tab_style(
    style = list(
      cell_text(weight = "bold", color = "red"),   # 粗体+红色字体
      cell_fill(color = "#FFF3CD")                 # 淡黄色背景
    ),
    locations = cells_body(
      columns = p.value,
      rows = p.value < 0.2
    )
  )

```

> 效果：对特别显著的 p 值（如 < 0.2）用粗体红色加特殊背景进一步突出。
> 

---

### 7.5 多条件叠加美化

所有 gt 格式化函数都可以**链式组合**，可以针对不同列和行条件，灵活实现复杂美化需求。

---

**Tips：**

- gt 包支持几乎所有 Excel/PPT/Word 能想到的表格样式需求。
- 更多如数字格式、字体大小、行高、合并单元格等，都有专门函数。

---

## 8. gtsummary 进阶技巧（分组显示、检验指定、表格堆叠/合并）

### 8.1 控制二分类变量只显示某一水平

默认情况下，二分类变量（如 0/1）会只会显示一行。如果你关心另一个水平（如阳性/事件），可以用 `value` 参数筛选：

```r
# 默认会显示 response = 1 一行
trial %>%
  select(response, trt) %>%
  tbl_summary(by = trt)

# 只显示 response = 0 的那一行
trial %>%
  select(response, trt) %>%
  tbl_summary(
    by = trt,
    value = list(response ~ 0) # 只输出 response = 0
  )
```

> 常用于只想显示“阳性/发病/事件”比例的临床报表。
> 

---

### 8.2 指定不同变量的检验方法

`add_p()` 默认会自动选择检验方法（如 t 检验/卡方），你可以针对不同变量**手动指定检验类型**：

```r
trial %>%
  select(age, grade, trt) %>%
  tbl_summary(by = trt, missing = "no") %>%
  add_p(
    test = list(
      age ~ "wilcox.test",        # 年龄用 Wilcoxon 秩和检验
      grade ~ "fisher.test"       # grade 用 Fisher 精确检验
    )
  )

```

> 极适用于样本量小、不满足正态分布时。
> 

---

### 8.3 垂直堆叠多个三线表（tbl_stack）

可将多张三线表纵向合并，并用 group_header 标注分块，常用于“基线特征+结局”一表展示：

```r
# 基线表
tbl1 <- trial %>%
  select(age, marker, trt) %>%
  tbl_summary(by = trt, missing = "no")
# 结局表
tbl2 <- trial %>%
  select(response, death, trt) %>%
  tbl_summary(by = trt, missing = "no")
# 垂直堆叠
tbl_stacked <- tbl_stack(
  tbls = list(tbl1, tbl2),
  group_header = c("基线特征", "结局指标")
)
print(tbl_stacked)
```

---

### 8.4 水平合并描述性统计与回归模型结果（tbl_merge）

能将三线表与模型输出横向拼接，常用于论文主表（描述性+回归分析并列）：

```r
library(gtsummary)
library(lme4)

# 描述性统计表
tbl_summary <- trial %>%
  select(age, grade, trt) %>%
  tbl_summary(by = trt)

# 回归分析表（如线性回归）
tbl_regression <- lm(marker ~ age + grade, trial) %>%
  tbl_regression()

# 水平合并，两表独立大标题
tbl_merged <- tbl_merge(
  tbls = list(tbl_summary, tbl_regression),
  tab_spanner = c("**描述性统计**", "**回归模型**")
)
print(tbl_merged)

```

> 适用于论文/Table 1、Table 2 的主流结构，极大提升可读性。
> 

---

## 9. 三线表导出：Word、图片、PDF

无论你用 `gtsummary` 还是 `gt`，都可以方便地将高质量三线表**导出为 Word、图片、PDF**，直接插入论文或汇报材料。

---

### 9.1 导出为 Word（推荐用于论文/基金）

**方法1：用 `flextable` 保存为 .docx**

```r
# 安装依赖（仅第一次）
# install.packages("flextable")
# install.packages("officer")

library(gtsummary)
library(flextable)

tbl <- tbl_summary(trial, by = trt) %>%
  add_p() %>%
  bold_labels()

tbl %>%
  as_flex_table() %>%               # 转 flextable
  save_as_docx(path = "my_table.docx") # 保存为 Word 文件

```

- 运行后，R 工作目录下会出现 `my_table.docx` 文件，格式美观。

---

### 9.2 导出为图片（PNG 等）

**方法2：用 `gt` 包直接保存 PNG**

```r
# 安装依赖
# install.packages("gt")
# install.packages("webshot2") # 必须安装才能保存为图片

library(gtsummary)
library(gt)

tbl <- tbl_summary(trial, by = trt) %>%
  add_p() %>%
  bold_labels()

tbl %>%
  as_gt() %>%              # 转 gt 对象
  gtsave(filename = "my_table.png")  # 保存为 PNG 图片

```

- 可以直接插入 PPT、微信稿、Word 文档。

---

### 9.3 导出为 PDF（论文附表/打印版）

```r
# install.packages("gt")
# install.packages("webshot2")

tbl %>%
  as_gt() %>%
  gtsave(filename = "my_table.pdf")

```

- **注意**：图片/PDF 导出依赖 webshot2（首次用还需 webshot2::install_phantomjs()）。

---

### 9.4 其它：HTML、LaTeX、R Markdown

- **HTML**：as_gt() 直接在 R Markdown/Quarto 里输出即可
- **LaTeX**：gtsummary::as_kable() 可用于学术 LaTeX 表格导出
- **R Markdown**：全部兼容，无缝插入

---

### 9.5 总结 Tips

- Word 导出：推荐 `as_flex_table()` + `save_as_docx()`，兼容性最好。
- 图片/PDF 导出：用 gt 的 `gtsave()`，颜值高、代码短。
- 需要自定义字号/纸张、边框、字体等，建议提前用 `gt` 美化后再导出。
- 各导出函数都能链式接在 `tbl_summary()`/`add_p()` 后直接使用！

---

## 10. 总结

`gtsummary` + `gt` 组合为R用户提供了**高效、灵活且出版级**的医学/生信三线表解决方案。无论你是日常科研统计、临床论文、基金项目，还是期刊投稿、国际会议，都能一站式搞定高质量表格输出！

### 你将收获：

- 一行代码生成**分组描述性统计三线表**
- 参数全面可控，自由定制统计量、标签、小数位、缺失显示、排序等
- 多种add_*()函数一键补全总体、样本量、P/Q值、差异、统计标签
- modify_*()美化函数实现**任意风格/注释/字体/标题/脚注**
- **支持tidyselect语法**，轻松批量选择/处理变量
- **连续变量多行摘要**（continuous2）满足医学SCI需求
- 可与gt、flextable等R生态工具无缝衔接，**导出Word、PDF、PNG、HTML、LaTeX**
- 丰富进阶用法支持：自定义检验、分块堆叠/合并表格、模型结果与描述性统计同表、全自动输出等

### 小结Tips

- 日常科研**表1/附表**优先推荐gtsummary，省时省心，表格美观可直接投稿
- 复杂格式/特殊排版/国际审稿建议先用gtsummary美化后再用gt进一步自定义
- **所有流程都可复用、批量、自动化，极大提高效率与专业性**
- R语言强大的可组合性让你轻松应对“最后一公里”的个性化表格要求

---

**Happy Table-Making！🥳**
