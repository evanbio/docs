> 本文解析一个通用的 GitHub PR 模板：说明每一条勾选项背后的目的，给出提交前自检清单，并提供两个可选变体（严格版 / 精简版）以便在不同仓库复用。
> 

---

## 1) 原始模板

```markdown
### Describe your change:

- [ ]  Add an algorithm?
- [ ]  Fix a bug or typo in an existing algorithm?
- [ ]  Add or change doctests? -- Note: Please avoid changing both code and tests in a single pull request.
- [ ]  Documentation change?

### Checklist:

- [ ]  I have read [CONTRIBUTING.md](https://github.com/TheAlgorithms/Python/blob/master/CONTRIBUTING.md).
- [ ]  This pull request is all my own work -- I have not plagiarized.
- [ ]  I know that pull requests will not be merged if they fail the automated tests.
- [ ]  This PR only changes one algorithm file. To ease review, please open separate PRs for separate algorithms.
- [ ]  All new Python files are placed inside an existing directory.
- [ ]  All filenames are in all lowercase characters with no spaces or dashes.
- [ ]  All functions and variable names follow Python naming conventions.
- [ ]  All function parameters and return values are annotated with Python [type hints](https://docs.python.org/3/library/typing.html).
- [ ]  All functions have [doctests](https://docs.python.org/3/library/doctest.html) that pass the automated testing.
- [ ]  All new algorithms include at least one URL that points to Wikipedia or another similar explanation.
- [ ]  If this pull request resolves one or more open issues then the description above includes the issue number(s) with a [closing keyword](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue): "Fixes #ISSUE-NUMBER".

```

---

## 2) 逐条解读（为什么要这样做）

### A. Describe your change

- **Add an algorithm / Fix a bug / doctests / docs**：要求**明确 PR 的单一目标**。避免“又改代码又改测试”的混搭——评审会变慢、回滚困难。

### B. Checklist

- **Read CONTRIBUTING.md**：团队流程和规范的入口；不同仓库可能有 commit/branch/CI 要求。
- **Own work / no plagiarism**：版权与声誉底线，也减少潜在法律风险。
- **Automated tests must pass**：PR 进入主分支前的最低质量门槛。
- **Only one algorithm per PR**：**最重要的“原子化”原则**，让评审与回滚最小化。
- **File layout / lowercase filenames**：统一目录与命名，便于检索与脚手架工具自动化。
- **PEP 8 命名（Python conventions）**：团队可读性与工具化（lint/IDE）基础。
- **Type hints 必填**：提升 IDE/CI 的静态检查能力；让文档与测试更清晰。
- **Doctests 必须通过**：示例即测试，降低“示例不可信”的风险。
- **附参考链接（Wiki/论文/教材）**：方便审阅者理解算法来源与正确性。
- **Issue 关联（Fixes #...）**：自动关闭问题单，形成“需求 → 代码 → 合入”的可追踪链路。

---

## 3) 常见踩坑与规避

- **一次 PR 改太多**：拆分为多 PR（功能新增 / 重构 / 测试 / 文档），每个 PR 控制在可读范围（通常 < 300 行变更）。
- **测试覆盖不到边界**：为 0/负数/空输入/极端长度等添加 doctests 或单测。
- **命名不统一**：CI 加 `ruff`/`flake8` + `isort`，本地预提交（pre-commit）钩子强制统一。
- **类型缺失**：打开 `mypy --strict`（或在 CI 用 `pyright`）及早发现问题。
- **未关联 Issue**：如果是新功能，先开 Issue，讨论清楚再提交 PR，减少返工。

---

## 4) 提交前 10 项自检（可复制到团队 Wiki）

1. 变更是否**单一目的**？
2. 代码是否通过本地 lint / format（`ruff`, `black`, `isort`）？
3. 是否补全 **type hints**？
4. 新/改函数是否有 **doctests** 且全部通过？
5. 是否需要**额外单元测试**覆盖边界与异常？
6. 文件是否放在**正确目录**，文件名**全小写无空格/短横线**？
7. 是否遵循**命名规范**（函数/变量/模块）？
8. 是否在 PR 描述里附上**参考链接**（Wiki/论文/教材）？
9. 是否在 PR 描述中使用 **Fixes #123** 关联 Issue（如适用）？
10. PR 文本是否**清晰、可差异化评审**（附动机、设计取舍、影响范围）？

---

## 5) 可选变体

### 5.1 严格版（适合公共/大型仓库）

```markdown
### Motivation
- Problem / context:
- Why this approach (alternatives considered):

### Changes
- [ ] Single-purpose PR (code OR tests OR docs)
- [ ] Backward compatible (or list breaking changes below)

### Tests
- [ ] Added/updated doctests
- [ ] Added unit tests (edge cases, error paths)
- [ ] All CI checks pass (lint, type-check, tests)

### Quality
- [ ] Type hints everywhere (public APIs)
- [ ] PEP 8 naming; filenames lowercase_no_spaces
- [ ] Added references (Wikipedia/Book/Paper)
- [ ] Updated README/Docs (if behavior changed)

### Links
- Issues: Fixes #123 (optional)
- References: <urls>

### Breaking Changes (if any)
- Description & migration notes:

```

### 5.2 精简版（适合个人/内部小仓库）

```markdown
### What & Why
- Summary:

### Checklist
- [ ] Single-purpose
- [ ] Lint/format OK
- [ ] Type hints added
- [ ] Tests updated/passing
- [ ] Docs updated (if needed)
- [ ] Fixes # (optional)

### Notes
- Impact / alternatives / rollout:

```

---

## 6) 落地建议（自动化与团队习惯）

- **预提交钩子**：在仓库启用 `pre-commit`（`ruff`, `black`, `isort`, `mypy`），让开发机在提交前自动校验。
- **CI 工作流**：GitHub Actions 配置分步执行（lint → type-check → tests），PR 必须全绿才允许合并。
- **模板版本化**：PR 模板与 CONTRIBUTING.md 同步更新；大改之前开讨论/投票，避免“隐性规范”。
- **新人上手包**：在仓库首页 README 放“提交 PR 三步走”链接（模板、分支策略、示例 PR）。
