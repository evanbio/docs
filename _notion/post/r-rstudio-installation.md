## Introduction

在数据分析和统计学习的世界里，**R** 是一门非常核心的语言。它从一开始就是为统计学而生的：自带 `lm()` 做回归、`t.test()` 做假设检验，写几行代码就能跑出结果。更重要的是，它是开源的，全球社区在不断贡献各种扩展包，从绘制高质量图表到跑机器学习模型，几乎都能找到现成方案。

![r-rstudio-installation_1](../image/r-rstudio-installation_1.png)

不过，直接在命令行里用 R 并不友好——界面简陋，脚本管理和可视化输出都不方便。于是就有了 **RStudio**，一个专门为 R 打造的集成开发环境（IDE）。它把常用功能都集成在一个窗口里：

- 左上：脚本编辑器（写代码的地方）
- 左下：Console（即时运行代码）
- 右上：环境、历史记录
- 右下：图形、文件、帮助文档

![r-rstudio-installation_2](../image/r-rstudio-installation_2.png)

R 是发动机，RStudio 就像驾驶舱。很多人第一次学 R，就是从安装 RStudio 开始的。

---

## Installation: R

1. 打开 CRAN 官网：https://cran.r-project.org/
2. 根据系统选择下载（Windows / macOS / Linux）。这里以 Windows 为例：
    - 点击 **base** → 打开链接
    - 点击 **Download**（当前最新版本 R 4.5.1）
    - 浏览器会下载 `R-4.5.1-win.exe`
        
        ![r-rstudio-installation_3](../image/r-rstudio-installation_3.gif)
        
    - 双击打开，按照提示依次进行即可
        
        ![r-rstudio-installation_4](../image/r-rstudio-installation_4.png)
        
        ![r-rstudio-installation_5](../image/r-rstudio-installation_5.png)
        
    - 建议安装到 D 盘（例如 `D:/R/R-4.5.1`）
        
        ![r-rstudio-installation_6](../image/r-rstudio-installation_6.png)
        
        ![r-rstudio-installation_7](../image/r-rstudio-installation_7.png)
        
        ![r-rstudio-installation_8](../image/r-rstudio-installation_8.png)
        
        ![r-rstudio-installation_9](../image/r-rstudio-installation_9.png)
        
        ![r-rstudio-installation_10](../image/r-rstudio-installation_10.png)
        
    - 完成后，在开始菜单即可找到 R
        
        ![r-rstudio-installation_11](../image/r-rstudio-installation_11.png)
        

---

## Installation: RTools（Windows 必须）

安装完 R 后，Windows 用户要**立刻安装 RTools**。很多扩展包需要它来编译。

1. 回到 CRAN，找到对应版本的 RTools（这里是 RTools 4.5）：
    
    ![r-rstudio-installation_12](../image/r-rstudio-installation_12.png)
    
    ![r-rstudio-installation_13](../image/r-rstudio-installation_13.png)
    
2. 选择 **Rtools45 installer**（不要选 ARM 版本，除非你用 ARM Windows 设备）:
    
    ![r-rstudio-installation_14](../image/r-rstudio-installation_14.png)
    
3. 下载后双击 `rtools45-xxx.exe`，一路默认安装即可（路径一般是 `C:/rtools45`）
4. 后面安装好RStudio或者也可以直接在R Console中运行 pkgbuild::find_rtools() 检测是否安装成功
    
    ![r-rstudio-installation_15](../image/r-rstudio-installation_15.png)
    

---

## Installation: RStudio

1. 前往 RStudio（Posit）下载页：https://posit.co/download/rstudio-desktop/
2. 点击 **Download RStudio**，浏览器会自动下载
    
    ![r-rstudio-installation_16](../image/r-rstudio-installation_16.png)
    
3. 双击 `RStudio-2025.05.1-513.exe` 运行安装向导
    
    ![r-rstudio-installation_17](../image/r-rstudio-installation_17.png)
    
4. 建议安装到 D 盘（如 `D:/RStudio/RStudio-2025.05.1-513`）
    
    ![r-rstudio-installation_18](../image/r-rstudio-installation_18.png)
    
