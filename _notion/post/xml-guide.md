> XML (eXtensible Markup Language) 是一种用于描述、存储和传输数据的标记语言。它强调数据的结构化和自描述性，常用于 Web 服务、配置文件、文档格式和跨平台数据交换。
> 

---

## 1. 基本信息

- **文件扩展名**：`.xml`
- **用途**：数据描述、存储与传输（如 Web 服务、配置文件、Office 文档格式）
- **设计目标**：自描述性强，平台无关，适合跨系统的数据交换

---

## 2. 语法规则

### 2.1 自定义标签

用户可根据需要定义标签，结构化表示数据：

```xml
<book>
  <title>Effective Python</title>
  <author>Brett Slatkin</author>
</book>

```

---

### 2.2 严格的语法要求

- **闭合标签**：所有开始标签 `<tag>` 必须有结束标签 `</tag>`
- **区分大小写**：标签名称必须严格一致
- **根元素唯一**：每个 XML 文档必须有且仅有一个根元素
- **属性必须加引号**：

```xml
<book category="programming">
  <title>Effective Python</title>
</book>

```

---

### 2.3 可扩展性

XML 允许用户自定义标签，能灵活适应不同数据结构。

---

### 2.4 数据存储与传输

XML 常用于存储和交换结构化数据，例如书籍数据：

```xml
<books>
  <book id="1">
    <title>Effective Python</title>
    <author>Brett Slatkin</author>
    <year>2015</year>
  </book>
  <book id="2">
    <title>Clean Code</title>
    <author>Robert C. Martin</author>
    <year>2008</year>
  </book>
</books>

```

---

## 3. 优缺点

**优点**

- 自描述性强，易于理解与解析
- 可扩展性强，适合不同数据结构
- 平台无关，便于跨系统传输

**缺点**

- 语法冗长，文件体积较大
- 数据传输效率不如简化格式（如 JSON）

---

## 4. 常见应用

- **Web 服务**：SOAP、RSS、Atom 等协议
- **配置文件**：早期软件配置（如 Android manifest、Maven POM 文件）
- **文档格式**：Microsoft Office Open XML (`.docx`, `.xlsx`) 等
- **跨系统通信**：在 JSON 流行前，XML 是标准的数据交换格式
