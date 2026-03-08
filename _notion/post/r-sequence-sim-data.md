日常R分析中，经常需要批量生成编号、分组、标签、数值序列、模拟样本等。这里总结一些高频用法和典型场景。

---

## 1. 基础数值序列生成（seq/seq_len/seq_along）

```r
# 1到10，每步+2
seq(from = 1, to = 10, by = 2)
# 结果：1 3 5 7 9

# 1到10，分成3个点
seq(from = 1, to = 10, length.out = 3)
# 结果：1 5.5 10

# 快速生成从1到N的向量
seq_len(5)        # 1 2 3 4 5
seq_along(letters) # 1 2 3 ... n
```

## 2. 重复序列（rep）

```r
# 重复1到3各两次
rep(1:3, times = 2) # 1 2 3 1 2 3

# 每个元素重复两次
rep(1:3, each = 2)  # 1 1 2 2 3 3

```

---

## 3. 批量生成编号/标签/ID

```r
paste0("Sample_", 1:5)
# 输出: "Sample_1" "Sample_2" "Sample_3" "Sample_4" "Sample_5"

# 带分组编号
paste0("Group", rep(1:3, each=2), "_", rep(1:2, 3))
# 输出: "Group1_1" "Group1_2" "Group2_1" "Group2_2" ...

```

---

## 4. 随机模拟数据

```r
set.seed(2025)
sample(1:100, 5)         # 随机选5个整数
runif(5, min=0, max=10)  # 5个0-10均匀分布数
rnorm(5, mean=5, sd=2)   # 5个均值5、标准差2的正态分布数

```

---

## 5. 应用案例

- 生成模拟样本分组
    
    ```r
    group <- rep(c("Ctrl", "Case"), each=5)
    
    ```
    
- 自动生成数据框唯一ID
    
    ```r
    df$id <- paste0("Sample_", seq_len(nrow(df)))
    
    ```
    
- 批量生成文件名
    
    ```r
    files <- paste0("result_", 1:10, ".csv")
    
    ```
    

---

## 常见易错与补充

- `seq()`和`rep()`类型要与目标场景一致（数字、字符都可）
- paste0/str_c用于批量拼接ID
- 随机数生成记得设定种子以便可复现
- 所有生成方法都可以用于 tibble/data.frame 赋值、模拟实验
