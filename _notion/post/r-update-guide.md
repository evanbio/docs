> 记录 R 在 Windows/macOS/Linux 各平台的版本升级方法、升级后如何迁移原有包库，以及包路径和镜像的科学配置建议。适合开发者/生信分析师长期复用查阅。
> 

---

## 🧭 检查当前R版本

```r
R.version.string
# 或
R.Version()$version.string
```

---

## 🖥️ Windows 系统升级R

### 方法一：installr 包一键升级（推荐）

```r
install.packages("installr")
library(installr)
updateR()
```

- 自动检测/下载安装新版R
- 可选保留旧版本，自动迁移CRAN包（仅限CRAN）

### 方法二：手动下载安装

1. 访问 [CRAN 官网](https://cran.r-project.org/)
2. 选择 Download R for Windows → 下载 base 版本
3. 安装时建议自定义路径（如 D:/R/R-4.5.0-win/R-4.5.0）

---

## 🍎 macOS 系统升级R

### 方法一：官网下载.pkg

1. 访问 [CRAN 官网](https://cran.r-project.org/)
2. Download R for macOS → 下载最新版 .pkg 安装包

### 方法二：Homebrew自动升级

```bash
brew update
brew upgrade r

```

---

## 🐧 Linux (Ubuntu) 升级R

以 Ubuntu Jammy 为例：

```bash
sudo add-apt-repository 'deb https://cloud.r-project.org/bin/linux/ubuntu jammy-cran40/'
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 51716619E084DAB9
sudo apt update
sudo apt upgrade r-base
```

---

## 📦 R包迁移与自动安装

**升级R后，强烈建议手动+分类型迁移包，不建议盲目全量自动还原。**

### 🚫 传统方法（仅适用CRAN包）

```r
old_packages <- installed.packages()[, "Package"]
save(old_packages, file = "old_packages.RData")
load("old_packages.RData")
install.packages(old_packages)

```

⚠️ 无法还原 GitHub/Bioconductor/本地包。

---

### ✅ 推荐方法：pak 包自动识别来源

```r
install.packages("pak")
library(pak)
old_packages <- installed.packages()[, "Package"]
pak::pak(old_packages)

```

- 自动识别包来源（CRAN/Bioc/GitHub），优先选最快/最兼容源，安装体验好
- 适合新版R首次迁移大量包

### ⚠️ 国内用户注意

- pak 及其依赖（如 curl、jsonlite）编译和下载常遇网络问题
- 需用代理或先手动镜像安装依赖，建议在代理环境或服务器下执行

---

## 📁 R包库路径管理与推荐设置

- **不推荐把自装包全部放在R_HOME/library目录下**，建议按版本独立目录管理。
- 推荐用 `.libPaths("D:/R/library/4.5")` 按R主版本独立管理包路径。

**在Rprofile.site全局配置示例：**

```r
.libPaths("D:/R/library/4.5")
options(repos = c(CRAN = "https://mirrors.tuna.tsinghua.edu.cn/CRAN/"))
options(BioC_mirror = "https://mirrors.westlake.edu.cn/bioconductor")
options(encoding = "UTF-8")
cat("✨ 当前包路径：", .libPaths()[1], "\n")

```

---

## 📚 延伸阅读

- [CRAN R下载页面](https://cran.r-project.org/)
- [installr GitHub仓库](https://github.com/talgalili/installr)
- [pak官方文档](https://pak.r-lib.org/)
