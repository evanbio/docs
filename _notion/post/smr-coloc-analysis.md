## 1. 包安装与加载

```r
# ----install package----
# （以下语句仅首次运行时执行）
# install.packages("remotes")
# remotes::install_github("MRCIEU/TwoSampleMR")
# install.packages("data.table")
# install.packages("tidyverse")
# install.packages("devtools")
# devtools::install_github("mrcieu/ieugwasr", force = TRUE)
# if (!require("BiocManager")) install.packages("BiocManager")
# BiocManager::install("VariantAnnotation")
# devtools::install_github("mrcieu/gwasglue",force = TRUE)

# ----library package----
library(TwoSampleMR)
library(data.table)
library(tidyverse)
library(ieugwasr)
library(VariantAnnotation)
library(gwasglue)
library(MRPRESSO)
library(rtracklayer)

```

---

## 2. 读取与标准化 Outcome GWAS

```r
# ----input outcome GWAS----
OutcomeGwas <- fread(
  "Outcome_Gwas/finngen_R10_C3_SQUOMOUS_CELL_CARCINOMA_SKIN_EXALLC.gz",
  data.table = FALSE
)
head(OutcomeGwas)

# 转换列名为标准列名
OutcomeGwas <- OutcomeGwas %>%
  dplyr::rename(
    effect_allele.outcome = 'alt',
    other_allele.outcome  = 'ref',
    SNP                   = 'rsids',
    pval.outcome          = 'pval',
    beta.outcome          = 'beta',
    se.outcome            = 'sebeta',
    eaf.outcome           = 'af_alt'
  ) %>%
  mutate(
    id.outcome         = 'SCC',
    outcome            = "SCC",
    samplesize.outcome = 317724
  )

# 保留必要的列名和剔除不合格的SNP
mygwas <- OutcomeGwas %>%
  dplyr::select(
    SNP,
    effect_allele.outcome,
    other_allele.outcome,
    eaf.outcome,
    beta.outcome,
    se.outcome,
    pval.outcome,
    samplesize.outcome
  ) %>%
  dplyr::filter(
    SNP != '',
    !grepl(',', SNP)
  )

# 写出为本地文件，ma格式
fwrite(
  mygwas,
  paste0('Outcome_ma/', paste0(unique(OutcomeGwas$outcome), '.ma')),
  sep = "\t", quote = FALSE, row.names = FALSE
)

```

---

## 3. SMR 命令行示例

```
# 全区间 GWAS × eQTL
smr-1.3.1-win.exe \
  --bfile EUR \
  --gwas-summary mygwas.ma \
  --beqtl-summary Whole_Blood.lite \
  --out mysmr

# 仅分析指定基因（.list 中列 ENSG_ID）

# ENSG00000228794
# ENSG00000188976
# ENSG00000187961
# ENSG00000187583
# ENSG00000187642
# ENSG00000272512

# open a new txt file 
# input select target gene
# save txt
# change extension into .list
# extract targeet gene from all eqtl, and make a new besd 
# smr-1.3.1-win.exe --beqtl-summary Whole_Blood.lite --extract-probe myprobe.list --make-besd --out mybesd

smr-1.3.1-win.exe \
  --beqtl-summary Whole_Blood.lite \
  --extract-probe myprobe.list \
  --make-besd \
  --out mybesd

smr-1.3.1-win.exe \
  --bfile EUR \
  --gwas-summary mygwas.ma \
  --beqtl-summary mybesd \
  --out mysmr

# 仅分析指定 SNP（.list 中列 rsID）

# rs559807721
# rs761651383
# rs9726668
# rs62642117

# open a new txt file 
# input select SNP
# save txt
# change extension into .list
# extract targeet gene from all eqtl, and make a new besd 
# smr-1.3.1-win.exe --beqtl-summary Whole_Blood.lite --extract-snp mysnp.list --make-besd --out mybesd

smr-1.3.1-win.exe \
  --beqtl-summary Whole_Blood.lite \
  --extract-snp mysnp.list \
  --make-besd \
  --out mybesd

smr-1.3.1-win.exe \
  --bfile EUR \
  --gwas-summary mygwas.ma \
  --beqtl-summary mybesd \
  --out mysmr
```

> 参考
> 
> - 1KG 参考面板: http://fileserve.mrcieu.ac.uk/ld/1kg.v3.tgz
> - GTEx v8 eQTL: https://yanglab.westlake.edu.cn/data/SMR/GTEx_V8_cis_eqtl_summary_lite.tar

---

## 4. R 脚本：批量构建 ESD & 提取 cis 区间

