> TOML (Tom's Obvious, Minimal Language) 是一种简洁的配置文件格式，强调可读性和易用性。它常用于软件和项目的配置文件，尤其在 Python 生态中（如 pyproject.toml）已成为标准。
> 

---

## 1. 基本信息

- **文件扩展名**：`.toml`
- **用途**：配置文件、应用参数、项目管理（如 Python 的构建工具、Rust 的 Cargo 配置等）
- **设计目标**：简单直观，便于人工编辑，同时可被机器高效解析

---

## 2. 语法规则

### 2.1 键值对

- 使用 `=` 分隔键和值
- 字符串需用双引号 `" "` 包裹，数字和布尔值可直接书写

```toml
title = "My Project"
version = 1.0
debug = true

```

---

### 2.2 表格 (Tables)

- 用方括号 `[]` 定义表格，类似 JSON 的对象
- 一个表格下可包含多个相关键值对

```toml
[database]
server = "localhost"
ports = [8000, 8001, 8002]

```

---

### 2.3 嵌套表格 (Nested Tables)

- 使用 `.` 来表示层级关系

```toml
[owner]
name = "Chris"

[owner.address]
street = "123 Main St"
city = "Shanghai"

```

---

### 2.4 数组 (Arrays)

- 使用 `[]` 表示，值之间用逗号分隔

```toml
fruits = ["apple", "banana", "cherry"]

```

---

### 2.5 日期与时间

- 支持 **ISO 8601** 格式

```toml
release_date = 2024-10-20T12:00:00Z

```

---

### 2.6 注释

- 使用 `#` 开头

```toml
# 这是一个注释
title = "My Project"  # 行尾注释

```

---

## 3. 示例

```toml
# 基本键值对
title = "Example TOML"
version = 1.1
debug = true

# 表格
[database]
server = "192.168.1.1"
ports = [8000, 8001, 8002]
enabled = true

# 嵌套表格
[owner]
name = "Chris"

[owner.address]
street = "456 Another St"
city = "Shanghai"

# 日期和时间
release_date = 2024-10-20T12:00:00Z

```

---

## 4. 优缺点

**优点**

- 可读性强，语法简洁，适合人工维护
- 原生支持日期和时间（比 JSON 更友好）
- 更严格的规范，减少解析歧义

**缺点**

- 使用范围较 JSON/YAML 小，主要集中在 Python、Rust 等生态
- 不支持复杂的表达式，仅限配置用途

---

## 5. 常见应用

- **Python 项目**：`pyproject.toml` 用于构建工具和依赖管理（如 Poetry, Hatch）
- **Rust 项目**：`Cargo.toml` 用于依赖与项目配置
- **应用配置**：适合跨平台的配置文件标准化
