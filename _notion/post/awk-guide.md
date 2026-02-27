> awk 是一个强大的文本处理工具，比 sed 更灵活，尤其适合基于 行与列 的数据处理与分析。它由 Aho、Weinberger、Kernighan 三人设计，名字取自三人姓氏首字母。
> 

---

## 1. 基本语法

```bash
awk '条件 { 动作 }' 文件

```

- **条件**：用于匹配行（如行号、列值或模式）。缺省时匹配所有行。
- **动作**：对匹配行进行操作（打印、替换、计算）。缺省动作为 `print`。

**示例**：

```bash
echo -e "Name Age\nAlice 25\nBob 30" | awk '{print $1}'

```

输出：

```
Name
Alice
Bob

```

---

## 2. 工作流程

1. 将行拆分为字段（列）。
2. `$1`、`$2` 表示列，`$0` 表示整行。
3. 按条件判断是否匹配。
4. 执行 `{动作}`。

---

## 3. 常用操作

### 3.1 打印指定列

```bash
awk '{print $1, $3}' file.txt

```

### 3.2 条件筛选

```bash
awk '$3 > 50 {print $1, $3}' file.txt

```

### 3.3 匹配模式

```bash
awk '/pattern/ {print $0}' file.txt

```

---

## 4. 常用内置变量

| 变量 | 描述 |
| --- | --- |
| `$0` | 当前行内容 |
| `$1, $2` | 当前行的第 1、2 列 |
| `NR` | 行号，从 1 开始 |
| `NF` | 当前行的列数 |
| `FS` | 输入分隔符（默认空格/制表符） |
| `OFS` | 输出分隔符（默认空格） |
| `RS` | 输入行分隔符（默认换行） |
| `ORS` | 输出行分隔符（默认换行） |

**示例**：

```bash
awk '{print NR, NF, $0}' file.txt

```

---

## 5. 高级操作

### 5.1 设置分隔符

```bash
awk -F ',' '{print $1, $2}' file.csv

```

### 5.2 列求和

```bash
awk '{sum += $2} END {print "Total:", sum}' file.txt

```

### 5.3 条件组合

```bash
awk '$2 > 20 && $3 == "Male" {print $1}' file.txt

```

### 5.4 匹配范围

- 按行号：

```bash
awk 'NR >= 2 && NR <= 5 {print $0}' file.txt

```

- 按模式：

```bash
awk '/start/, /end/ {print $0}' file.txt

```

---

## 6. 原地修改

`awk` 无法直接改文件，可通过重定向实现：

```bash
awk '{print $1, $2}' file.txt > temp.txt && mv temp.txt file.txt

```

---

## 7. 与其他工具结合

### 7.1 管道结合

```bash
ps aux | awk '$3 > 10 {print $1, $3}'

```

### 7.2 配合 grep

```bash
grep "pattern" file.txt | awk '{print $1, $3}'

```

---

## 8. 使用脚本文件

脚本（example.awk）：

```
$2 > 50 {print $1, $2}
END {print "Processing complete"}

```

运行：

```bash
awk -f example.awk file.txt

```

---

## 9. 总结

- `awk` 适合处理表格型和结构化文本，支持条件筛选、计算、分组、模式匹配。
- 常用场景包括日志分析、数据提取、报表统计、配合管道进行数据流处理。

**常用命令小抄**：

```bash
awk '{print $1, $2}' file.txt             # 打印列
awk '$3 > 100 {print $1, $3}' file.txt    # 条件筛选
awk '{sum += $2} END {print sum}' file.txt # 列求和
awk '/pattern/ {print $0}' file.txt       # 匹配模式

```
