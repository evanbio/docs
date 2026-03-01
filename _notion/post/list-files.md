## 📌 简介

`list.files()` 是 R **base** 包中的文件操作函数，用于列出指定目录下的文件或目录名称。

它常用于：

- 批量读取文件
- 筛选特定类型文件
- 递归遍历文件夹

---

## 📌 常用参数

- **`path`**：指定要列出的目录，默认为当前目录 `"."`
- **`pattern`**：正则表达式过滤文件名（如 `"\\.txt$"` 匹配 `.txt` 文件）
- **`recursive`**：是否递归子目录，默认为 `FALSE`
- **`full.names`**：返回完整路径（`TRUE`）或仅文件名（`FALSE`）
- **`ignore.case`**：是否忽略大小写，仅与 `pattern` 配合使用
- **`no..`**：是否排除 `.` 和 `..` 目录（Linux/Unix 系统有效）

---

## 🚀 典型用法

```r
# 当前目录下所有文件
list.files()

# 指定目录
list.files("data")

# 按后缀过滤文件
list.files("data", pattern = "\\.txt$")

# 递归子目录
list.files("data", recursive = TRUE)

# 返回完整路径
list.files("data", full.names = TRUE)

```

---

## 📎 综合筛选示例

```r
list.files(
  path = "data",
  pattern = "\\.txt$",
  recursive = TRUE,
  full.names = TRUE,
  ignore.case = TRUE
)

```

此例结合了路径、后缀过滤、递归、完整路径输出和大小写忽略功能，适合一次性筛选文件。

---

## 💡 提示与补充

- 可与 `file.path()`、`dir.create()`、`file.exists()` 等函数配合形成完整的文件处理流程
- 属于 **base** 包，无需额外加载
- 在处理大目录时，可结合 `pattern` 和 `recursive` 提高搜索效率
