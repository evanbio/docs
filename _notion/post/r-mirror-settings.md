## 1. 查看当前镜像

```r
options()$repos              # 当前CRAN镜像
options()$BioC_mirror        # 当前Bioconductor镜像
BiocManager::repositories()  # 所有相关源
```

---

## 2. 手动选择镜像（互动回复）

```r
chooseCRANmirror()    # 选择CRAN镜像
chooseBioCmirror()    # 选择Bioconductor镜像
```

- 对话框选择，回复序号即可

---

## 3. 直接设定镜像（推荐写入Rprofile）

```r
# CRAN设置为清华镜像
options(repos = c(CRAN = "https://mirrors.tuna.tsinghua.edu.cn/CRAN/"))

# Bioconductor设置为西湖大学镜像
options(BioC_mirror = "https://mirrors.westlake.edu.cn/bioconductor")

```

- 推荐在 `~/.Rprofile` 或 `Rprofile.site` 全局写入，避免每次手动输入

---

## 4. 国内常用镜像列表

- **CRAN清华镜像**
    
    `https://mirrors.tuna.tsinghua.edu.cn/CRAN/`
    
- **CRAN阿里云镜像**
    
    `https://mirrors.aliyun.com/CRAN/`
    
- **Bioconductor西湖镜像**
    
    `https://mirrors.westlake.edu.cn/bioconductor`
    

---

## 5. 高阶场景tips

- BiocManager自动安装包时会用BioC_mirror和repos共同决定源，强烈建议两个都设定
- RStudio/服务器建议优先配好镜像，避免国外源卡顿、失败
- 如遇到包下载慢/失败，优先考虑是否是镜像问题

---

如遇镜像失效、需要切换新镜像或特殊环境配置，直接补充到本页。
