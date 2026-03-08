## 1. 基本语法

```r
apply(X, MARGIN, FUN, ...)
```

- `X`：矩阵或数据框
- `MARGIN`：1表示按行，2表示按列
- `FUN`：应用的函数（如min、max、mean等）

---

## 2. 典型应用场景

- **每行最小值**
    
    ```r
    apply(df, 1, min)
    ```
    
- **每列最大值**
    
    ```r
    apply(df, 2, max)
    ```
    
- **每列平均值**
    
    ```r
    apply(df, 2, mean)
    ```
    

---

## 3. 常用tips

- `apply`返回值为向量或列表（取决于FUN）
- 数据框有字符/因子时会自动转为矩阵（可能造成强制类型转换，注意数据类型）
- 对纯数值数据最安全，复杂/混合型建议用`purrr::map`等tidyverse方案

---

## 4. 常见变体

- `lapply`：对列表/数据框每一列应用函数，返回列表
- `sapply`：简化列表为向量/矩阵
- `purrr::map`家族：更灵活的批量操作

---

## 5. 进阶应用

- **批量自定义函数处理**
    
    ```r
    apply(df, 1, function(x) sum(x > 0))
    # 每行统计正数的个数
    ```
    

---

## **6. 具体示例**

```r
# 加载内置数据集
df <- mtcars

# 每行（每辆车）最大值
row_max <- apply(df, 1, max)
head(row_max)
#         Mazda RX4     Mazda RX4 Wag 
#               160               160 
#        Datsun 710    Hornet 4 Drive 
#               108               258 
# Hornet Sportabout           Valiant 
#               360               225 

# 每列（每个变量）最小值
col_min <- apply(df, 2, min)
col_min
#   mpg    cyl   disp     hp   drat     wt   qsec     vs     am   gear   carb 
# 10.40  4.00  71.10  52.00 2.760 1.513 14.50  0.00  0.00  3.00  1.00 

```
