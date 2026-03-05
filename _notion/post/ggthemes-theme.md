> 简介
> 
> 
> [`ggthemes`](https://github.com/jrnold/ggthemes) 是 `ggplot2` 官方生态中的扩展包，提供了多达 20 多种经典出版级与报表级主题（例如 Economist、WSJ、Tufte、Solarized 等）和配色方案，一行代码即可让你的图表风格立刻焕然一新。
> 

---

## 1. 安装与加载

```r
# 安装（若尚未安装）
# install.packages("ggthemes")

# 加载依赖
library(ggplot2)
library(ggthemes)
```

---

## 2. 准备示例数据

```r
# 对 mtcars 做因子化处理，便于映射
mtcars2 <- within(mtcars, {
  vs   <- factor(vs,   labels = c("V-shaped", "Straight"))
  am   <- factor(am,   labels = c("Automatic", "Manual"))
  cyl  <- factor(cyl)
  gear <- factor(gear)
})

```

---

## 3. 绘制基础散点图

```r
p1 <- ggplot(mtcars2) +
  geom_point(aes(x = wt, y = mpg, colour = gear)) +
  labs(
    title    = "Fuel economy declines as weight increases",
    subtitle = "(1973-74 Motor Trend US)",
    caption  = "Data from the 1974 Motor Trend magazine",
    x        = "Weight (1000 lbs)",
    y        = "Fuel economy (mpg)",
    colour   = "Gear count"
  )

# 默认主题
p1

```

![theme_ggplot2.png](../image/ggthemes-theme_1.png)

---

## 4. 应用多种 ggthemes 主题

下面分别示例几种常用主题，只需在图层末尾加上对应函数：

```r
# 经济学人风格
p1 + theme_economist()

# Wall Street Journal 风格
p1 + theme_wsj()

# Edward Tufte 极简风格
p1 + theme_tufte()

# FiveThirtyEight 报表风格
p1 + theme_fivethirtyeight()

# Solarized（浅色调）
p1 + theme_solarized()

# Solarized（深色调）
p1 + theme_solarized(light = FALSE)

# Excel 风格
p1 + theme_excel()

# Tableau 配色
p1 + scale_color_tableau()

# Colorblind 友好配色
p1 + scale_color_colorblind()

# Calc（LibreOffice Calc 样式）
p1 + theme_calc()

# Gray 系列简约风格
p1 + theme_igray()

```

> 提示：
> 
> - 大多数主题都自带针对字体、背景、网格线与图例的优化；
> - 配色方案（`scale_color_*`）可与主题配合使用；
> - 你也可以在主题后继续叠加自定义 `theme()` 调整。

---

## 5. 常见主题速查

| 主题函数 | 说明 |
| --- | --- |
| `theme_wsj()` | Wall Street Journal 风格 |
| `theme_tufte()` | Edward Tufte 极简风格 |
| `theme_economist()` | The Economist 报表风格 |
| `theme_excel()` | Microsoft Excel 风格 |
| `theme_fivethirtyeight()` | FiveThirtyEight 报表风格 |
| `theme_solarized()` | Solarized 颜色方案（浅/深两种） |
| `theme_igray()` | 简约灰度风格 |
| `theme_calc()` | LibreOffice Calc 风格 |
| `scale_color_tableau()` | Tableau 友好配色方案 |
| `scale_color_colorblind()` | Colorblind 友好配色 |

---

## 6. 小结

- `ggthemes` 提供了覆盖报刊、学术与软件界面风格的丰富主题；
- 只需一行 `+ theme_*()` 或 `+ scale_*()`，即可快速切换；
- 建议根据最终发布媒介（论文、报告、演示）选择匹配的主题。
