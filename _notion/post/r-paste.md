# R字符串拼接 paste/paste0 典型用法

---

## 1. paste 基本用法

```r
paste('Hello', 'World', sep = ', ')
# 结果: "Hello, World"
```

- `sep` 指定各元素间的分隔符（默认是空格）

---

## 2. paste 的向量化拼接

```r
paste(c('Hello', 'World'), c(1, 2, 3), sep = ', ')
# 结果: "Hello, 1" "World, 2" "Hello, 3"
# 向量自动 recycle 补齐

```

---

## 3. collapse 合并所有结果

```r
paste(letters[1:3], 1:3, sep = '-', collapse = '; ')
# 结果: "a-1; b-2; c-3"
# 多组结果用collapse合并成一个字符串，指定分隔符

```

---

## 4. paste0 速查

```r
paste0('Hello', 'World')
# 结果: "HelloWorld"

```

- paste0 等价于 paste(..., sep = "")，不自动加空格

---

## 5. 常见应用场景

- 批量生成变量名、文件名、标签（如"Sample_1"到"Sample_100"）
- 合并分组信息、拼接注释内容
- 构造路径、URL、日志输出等

---

## 6. paste 与 paste0 对比

| 用法 | paste | paste0 |
| --- | --- | --- |
| 默认分隔符 | 空格 | 无 |
| sep 参数 | 可自定义 | 一般不用 |
| collapse参数 | 支持 | 支持 |
| 常用场景 | 日常拼接、分隔符 | 快速拼接无分隔符 |

---

## 7. 典型模板

```r
# 批量文件名
paste0('file_', 1:5, '.txt')
# 结果: "file_1.txt" "file_2.txt" "file_3.txt" "file_4.txt" "file_5.txt"

# 多条件标签
paste('Group', 1:3, sep = '-')
# 结果: "Group-1" "Group-2" "Group-3"

```
