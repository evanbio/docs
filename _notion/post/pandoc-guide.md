> Pandoc 是一个强大的文档转换工具，被称为“文档界的瑞士军刀”。它支持在 Markdown、Word、LaTeX、PDF、HTML 等几十种格式之间相互转换。本文整理 Pandoc 的基本概念、常见用法与进阶技巧。
> 

---

## 1. 什么是 Pandoc

- **定义**：一个独立的命令行工具，而不是浏览器插件或应用。
- **作用**：实现跨格式文档互转。常见场景包括：
    - Markdown → Word / PDF / LaTeX
    - Word → Markdown
    - HTML → PDF
    - 多个 Markdown 文件 → 合并成一本书（支持目录、交叉引用）
- **安装方式**：从 [pandoc.org](https://pandoc.org/) 下载，或通过包管理器（如 brew、apt、choco）安装。

---

## 2. 基本使用方式

Pandoc 的基本命令结构：

```bash
pandoc input_file -o output_file
```

示例：

- Markdown → Word
    
    ```bash
    pandoc input.md -o output.docx
    
    ```
    
- Markdown → PDF
    
    ```bash
    pandoc input.md -o output.pdf
    ```
    
- Word → Markdown
    
    ```bash
    pandoc input.docx -o output.md
    ```
    

---

## 3. 常用功能

- **支持多格式**：Markdown、reStructuredText、HTML、LaTeX、Docx、ODT、EPUB、PDF…
- **内嵌元信息**：支持在 Markdown 文件顶部写元信息（YAML header），控制标题、作者、日期、主题等。
- **模板机制**：可自定义 Word 模板（.dotx）、LaTeX 模板，实现排版可控。
- **过滤器（filters）**：支持 Lua 或外部脚本对文档内容进行处理，例如自动生成参考文献、图表编号等。

---

## 4. 进阶技巧

- **合并多个文件**
    
    ```bash
    pandoc part1.md part2.md -o book.pdf
    
    ```
    
- **引用文献**
    
    ```bash
    pandoc paper.md --citeproc --bibliography=ref.bib -o paper.pdf
    
    ```
    
- **指定模板**（Word）
    
    ```bash
    pandoc input.md --reference-doc=template.docx -o styled.docx
    
    ```
    
- **自定义 LaTeX 引擎**（XeLaTeX / LuaLaTeX）
    
    ```bash
    pandoc input.md -o output.pdf --pdf-engine=xelatex
    
    ```
    

---

## 5. 应用场景

- **科研写作**：Markdown + BibTeX → LaTeX/PDF/Word，快速生成学术论文。
- **技术文档**：Markdown → HTML / PDF / Word，多渠道发布。
- **书籍写作**：配合目录、脚注、交叉引用 → EPUB、PDF、印刷版。
- **自动化报告**：与 R、Python、Quarto 等结合，批量生成报告。

---

## 6. 学习与资源

- 官方文档：https://pandoc.org/MANUAL.html
- 常见教程：搜索 “Pandoc cheat sheet”
- 推荐结合工具：
    - **Quarto**（基于 Pandoc 的下一代科研/出版工具）
    - **R Markdown**（RStudio 集成，内部调用 Pandoc）

### **总结**

Pandoc 适合做 **“格式桥梁”**：无论你写 Markdown、Word、LaTeX，还是做学术论文/技术报告/书籍，Pandoc 都能作为最后的统一出口。掌握基本命令 + 模板定制，就能大大简化日常写作与发布流程。
