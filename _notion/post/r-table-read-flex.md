生信和数据分析中，经常需要高效读取各种格式（csv/tsv/txt/gz等）的超大表格。这里总结两种方法：主流的data.table::fread，以及自定义的read_table_flex()，后者兼容更多场景、自动分隔符、友好CLI反馈。

---

## 1. 用data.table::fread高效读取大文件

```r
library(data.table)
ExposureGwas <- fread(
  file = "path/to/your/file.txt",
  sep = "\\t",
  data.table = FALSE
)

```

- 支持csv/tsv/txt/gz等常见表格
- 手动设定sep适应不同分隔符
- 适合大文件/批量读取/高并发分析

---

## 2. 自定义evanverse::read_table_flex自动适配

### 安装与载入

```r
# 建议提前安装/载入evanverse包
devtools::install_github("evanbio/evanverse")
library(evanverse)

```

### 函数介绍

`read_table_flex()` 是我自己封装的高适配度表格读取函数，**支持自动识别分隔符**，可直接读.csv/.tsv/.txt/.gz等压缩或普通文件，并集成CLI友好提示。

### 主要参数

- `file_path`: 文件路径，支持压缩格式
- `sep`: 可手动指定分隔符，否则自动根据扩展名判断
- `encoding`: 文件编码，默认为"UTF-8"
- `header`: 是否有表头
- `verbose`: 是否显示详细CLI提示

### 典型用法

```r
# 自动识别分隔符，自动处理.csv/.tsv/.gz
dt <- read_table_flex("data/demo_data.csv.gz", verbose = TRUE)

```

- **优势**：无需手动指定分隔符，文件名一改直接兼容。压缩/多格式支持更好，CLI提示友好，批量分析和脚本流程都很稳健。

---

## 3. 典型应用场景

- 生信/转录组/GWAS等大文件批量读取
- 多格式/多来源表格（csv/tsv/txt/gz）自动导入分析
- 自动化数据管道/流程/定制化脚本

---

## 4. 易错与补充

- fread默认data.table对象，如需和dplyr/传统代码兼容可设`data.table=FALSE`
- read_table_flex适配常见扩展名（.csv/.tsv/.txt/.gz），其它新格式可扩展自定义
- 批量导入建议搭配list.files等批处理函数

---

本页长期补充fread与自定义批量读取脚本的经验和踩坑点。
