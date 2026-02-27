> YAML (YAML Ain't Markup Language) 是一种人类可读的标记语言，广泛用于配置文件（如 Ansible、Docker、Kubernetes 等工具）。它以简洁的语法表达复杂数据结构，尤其适合需要人工编写和维护的场景。
> 

---

## 1. 基本信息

- **文件扩展名**：`.yaml` 或 `.yml`
- **用途**：配置文件、脚本配置、结构化数据存储
- **特点**：强调可读性，专为人类编辑设计

---

## 2. 语法规则

- **缩进**：使用空格（不能用 Tab），缩进表示层次结构
- **键值对**：`key: value` 格式，不强制加引号
- **字符串**：一般直接写；若包含特殊字符（如冒号 `:`），需加引号
- **列表**：用短横线 `-` 表示数组元素
- **注释**：使用 `#` 表示

---

## 3. 示例

### 基础示例

```yaml
name: Chris
age: 24
languages:
  - Python
  - R
isStudent: false

```

### 列表与嵌套示例

```yaml
updates:
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "daily"
  - package-ecosystem: "npm"
    directory: "/frontend"
    schedule:
      interval: "weekly"

```

---

## 4. 优缺点

**优点**

- 可读性强，语法简洁，易于手工编辑
- 支持注释，便于解释和维护配置
- 能灵活表示复杂的嵌套结构

**缺点**

- 对缩进高度敏感，容易因缩进错误导致解析失败
- 相比 JSON，解析速度稍慢

---

## 5. 常见用法

- **基础设施配置**：Ansible playbooks、Kubernetes 配置文件、Docker Compose
- **应用程序配置**：CI/CD 管道（如 GitHub Actions、GitLab CI）、Web 框架参数文件
- **数据表示**：适合需要人工可读的多层次结构数据

---

## 6. Notes

- 短横线 `-` 用于表示列表中的元素，类似 JSON 中的数组。
- 在 `updates` 这样的场景下，每个 `-` 对应一个更新规则，是 YAML 表达批量配置的常见模式。