```r
filename_SMR <- list.files(
  path = 'SMR/', pattern = '.txt.gz$', full.names = TRUE
)
all_flist <- data.frame()  # 提前定义，避免循环覆盖

foreach(i = filename_SMR, .errorhandling = "pass") %do% {
  ExposureGwas <- fread(file = i, data.table = FALSE)
  head(ExposureGwas)

  # 解析 GeneName 与 id.exposure
  temp1 <- strsplit(i, "_", fixed = TRUE)
  GeneName <- temp1[[1]][3]
  ExposureGwas$exposure <- GeneName

  temp2 <- strsplit(i, "/", fixed = TRUE)
  temp3 <- strsplit(temp2[[1]][2], ".", fixed = TRUE)
  ExposureGwas$id.exposure <- temp3[[1]][1]

  ExposureGwas <- ExposureGwas %>%
    dplyr::rename(
      chr.exposure           = "Chrom",
      pos.exposure           = "Pos",
      effect_allele.exposure = 'effectAllele',
      other_allele.exposure  = 'otherAllele',
      SNP                    = 'rsids',
      pval.exposure          = "Pval",
      beta.exposure          = "Beta",
      se.exposure            = "SE",
      eaf.exposure           = "ImpMAF",
      samplesize.exposure    = 'N'
    )

  # 全区间 .esd
  esd <- ExposureGwas %>%
    dplyr::select(
      chr.exposure, SNP, pos.exposure,
      effect_allele.exposure, other_allele.exposure,
      eaf.exposure, beta.exposure, se.exposure, pval.exposure
    ) %>%
    filter(SNP != '', !grepl(',', SNP))
  colnames(esd) <- c('Chr','SNP','Bp','A1','A2','Freq','Beta','se','p')
  head(esd)
  
  esd$Chr <- substring(esd$Chr, 4)
  fwrite(
    esd,
    file = paste0("esd/", unique(ExposureGwas$id.exposure), '.esd'),
    sep = "\t", quote = FALSE, row.names = FALSE
  )

  # 提取 cis 区间
  GeneInformation <- fread('GeneInformation.csv', data.table = FALSE)
  Gene <- GeneInformation %>% filter(hgnc_symbol == GeneName)
  Gene$chromosome_name <- as.integer(Gene$chromosome_name)

  cis_region <- ExposureGwas %>%
    dplyr::filter(
      chr.exposure == Gene$chromosome &
      pos.exposure > Gene$cis_start &
      pos.exposure < Gene$cis_end
    ) %>%
    dplyr::filter(chr.exposure != 'chr6' |
           pos.exposure < 25500000 |
           pos.exposure > 34000000) %>%
    na.omit()

  esd_cis <- cis_region %>%
    dplyr::select(
      chr.exposure, SNP, pos.exposure,
      effect_allele.exposure, other_allele.exposure,
      eaf.exposure, beta.exposure, se.exposure, pval.exposure
    ) %>%
    dplyr::filter(SNP != '', !grepl(',', SNP))
    
  colnames(esd_cis) <- c('Chr','SNP','Bp','A1','A2','Freq','Beta','se','p')
  esd_cis$Chr <- substring(esd_cis$Chr, 4)
  
  fwrite(
    esd_cis,
    file = paste0("esd_cis/", unique(ExposureGwas$id.exposure), '.esd'),
    sep = "\t", quote = FALSE, row.names = FALSE
  )

  # 构建 flist
  my.flist <- Gene %>%
    dplyr::mutate(
      GeneticDistance = end_position - start_position,
      ProbeID         = unique(ExposureGwas$id.exposure),
      Orientation     = ifelse(strand > 0, '+', '-'),
      PathOfEsd       = paste0("esd_cis/", unique(ExposureGwas$id.exposure), '.esd')
    ) %>%
    dplyr::select(chromosome_name, ProbeID, GeneticDistance,
           start_position, hgnc_symbol, Orientation, PathOfEsd)
  colnames(my.flist) <- c(
    'Chr','ProbeID','GeneticDistance','ProbeBp',
    'Gene','Orientation','PathOfEsd'
  )

  all_flist <- rbind(all_flist, my.flist)
  fwrite(
    all_flist,
    file = 'all_flist.flist',
    sep = "\t", quote = FALSE, row.names = FALSE
  )
}

```

---

## 5. 批量 SMR 分析

```
# 批量构建 BESD
smr-1.3.1-win.exe \
  --eqtl-flist all_flist.flist \
  --make-besd \
  --out mybesd2

# 批量执行共定位
smr-1.3.1-win.exe \
  --bfile EUR/EUR \
  --gwas-summary Outcome_ma/SCC.ma \
  --beqtl-summary mybesd2 \
  --diff-freq-prop 0.2 \
  --out mysmr_all

```

---

## 6. 注意事项 & 补充

- **字段顺序与名称务必一致**，任何微小差异都会报错或无效结果。
- 建议在每步之后对输出的 `.esd`、`.flist` 及中间文件进行 spot-check。
- `.list` 文件请用 UTF-8 无 BOM 文本，每行一 ID，无额外空格。
- 可将此脚本封装为 shell 或 makefile，适配大型批量分析。

---

## 7. 参考资料

- [SMR 官方手册](http://cnsgenomics.com/software/smr/)
- [GTEx v8 eQTL 数据](https://yanglab.westlake.edu.cn/data/SMR/)
- [TwoSampleMR 文档](https://mrcieu.github.io/TwoSampleMR/)
