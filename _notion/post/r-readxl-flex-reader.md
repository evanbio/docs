Excel 在日常数据工作中几乎无处不在，但它**既不是数据库，也不是干净的 CSV**。作为“数据入口”，我们需要一个稳定、明确、可控的读取方案。`readxl` 的优势就在于：

- **无需 Java/Excel 依赖，跨平台稳定**（Windows/macOS/Linux）。
- **对 Excel 日期序列、数值、文本等有明确的解析策略**。
- **参数简洁**，和 tidyverse 生态契合。

这篇文章包含三部分：

1. `read_excel()` 的正确姿势（含“读前 checklist”）
2. **增强函数 `read_excel_flex()`**（源码 + 设计思路 + 返回值约定）
3. 典型业务场景配方与常见坑排查

---

## 1) `read_excel()` 正确姿势

### 1.1 最小例子与核心参数

```r
library(readxl)

# 最基本用法
df <- read_excel(
  path = "data/raw/survey.xlsx",   # 文件路径
  sheet = 1,                       # 工作表（编号或名称）
  range = NULL,                    # 读取范围，如 "B2:H999"
  skip = 0,                        # 跳过前 n 行（多用于说明/页眉）
  col_names = TRUE,                # 第一行是否作为列名
  col_types = NULL,                # 列类型（NULL=自动猜测；或手动指定）
  na = "",                         # 视为空值的标记
  trim_ws = TRUE                   # 去除文本首尾空格
)

```

**几点实用提醒：**

- **指定 `sheet` 与 `range` 能极大降低脏数据干扰**（比如页眉说明、合计行、图例等）。
- **`col_types` 优先级高于自动猜测**：对关键列（如**编码**、**ID**、**手机号**、**邮编**）强制设为 `"text"`，保留**前导零**与原始格式。
- **Excel 日期**：Excel 用“序列数”表示日期（Windows 常见原点是 `1899-12-30`；部分工作簿会使用 1904 系统）。`readxl` 会自动识别大多数情况并转换为 `Date`/`POSIXct`；若发现被读成 `numeric`，再手动转换即可。

### 1.2 读前 checklist（很管用）

- 这份表**有统一表头**吗？表头是否**只有一行**？
- 是否存在**合并单元格**/跨行说明？（尽量在 Excel 里“另存为原始数据”）
- 需不需要**指定范围**只读有效数据区？
- 哪些列需要**保留原样**（ID、编码、账号、邮编、SKU）→ `col_types = "text"`
- 是否包含**日期**、**时间**、**时区**信息？
- 空值用什么标记（`""`/`NA`//`N/A`）？需要在 `na` 里**统一纳入**。

---

## 2) 增强函数：`read_excel_flex()`（更可控、更友好）

为了让“读取→清洗→进入分析流”更顺滑，我写了一个增强封装，**在 `read_excel()` 不做魔改的前提下**补上常用能力：

- **CLI 反馈**：读取过程更明确（展示 sheet 列表、成功/失败提示）。
- **列名清理（可选）**：用 `janitor::clean_names()` 统一为`snake_case`，去空格与奇怪符号。
- **类型兜底**：支持显式 `col_types`；若不指定，再做一次 `readr::type_convert()` 二次优化（可选）。
- **校验与报错**：文件存在性、缺包提醒、sheet 合法性、range 提示。
- **参数命名贴近 `readxl`**：降低心智负担。

> 🔎 说明：readxl 有自己的类型猜测策略；本函数不改变底层逻辑，只是在边界条件与使用体验上更稳。
> 

### 2.1 源码（可直接用）

```r
#' 📥 Flexible Excel Reader (Upgraded)
#'
#' A pragmatic wrapper around readxl::read_excel() with:
#' - CLI output (via cli)
#' - Optional janitor::clean_names()
#' - Optional readr::type_convert() postprocessing
#'
#' @param file_path Path to .xlsx/.xls
#' @param sheet Sheet name or index (default: 1)
#' @param range Cell range like "B2:H999" (default: NULL)
#' @param skip Number of lines to skip (default: 0)
#' @param col_names Whether the first row is header (default: TRUE)
#' @param col_types Optional column types (character vector or "text"/"numeric"/...)
#' @param na NA markers (character vector), default ""
#' @param trim_ws Trim surrounding whitespaces (default: TRUE)
#' @param clean_names Clean column names via janitor (default: TRUE)
#' @param post_type_convert Whether to run readr::type_convert() afterward (default: FALSE)
#' @param verbose CLI messages (default: TRUE)
#'
#' @return tibble
#' @export
read_excel_flex <- function(
  file_path,
  sheet = 1,
  range = NULL,
  skip = 0,
  col_names = TRUE,
  col_types = NULL,
  na = "",
  trim_ws = TRUE,
  clean_names = TRUE,
  post_type_convert = FALSE,
  verbose = TRUE
) {
  # deps
  if (!requireNamespace("readxl", quietly = TRUE)) stop("Please install 'readxl'.")
  if (verbose && !requireNamespace("cli", quietly = TRUE)) stop("Please install 'cli'.")
  if (clean_names && !requireNamespace("janitor", quietly = TRUE)) stop("Please install 'janitor'.")
  if (post_type_convert && !requireNamespace("readr", quietly = TRUE)) stop("Please install 'readr'.")

  # file check
  if (!file.exists(file_path)) {
    if (verbose) cli::cli_alert_danger("❌ File not found: {.path {file_path}}")
    stop("File not found.")
  }

  # sheets info
  sheets <- readxl::excel_sheets(file_path)
  if (verbose) {
    cli::cli_h1("📥 Reading Excel")
    cli::cli_alert_info("📄 Sheets: {paste(sheets, collapse = ', ')}")
  }

  # basic read
  df <- readxl::read_excel(
    path = file_path,
    sheet = sheet,
    range = range,
    skip = skip,
    col_names = col_names,
    col_types = col_types,
    na = na,
    trim_ws = trim_ws
  )

  # clean names
  if (clean_names) {
    df <- janitor::clean_names(df)
    if (verbose) cli::cli_alert_success("✅ Column names cleaned (janitor::clean_names)")
  }

  # optional: smarter types (won't override explicit col_types)
  if (post_type_convert && is.null(col_types)) {
    df <- readr::type_convert(df, guess_integer = TRUE)
    if (verbose) cli::cli_alert_success("✅ Post type conversion (readr::type_convert)")
  }

  if (verbose) {
    cli::cli_alert_success("✅ Read sheet {.val {if (is.numeric(sheet)) sheets[sheet] else sheet}} from {.path {file_path}}")
    cli::cli_alert_info("Rows: {nrow(df)} | Cols: {ncol(df)}")
  }
  df
}

```

