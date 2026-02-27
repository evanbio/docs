> sed（Stream EDitor） 是用于按行流式处理文本的编辑器，适合批量替换、插入、删除、筛选等操作。它既能处理文件，也能在管道中处理其它命令的输出；与 grep/awk 组合非常强大。
> 

---

## 1) 基本语法（Basic command）

```bash
sed [选项] '脚本' 文件…

```

- **常用选项**
    - `n`：抑制（安静）模式——默认不打印，仅显式 `p` 时输出
    - `e 'script'`：在命令行直接指定脚本（可多次）
    - `f file.sed`：从脚本文件读取命令
    - `i[SUFFIX]`：**原地编辑**（可带备份后缀；macOS 常写 `i ''`）
    - `E`（BSD/macOS）/ `r`（GNU）：启用扩展正则（ERE）
- **脚本结构**
    - **地址（可选）**：行号/范围/正则（如 `1,10`、`/start/,/end/`）
    - **命令**：`p`(打印) `d`(删除) `s`(替换) `a`(追加) `i`(插入) `c`(整行替换) …

---

### 1.1 替换文本（单处 / 全局）

```bash
sed 's/old/new/'  file.txt          # 每行只替换第1处
sed 's/old/new/g' file.txt          # 每行全替换
sed 's|/usr/local|/opt|g' file.txt  # 更换分隔符，减少转义

```

### 1.2 打印 / 删除 指定行

```bash
sed -n '3p' file.txt     # 打印第3行（-n 抑制默认输出）
sed  '2d'  file.txt      # 删除第2行
sed  '1,5d' file.txt     # 删除1-5行

```

### 1.3 按内容匹配

```bash
sed -n '/pattern/p' file.txt  # 打印匹配行
sed '/pattern/d'    file.txt  # 删除匹配行

```

### 1.4 指定列（示例由其它命令生成列）

```bash
echo -e "Name Age\nAlice 25\nBob 30" | sed -n '1!p'
# 配合 awk 做列处理更合适；sed 擅长行/模式编辑

```

---

## 2) 工作机制 & 正则

- **逐行读取 → 匹配地址/模式 → 执行命令 → 输出**
- **BRE/ERE**：GNU 缺省 BRE；`E`(BSD)/`r`(GNU) 开启 ERE
- **锚点**：`^` 行首、`$` 行尾
- **分组与反向引用**：
    
    ```bash
    # 把 "Last, First" 变为 "First Last"
    sed -E 's/^([^,]+),[[:space:]]*(.+)$/\2 \1/' names.txt
    
    ```
    
- **替换中的特殊符号**：`&` 代表整个匹配；`\1 \2 …` 为分组

---

## 3) 常用操作（整理你给的示例 + 强化）

### 3.1 条件/范围

```bash
sed -n 'NR>=2 && NR<=5p' file.txt     # 行号范围打印
sed -n '/start/,/end/p' file.txt      # 从 start 到 end 的所有行

```

### 3.2 设置分隔符/全局替换

```bash
sed 's/old/new/g' file.txt

```

### 3.3 原地修改（谨慎）

```bash
# GNU/Linux：备份为 .bak
sed -i.bak 's/old/new/g' file.txt

# macOS/BSD：必须给 -i 参数值（为空表示不生成备份）
sed -i ''  's/old/new/g' file.txt

```

### 3.4 多命令/脚本文件

```bash
sed -e '1d' -e 's/foo/bar/' file.txt

# commands.sed
1d
s/foo/bar/

sed -f commands.sed file.txt

```

### 3.5 插入/追加/整行替换

```bash
sed '2i This is new content' file.txt   # 第2行前插入
sed '2a This is new content' file.txt   # 第2行后追加
sed '2c Replaced Line 2'     file.txt   # 用新内容替换第2整行

```

### 3.6 按匹配追加/插入

```bash
sed '/Line 2/a This is new content' file.txt

```

### 3.7 文件末尾追加

```bash
sed '$a This is the end' file.txt

```

### 3.8 追加多行（用反斜杠续行）

```bash
sed '2a First new line\
Second new line' file.txt

```

---

## 4) 常用一览（Cheat Sheet）

```bash
sed '{print $1, $2}' file.txt                # <- 实际用 awk 更合适；sed 专注行/模式
sed '$a tail line' file.txt                  # 末尾加一行
sed -n '/^ERROR/p' logfile.log               # 打印含 ERROR 的行
sed -E 's/[[:space:]]+$//' file.txt          # 去除行尾空白
sed -E 's/^[[:space:]]+//' file.txt          # 去除行首空白
sed -n '3,10p' file.txt                      # 打印第3到10行
sed '/^\s*$/d' file.txt                      # 删除空行（GNU 用 [:space:]）
sed -i.bak 's/\<foo\>/bar/g' file.txt        # 整词替换（GNU -r/ERE 更直观）

```

---

## 5) Advanced Tips

- **可移植性（GNU vs BSD/macOS）**
    - ERE：GNU 用 `r`，BSD/macOS 用 `E`
    - 原地：GNU 允许 `i` 无参数，BSD/macOS 需要 `i ''`
- **性能**
    - 大文件处理前，可设 `LC_ALL=C` 加速基于字节的匹配：
        
        `LC_ALL=C sed -n '/pattern/p' big.txt`
        
- **分隔符选择**
    - `s|||` 可避免替换路径时的过度转义：`s|/old/path|/new/path|g`
- **与其它工具组合**
    - 预过滤用 `grep`，复杂列/聚合交给 `awk`，`sed` 负责模式编辑与小改动
- **多平台换行**
    - 处理 Windows 文本可先：`sed -E 's/\r$//' file.txt`（去 CR）

---

## 6) Problems & Solutions

- **问题：正则不起作用或过度转义**
    - 解决：使用 `E/-r` 启用 ERE；替换分隔符改为 `|`；检查 `\(` `\)` 是否在 BRE/ERE 下匹配
- **问题：原地失败（macOS）**
    - 解决：使用 `i ''`；或先输出到临时文件再 `mv` 覆盖
- **问题：只替换每行第 N 次出现**
    - 解决：`s/old/new/2` 只替换第2次出现；`g` 为全部
- **问题：跨行需求**
    - 解决：`sed` 以行为单位；复杂跨行逻辑可考虑 `awk`/`perl`/`python`

---

## 7) 使用场景（你给的案例整合）

- **文件处理**
    
    ```bash
    sed '/^$/d' file.txt             # 删除空行
    sed '2a New Line Content' file.txt
    
    ```
    
- **日志分析**
    
    ```bash
    sed -n '/ERROR/p' logfile.log
    
    ```
    
- **批量替换**
    
    ```bash
    sed -i 's/old/new/g' *.txt
    
    ```
    
- **与管道结合**
    
    ```bash
    ps aux | sed -n '/root/p'
    grep "pattern" file.txt | sed '{s/foo/bar/g}'
    
    ```
    

---

## 8) Learning Resources

1. GNU sed Manual（权威文档）
2. The Grymoire sed 教程（实践友好）
3. “sed one-liners” 速查（经典技巧集合）
4. Stack Overflow `sed` 标签 Wiki（常见坑与最佳实践）
