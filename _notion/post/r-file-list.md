R 脚本中经常需要批量读取、处理一组文件，核心是**获取目录下所有文件名，并可按类型或模式筛选**。这里总结最常用方法和典型场景。

---

## 1. 获取当前目录下所有文件名

```r
files <- dir()
# 或
files <- list.files()
```

## 2. 筛选特定类型（如csv、txt等）

用正则表达式筛选文件名。

```r
csv_files <- grep("csv$", files, value = TRUE)
# 或用pattern参数更简洁：
csv_files <- list.files(pattern = "\\.csv$")

```

---

## 3. 获取带完整路径的文件名

```r
list.files(path = "data", pattern = "\\.csv$", full.names = TRUE)

```

---

## 4. 典型应用场景

- **批量读取数据文件：**
    
    ```r
    files <- list.files(pattern = "\\.csv$")
    for (f in files) {
      df <- read.csv(f)
      # 处理df...
    }
    
    ```
    
- **分组处理不同文件类型**
    
    ```r
    txt_files <- list.files(pattern = "\\.txt$")
    
    ```
    

---

## 5. 常见tips

- `pattern`参数支持正则表达式，记得转义“.”
- 获取子文件夹需设置`recursive = TRUE`
- `full.names = TRUE`会返回带路径的文件名，推荐配合批量读取使用
- 文件排序可用`sort()`或`mixedsort()`（gtools包）

---

**本页持续补充常用批量文件处理、命名和筛选技巧。**