### 2.2 设计思路（你未来维护时会很有用）

- **职责单一**：只做“读取 + 最轻清理”，不在函数里做数据变形（如长宽变换、分组、衍生列），把责任边界切清。
- **行为可预测**：尽量贴近 `read_excel()` 的语义，新增参数**默认关闭**（如 `post_type_convert`）。
- **硬性兜底**：对 ID/编码等敏感列，**建议在调用时显式 `col_types`**，而不是依赖猜测。
- **CLI 可关闭**：批量任务中设置 `verbose = FALSE`，避免刷屏。

---

## 3) 典型业务场景配方（直接拷贝改变量名就能用）

### 3.1 指定列类型以**保留前导零**（强烈推荐）

```r
df <- read_excel_flex(
  "data/customers.xlsx",
  sheet = "master",
  col_types = c("text", "text", "numeric", "text")  # 如: id, zip, amount, phone
)

```

### 3.2 只读有效数据区（跳过页眉说明、合计）

```r
df <- read_excel_flex(
  "report.xlsx",
  sheet = 2,
  range = "B3:K500",  # 明确范围，避免“说明行”“空列”
  col_names = TRUE
)

```

### 3.3 多个 sheet 合并为一张表（加来源列）

```r
library(purrr); library(dplyr)

sheets <- readxl::excel_sheets("survey_all.xlsx")

df <- map_dfr(sheets, ~ {
  read_excel_flex("survey_all.xlsx", sheet = .x) |>
    mutate(source_sheet = .x)
})

```

### 3.4 读后“轻清理”：列名统一、类型稳妥、日期正确

```r
library(dplyr); library(lubridate)

df <- read_excel_flex("orders.xlsx", sheet = "2025Q1", post_type_convert = TRUE) |>
  mutate(
    order_date = as.Date(order_date),         # 若被读作字符，显式转 Date
    order_ts   = ymd_hms(paste(order_date, order_time), tz = "UTC"),
    amount_usd = readr::parse_number(amount)  # "$1,234.00" → 1234
  )

```

### 3.5 Excel 日期读成了数字？按系统原点转换

```r
# 通常 Windows 原点
df <- df |>
  mutate(date = as.Date(date_num, origin = "1899-12-30"))

# 少数工作簿使用 macOS 1904 系统
# mutate(date = as.Date(date_num, origin = "1904-01-01"))

```

> readxl 多数情况下会自动转换；若遇到“数字日期”，可能是列类型被你强制成了 "numeric" 或工作簿标记不一致。
> 

---

## 4) 常见坑点速查（现场排障更快）

- **列名不规则**：空格/中文括号/重复名 → 打开 `clean_names = TRUE`，统一成 `snake_case`。
- **脏行/多表头**：务必用 `skip` 与 `range` 切准数据区；必要时**先在 Excel 清理**。
- **合并单元格**：`readxl` 读取的是**单元格值**，合并不会自动“广播”到空白单元格；需要在 R 里手动 `tidyr::fill()`。
- **数值中混有符号**（`$1,234`/`1,234元`）：读入为字符后用 `readr::parse_number()` 清洗。
- **ID/邮编/手机号被科学计数法**：务必用 `col_types = "text"`。
- **日期/时间/时区**：读入后统一转 `Date`/`POSIXct`；跨系统存储时优先使用 UTC。
- **尾部合计/备注**：`readxl` 没有“跳过尾部行”的参数，**靠 `range` 限定**或读入后过滤。

---

## 5) 结语

这套做法把“读取 Excel”从一次性的手工操作，变成**可复用、可移植、可维护**的流程：

读入前有 checklist，读入时有增强函数兜底，读入后有明确的清理步骤和类型转换策略。

**你可以把 `read_excel_flex()` 放进自己的 utils 包**，在所有项目里一键复用。
