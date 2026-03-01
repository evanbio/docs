在实际数据分析中，日期与时间信息常被拆分成多个字段（列）存储，例如：

- 年（`year`）
- 月（`month`）
- 日（`day`）
- 小时（`hour`）
- 分钟（`minute`）
- 秒（`second`）

这种情况常见于：

- 数据库导出的表格
- 传感器日志
- 分析前清理过的数据框

`lubridate` 提供了两个便捷函数：

- **`make_date()`**：构造日期（`Date` 类型）
- **`make_datetime()`**：构造日期时间（`POSIXct` 类型）

---

### ✅ `make_date()`：构造 `Date` 对象

```r
# 语法
make_date(year, month, day)

library(lubridate)

make_date(2024, 4, 25)
# [1] "2024-04-25"

```

- 只包含年月日信息
- 常用于按日期分组或作图

---

### ✅ `make_datetime()`：构造 `POSIXct` 对象

```r
# 语法
make_datetime(year, month, day, hour = 0, min = 0, sec = 0)

make_datetime(2024, 4, 25, 14, 30)
# [1] "2024-04-25 14:30:00 UTC"

```

- 包含时分秒信息
- 常用于时间序列分析、日志精确定位等

---

### 🧩 数据框应用示例

```r
library(dplyr)
library(lubridate)

df <- tibble(
  year = c(2024, 2024),
  month = c(4, 5),
  day = c(25, 10),
  hour = c(14, 9),
  minute = c(30, 15)
)

df %>%
  mutate(
    date_only = make_date(year, month, day),
    datetime_full = make_datetime(year, month, day, hour, minute)
  )

```

| year | month | day | hour | minute | date_only | datetime_full |
| --- | --- | --- | --- | --- | --- | --- |
| 2024 | 4 | 25 | 14 | 30 | 2024-04-25 | 2024-04-25 14:30:00 |
| 2024 | 5 | 10 | 9 | 15 | 2024-05-10 | 2024-05-10 09:15:00 |

---

### 💡 小贴士

- 当字段缺少小时/分钟信息时，`make_datetime()` 会自动补零。
- 如果只关心日期部分，应优先使用 `make_date()`，内存占用更小。
- 结合 `mutate()` 可以快速批量生成时间列。
