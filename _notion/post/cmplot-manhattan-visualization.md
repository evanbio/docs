> 简介
> 
> 
> `CMplot` 是一款专为基因组关联研究（GWAS）设计的可视化工具包，支持圆形（circular）和矩形（Manhattan）两种风格的高效绘图，且参数灵活、易于定制。本篇将从示例数据出发，逐项讲解关键参数，帮你快速上手。
> 

---

## 1. 准备数据

```r
# 内置示例：猪 60K 和 牛 50K 数据
data(pig60K)      # 由 MLM 分析得到的 p-value 数据
data(cattle50K)   # 由 rrBLUP 分析得到的效应量数据

# 查看前几行
head(pig60K)
head(cattle50K)
```

---

## 2. 圆形曼哈顿图（Circular Manhattan）

```r
CMplot(
  pig60K,                         # 输入数据框
  type        = "p",              # “p”: 点图；"l": 线图；"h": 柱状图
  plot.type   = "c",              # "c" 表示 circular（圆形）
  chr.labels  = paste0("Chr", c(1:18, "X", "Y")),  # 染色体标签
  col         = c("grey30","grey60"),             # 染色体交替颜色

  r           = 0.4,             # 内圈半径（相对于外圈半径 1）
  cir.band    = 1,               # 圆环厚度比例

  threshold   = c(1e-6,1e-4),    # 两级阈值
  amplify     = TRUE,            # 是否放大显著 SNP
  threshold.lty = c(1,2),        # 阈值线样式：实线/虚线
  threshold.col = c("red","blue"),# 阈值线颜色

  signal.line = 1,               # 连线厚度，用于显著 SNP
  signal.col  = c("red","green"),# 显著 SNP 的连线颜色

  cir.axis      = TRUE,          # 绘制圆环坐标轴
  cir.axis.col  = "blue",        # 坐标轴颜色
  cir.chr.h     = 1.3,           # 染色体标签离心距离
  cir.axis.grid = TRUE,          # 圆环网格线

  outward       = FALSE,         # 柱子向内(false)或向外(true)
  chr.den.col   = c("darkgreen","yellow","red"), # SNP 密度配色

  axis.cex   = 1,                # 坐标轴标签字体放缩
  file       = "jpg",            # 输出格式
  file.output= FALSE,            # 是否写出文件
  verbose    = TRUE,             # 打印详细日志
  width      = 10, height = 10,  # 图形尺寸 (inch)
  dpi        = 300               # 分辨率
)

```

> 提示：
> 
> - `r` 与 `cir.band` 控制不同圈层半径和宽度；
> - `amplify=TRUE` 会放大最显著那一层的点。

---

## 3. 矩形曼哈顿图（Classic Manhattan）

```r
# 准备要高亮的 SNP 列表和注释文本
SNPs  <- pig60K$SNP[pig60K$trait2 < 1e-4]  
genes <- paste0("GENE_", seq_along(SNPs))  # 对应注释文本

CMplot(
  pig60K,                         # 输入数据框
  type        = "p",              # 点图
  plot.type   = "m",              # "m" 表示 Manhattan

  col         = c("grey30","grey60"),         # 交替背景色
  cex         = 0.8,                          # 点大小
  LOG10       = TRUE,                         # -log10(p)

  band        = 0.5,                          # 染色体之间间距
  pch         = 1,                            # 点形状

  threshold      = c(1e-8,1e-6),              # 双阈值
  threshold.lty  = c(1,2),                    # 阈值线样式
  threshold.lwd  = c(1,1),                    # 阈值线粗细
  threshold.col  = c("#4197d8","#f8c120"),    # 阈值线颜色

  amplify        = TRUE,                      # 放大显著点
  signal.col     = c("red","green"),          # 显著点颜色
  signal.cex     = c(1.5,1.5),                # 显著点大小
  signal.pch     = c(19,19),                  # 显著点形状

  highlight      = SNPs,                      # 要高亮的 SNP
  highlight.col  = "green",                   # 高亮点颜色
  highlight.cex  = 1,                         # 高亮点大小
  highlight.pch  = 19,                        # 高亮点形状

  highlight.text      = genes,                # SNP 注释文本
  highlight.text.cex  = 1,                    # 注释字体大小
  highlight.text.col  = rep("red", length(SNPs)), # 注释字体颜色

  legend.ncol   = 1,                          # 图例列数
  legend.pos    = "left",                     # 图例位置

  main          = "Pig 60K GWAS",             # 主标题
  ylim          = c(2,12),                    # y 轴范围

  chr.border    = TRUE,                       # 染色体间隔线
  chr.den.col   = c("darkgreen","yellow","red"), # SNP 密度配色
  chr.labels.angle = 45,                      # X 轴标签旋转角度

  file          = "tiff",                     # 输出格式
  file.output   = FALSE,                      # 是否写文件
  verbose       = TRUE,
  width         = 14, height = 6,
  dpi           = 300
)

```

> 说明：
> 
> - `plot.type="m"` 生成经典 Manhattan；
> - `highlight`、`highlight.text` 系列用于标记并注释感兴趣 SNP；
> - `LOG10=TRUE` 自动对 p 值取 -log10。

---

## 4. 常见参数速查

| 参数 | 作用 |
| --- | --- |
| `type` | 点/线/柱（"p"/"l"/"h"） |
| `plot.type` | 圆形(c)/矩形(m)/密度(d)/四象限(q) |
| `threshold` | 阈值线位置，接受向量或列表 |
| `amplify` | 放大显著点 |
| `highlight` | 高亮 SNP 列表 |
| `cir.axis` | 是否绘制圆环坐标轴（仅圆形） |
| `chr.den.col` | 染色体上 SNP 密度配色 |
| `file.output` | 是否将图写入文件 |

---

## 5. 学习资源

Learning Resources

1. CMplot 官方文档：https://github.com/YinLiLin/CMplot