5. 安装完成后，在开始菜单找到 RStudio，第一次启动会要求选择 R 版本 → 选刚才安装的 R。
    
    ![r-rstudio-installation_19](../image/r-rstudio-installation_19.png)
    
    后续也可以通过一下方式切换不同版本：**Tools - Global Options** 
    
    ![r-rstudio-installation_20](../image/r-rstudio-installation_20.png)
    
    ![r-rstudio-installation_21](../image/r-rstudio-installation_21.png)
    
    ![r-rstudio-installation_22](../image/r-rstudio-installation_22.png)
    

## Version Notes

R 的版本号通常采用 **X.Y.Z** 的格式，比如 **R 4.5.0**：

- **4** → **Major version（主版本）**
    - 主版本变化较少，通常代表语言或底层结构的大调整。
    - R 从 1997 年至今，只经历过 **R 1.x → 2.x → 3.x → 4.x** 四个大版本。
    - 一般一个 major 版本会稳定多年，向后兼容。
- **5** → **Minor version（次版本）**
    - 更新频率较高，大约每年会有 2–3 次。
    - 通常是功能增强、性能优化，以及部分新特性引入。
    - 当前最新是 **R 4.5.x** 系列。
- **0** → **Patch version（修订版本）**
    - 主要是 bug 修复和小范围调整。
    - 比如从 4.5.0 → 4.5.1，就属于小修订更新。
- 一般不要落后最新版本 **超过两个 minor**（比如当前是 4.5.x，你最好不要还停在 4.2.x

## Packages

在 R 里，**Packages（扩展包）** 就是功能模块的集合。

- R 自带一些基础函数，但真正的强大来自社区扩展包。
- 包里面包含：R 代码、帮助文档、数据集，甚至有时会包含 C/C++/Fortran 编译代码。
- 通过 `install.packages("包名")` 就能安装，再用 `library(包名)` 调用。

常见类别：

- **数据处理**：`dplyr`、`data.table`
- **可视化**：`ggplot2`、`ComplexHeatmap`
- **统计建模**：`survival`、`lme4`
- **科研专用**：`Seurat`、`DESeq2`

## Where Packages Come From

R 的包并不是都放在一个地方，而是有几个主要“仓库”来源：

### 1. CRAN

- **Comprehensive R Archive Network**，R 的官方仓库。
- 安装包时默认就是从 CRAN 下载。
- 包含大多数通用包（数据处理、绘图、建模等）。
- 每个包都会经过 CRAN 审核，保证能在主流系统（Windows/macOS/Linux）上编译。

### 2. Bioconductor

- 专门面向 **生物信息学** 和 **高通量数据分析**。
- 包含很多 RNA-seq、基因组学、单细胞测序工具。
- 安装方式不同：
    
    ```r
    if (!requireNamespace("BiocManager", quietly = TRUE))
        install.packages("BiocManager")
    BiocManager::install("DESeq2")
    
    ```
    

### 3. GitHub

- 很多开发者会先把包放在 GitHub，而不是等到提交 CRAN。
- 这里经常能拿到最新版本，甚至是实验性功能。
- 安装方式需要 `devtools` 或 `remotes`：
    
    ```r
    # 用 devtools
    install.packages("devtools")
    devtools::install_github("hadley/ggplot2")
    
    # 或者用 remotes
    install.packages("remotes")
    remotes::install_github("rstudio/shiny")
    
    ```
    

## References & Resources

### 官方资源

- **R 官网**：https://www.r-project.org/
- **CRAN（R 包主仓库）**：https://cran.r-project.org/
- **RTools（Windows 工具链）**：https://cran.r-project.org/bin/windows/Rtools/
- **Bioconductor（生物信息学仓库）**：https://www.bioconductor.org/
- **RStudio / Posit 下载**：https://posit.co/download/rstudio-desktop/

### 书籍推荐

- [*R for Data Science*](https://r4ds.hadley.nz/)（**Hadley Wickham** & Garrett Grolemund, O’Reilly）
    - 入门必读，覆盖 tidyverse 工作流，电子版免费
- [R in Action](https://drive.google.com/drive/folders/1ExvS9TTI6JHjP2cEmDgQecSnk7k4HErN?usp=sharing)（Robert I. Kabacoff）
    - 系统性很强的一本书，既适合入门，也能当参考手册
