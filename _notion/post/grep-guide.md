> grep (Global Regular Expression Print) 是 Linux/Unix 系统中最常用的文本搜索工具之一。它基于 正则表达式 匹配，能在文件或输入流中快速查找指定内容，常用于日志分析、代码搜索和系统监控。
> 

---

## 1) 基本语法（Basic command）

```bash
grep [选项] '匹配模式' 文件

```

**示例**：

```bash
grep "hello" file.txt

```

输出所有包含 `"hello"` 的行。

---

## 2) 常用选项

| 选项 | 功能 | 示例 |
| --- | --- | --- |
| `-i` | 忽略大小写 | `grep -i "hello" file.txt` |
| `-v` | 反向匹配（输出不包含的行） | `grep -v "hello" file.txt` |
| `-n` | 显示行号 | `grep -n "hello" file.txt` |
| `-c` | 只输出匹配行数 | `grep -c "hello" file.txt` |
| `-l` | 只输出匹配的文件名 | `grep -l "hello" *.txt` |
| `-r/-R` | 递归搜索目录 | `grep -r "hello" /path` |
| `-w` | 匹配整个单词 | `grep -w "hello" file.txt` |
| `-x` | 匹配整行 | `grep -x "hello world" file.txt` |
| `--color` | 高亮匹配内容 | `grep --color "hello" file.txt` |
| `-A N` | 输出匹配行及后 N 行 | `grep -A 3 "hello" file.txt` |
| `-B N` | 输出匹配行及前 N 行 | `grep -B 3 "hello" file.txt` |
| `-C N` | 输出匹配行及上下 N 行 | `grep -C 3 "hello" file.txt` |

---

## 3) 高级功能

### 3.1 正则表达式

- **单词边界**：
    
    ```bash
    grep '\bhello\b' file.txt
    
    ```
    
- **多模式**：
    
    ```bash
    grep -E "cat|dog" file.txt
    
    ```
    
- **行首/行尾**：
    
    ```bash
    grep "^hello" file.txt
    grep "world$" file.txt
    
    ```
    
- **重复字符**：
    
    ```bash
    grep "a\{3\}" file.txt   # 连续3个a
    
    ```
    

### 3.2 多文件搜索

```bash
grep "hello" file1.txt file2.txt

```

### 3.3 二进制文件

```bash
grep -a "hello" binary_file

```

---

## 4) 递归搜索

```bash
grep -r "hello" /path/to/dir

```

在整个目录及子目录搜索 `"hello"`。

---

## 5) 输出控制

- **只显示匹配部分**：
    
    ```bash
    grep -o "hello" file.txt
    
    ```
    
- **统计匹配行数**：
    
    ```bash
    grep -c "hello" file.txt
    
    ```
    

---

## 6) 与其他命令结合

- **过滤进程**：
    
    ```bash
    ps aux | grep "nginx"
    
    ```
    
- **日志分析**：
    
    ```bash
    cat /var/log/syslog | grep "ERROR"
    
    ```
    
- **查找包含内容的文件**：
    
    ```bash
    find /path -type f -exec grep -l "hello" {} +
    
    ```
    
- **实时监控日志**：
    
    ```bash
    tail -f /var/log/syslog | grep "ERROR"
    
    ```
    

---

## 7) 常见应用场景

1. **代码搜索**：
    
    ```bash
    grep "function_name" *.c
    
    ```
    
2. **日志筛选**：
    
    ```bash
    grep "2025-09-08" /var/log/syslog
    
    ```
    
3. **配置文件检查**：
    
    ```bash
    grep "listen" /etc/nginx/nginx.conf
    
    ```
    

---

## 8) 注意事项

- 默认大小写敏感，忽略大小写需 `i`。
- 不能跨行匹配，多行匹配需结合 `awk`/`sed`。
- 大目录递归时注意性能，必要时用 `-include` 或 `-exclude` 限制范围。

---

## 总结

- `grep` 是高效的文本搜索工具，支持强大的正则表达式。
- 与 `awk`、`sed` 组合，能完成几乎所有文本处理任务。
- 在日志分析、代码定位、系统监控中不可或缺。
