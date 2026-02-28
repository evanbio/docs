> 一文讲清：系统装字体 → R 导入 → 设备加载 → 图中调用 → PDF 嵌入。重点用 extrafont，兼顾 ggplot2、base 图形与 grid 系统。
> 

---

## 快速上手

```r
# 一次性准备（首次或新增字体后执行）
install.packages(c("extrafont", "extrafontdb"))
library(extrafont)
font_import(prompt = FALSE)        # 可能较慢，可用 pattern= 精准筛选
loadfonts(device = "win")          # 让 Windows 屏幕设备识别

# 本次会话使用
library(ggplot2)
ggplot(mtcars, aes(mpg, wt)) +
  geom_point() +
  theme(text = element_text(family = "MV Boli"))

# 导出 PDF 并嵌入字体（需要安装 Ghostscript）
loadfonts(device = "pdf")          # 让 pdf() 设备识别
ggsave("plot.pdf", width = 6, height = 4)
embed_fonts("plot.pdf")            # 字体打包进 PDF

```

---

## 1. `extrafont` 是做什么的？

- **目的**：让 R 能识别并使用你电脑里的 **TrueType/OpenType** 字体（如 *Cambria Math*、*Noto Sans Math*、中文字体等）。
- **流程**：
    1. **font_import**：扫描并登记系统字体信息到 `extrafontdb`。
    2. **loadfonts**：把已登记字体注册到具体**绘图设备**（Windows 屏幕、pdf、postscript）。
    3. **使用**：在绘图主题/参数里指定 `family = "字体名"`。
    4. **嵌入**：将字体真正打包进 PDF，解决跨机查阅缺字/替换问题。

---

## 2. 在 Windows 安装字体（系统层面）

- 双击 `.ttf`/`.otf` → **安装**（建议“为所有用户安装”）。
- 常见数学/符号字体：**Cambria Math**（Office 自带）、**Noto Sans Math**、**STIX Two Math**。
- 安装后 **重启 R/RStudio**，再做 `font_import`。

---

## 3. 用 `extrafont` 导入与加载

### 3.1 导入字体（首次或新增字体后）

```r
install.packages(c("extrafont", "extrafontdb"))
library(extrafont)

# 导入全部字体（可能较慢）
# font_import(prompt = FALSE)

# 建议：用 pattern 精准筛选，极大提速
font_import(pattern = "Cambria|Noto|STIX", prompt = FALSE)

```

> 小贴士
> 
> - `fonttable()` 查看已登记字体表；`fonts()` 查看当前可用字体名。
> - 新装字体后需 **重新 font_import** 才会出现在 `extrafont` 数据库。

### 3.2 加载到绘图设备

```r
# 让 Windows 屏幕设备识别（RStudio/plot 窗格）
loadfonts(device = "win")

# 若要导出 PDF
loadfonts(device = "pdf")

# 若要导出 PS/EPS
loadfonts(device = "postscript")

```

---

## 4. 在图里使用字体

### 4.1 ggplot2

```r
library(ggplot2)
ggplot(mtcars, aes(mpg, wt)) +
  geom_point() +
  labs(title = "带自定义字体的示例") +
  theme(text = element_text(family = "Cambria Math"))

```

### 4.2 base R

```r
# 建议先定义一个别名，避免空格/大小写问题
windowsFonts(CambriaMath = windowsFont("Cambria Math"))

par(family = "CambriaMath")
plot(1:10, main = "Base 图形使用 Cambria Math")

```

### 4.3 grid / forestploter

```r
library(grid)
g <- textGrob("𝑃 value / 𝜌 (95% CI)", gp = gpar(fontfamily = "Cambria Math"))
grid.newpage(); grid.draw(g)

# forestploter 里：在主题中指定
library(forestploter)
tm <- forest_theme(
  base_family = "Cambria Math",
  xaxis_gp    = gpar(fontfamily = "Cambria Math")
)

```

---

## 5. 导出 PDF 并“嵌入字体”

`extrafont` 能让 pdf() 使用到系统字体，但很多 PDF 阅读器仍会**替换**字体。解决方案：**嵌入**字体到 PDF 文件。

### 5.1 安装 Ghostscript

- Windows 下安装后记住路径，例如：
    
    `C:/Program Files/gs/gs10.04.0/bin/gswin64c.exe`
    
- R 里告诉 `extrafont`：

```r
Sys.setenv(R_GSCMD = "C:/Program Files/gs/gs10.04.0/bin/gswin64c.exe")

```

### 5.2 导出与嵌入

```r
library(ggplot2)
loadfonts(device = "pdf")             # 让 pdf 设备认识字体
ggsave("plot.pdf", width = 6, height = 4)  # 先正常导出
embed_fonts("plot.pdf")               # 然后嵌入字体

```

---

## 6. 常见问题与排查

### Q1. `font_import()` 很慢？

- 用 `pattern=` 精准筛选，如 `pattern = "Noto|Cambria"`;
- 或指定路径：`font_import(paths = "C:/Windows/Fonts", prompt = FALSE)`。

### Q2. 绘图时报 `unknown family`？

- 字体名不匹配。用 `fonts()`/`fonttable()` 查实际名称；
- Windows 建议用 `windowsFonts(别名 = windowsFont("实际名"))`，再用 `par(family="别名")`；
- 重启 R 后，记得 `loadfonts(device="win")/("pdf")`。

### Q3. PDF 里字体被替换？

- 需要 `loadfonts(device="pdf")` + `embed_fonts()`；
- 确保 `R_GSCMD` 指向 **Ghostscript** 的可执行文件。

### Q4. 中文或 CJK 字体乱码？

- 优先选带完整 CJK 字形的字体（如 *SimSun* 宋体、*Microsoft YaHei* 微软雅黑等），同样走 `font_import` → `loadfonts`；
- 若仍不稳，**备选方案**：`showtext`（兼容性强，跨平台省心）。

---

## 7. 进阶：和 R Markdown / Quarto 配合

- **HTML 输出**：浏览器自身渲染，若使用 web 字体（Google Fonts）更稳定；
- **PDF 输出**：沿用本文流程（`loadfonts("pdf")` + `embed_fonts()`），或用 `showtext`；
- 在 YAML 里指定 `mainfont: "Cambria Math"`（需 Pandoc/LaTeX 能识别该字体）。

---

## 8. 最小可复现脚本（Windows）

```r
# 一次性准备
install.packages(c("extrafont", "extrafontdb", "ggplot2"))
library(extrafont)
font_import(pattern = "Cambria|Noto", prompt = FALSE)
loadfonts(device = "win")

# 屏幕上测试
library(ggplot2)
p <- ggplot(mtcars, aes(mpg, wt)) +
  geom_point() +
  labs(title = "使用 Cambria Math") +
  theme(text = element_text(family = "Cambria Math"))
print(p)

# 导出 PDF + 嵌入
loadfonts(device = "pdf")
ggsave("font_demo.pdf", p, width = 6, height = 4)

# 指向 Ghostscript（路径按你的安装版本修改）
Sys.setenv(R_GSCMD = "C:/Program Files/gs/gs10.04.0/bin/gswin64c.exe")
embed_fonts("font_demo.pdf")

```

---

**总结**：在 Windows 上，`extrafont` 的标准操作是

**安装系统字体 → `font_import()` → `loadfonts("win"/"pdf")` → 在图里 `family="字体名"` → `embed_fonts()`**。

配合 `pattern` 精准导入和 `Ghostscript` 嵌入 PDF，就能做出跨设备也稳定一致的出版级图表。
