`lubridate` 是 **tidyverse** 中专门处理日期与时间的包，提供了比 base R 更直觉、简洁、强大的 API。

在时间数据处理中，它能大幅减少代码量并提高可读性，非常适合与 `dplyr`、`ggplot2` 等配合使用。

---

### 💡 适用场景

- ⏳ **快速解析日期时间**（如 `ymd("2023-10-05")`）
- 🧩 **提取时间组件**（年、月、日、小时等）
- 🔁 **时间运算**（加减天数、月份、小时等）
- 🧹 **日期对齐**（按月、周、季度聚合）
- 📊 **时间序列可视化与分析**（配合 ggplot2、dplyr）

---

### 🧠 自动识别日期格式

```r
library(lubridate)

ymd("2024-04-25")           # 年-月-日
mdy("04/25/2024")           # 月/日/年
dmy("25-04-2024")           # 日-月-年

ymd_hms("2024-04-25 18:00:00")  # 含时间
parse_date_time("25-Apr-2024", orders = "d-b-Y")  # 通用解析器

```

> 优势：免去手动指定 %Y-%m-%d 这种复杂格式，解析更直观。
> 

---

### 🕒 获取当前时间

```r
today()  # 当前日期（Date 类型）
now()    # 当前时间（POSIXct 类型）

```

---

### 📤 提取时间组件

```r
x <- now()

year(x)     # 年
month(x)    # 月（label = TRUE 返回月份名）
day(x)      # 日

hour(x); minute(x); second(x)

wday(x)     # 星期（1 = 星期日，可 label = TRUE）
yday(x)     # 一年中的第几天
week(x)     # 一年中的第几周
quarter(x)  # 季度

```

> 小贴士：在 ggplot2 绘图前，可以用这些函数快速生成分组变量。
> 

---

### 🔁 时间加减运算

```r
ymd("2024-01-01") + days(3)          # 加 3 天
now() - hours(2) + minutes(30)       # 时间偏移

```

> 优势：支持 days()、months()、years() 等直观的加减。
> 

---

### 📏 日期对齐（聚合前常用）

```r
floor_date(x, "month")    # 向下对齐
ceiling_date(x, "week")   # 向上对齐
round_date(x, "day")      # 四舍五入

```

> 常用于按月、按周进行分组统计。
> 

---

### ⏱ 计算时间差

```r
start <- ymd_hms("2024-04-25 08:00:00")
end   <- ymd_hms("2024-04-26 14:30:00")

interval(start, end)   # 时间区间对象
duration(end - start)  # 持续时间（秒为单位）
difftime(end, start, units = "hours")  # 小时差

```

> 选择建议：interval() 更适合做区间运算，difftime() 则适合直接获取差值。
>
