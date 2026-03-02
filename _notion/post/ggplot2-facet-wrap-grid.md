## 🧩 `facet_wrap()`：按变量分面显示子图

`facet_wrap()` 用于将一个变量的各个取值拆成**多个小图（facets）**，适合：

- 按类别逐一展示趋势/关系
- 排版整齐，横纵自动布局
- 探索分类变量下的结构或趋势差异

---

### ✅ 基本语法

```r
facet_wrap(~ variable, nrow = NULL, ncol = NULL, scales = "fixed")

```

| 参数 | 说明 |
| --- | --- |
| `~ var` | 要分面展示的变量（必须是因子或字符型） |
| `nrow` | 分面排版的行数 |
| `ncol` | 分面排版的列数 |
| `scales` | 是否统一坐标轴（见下方解释） |

---

### 🧪 示例：按 `class` 分面展示

```r
ggplot(mpg, aes(displ, hwy)) +
  geom_point() +
  facet_wrap(~ class)

```

---

### 🎨 参数详解：`scales` 控制坐标轴共享

| 值 | 含义 |
| --- | --- |
| `"fixed"` | 所有子图共用 x 和 y 轴（默认） |
| `"free"` | 每个子图 x、y 轴独立 |
| `"free_x"` | x 轴独立，y 轴共享 |
| `"free_y"` | y 轴独立，x 轴共享 |

示例：

```r
facet_wrap(~ class, scales = "free_y")

```

---

## 🧮 `facet_grid()`：按行 × 列变量分面显示

`facet_grid()` 根据两个变量（或一个变量）构建**网格型子图排布**，常用于：

- 行 × 列组合对比
- 条件分析（如性别 × 组别）
- 多因子结构展示（如 treatment × tissue）

---

### ✅ 基本语法

```r
facet_grid(rows ~ cols, scales = "fixed")

```

- `rows`：用于分面行的变量
- `cols`：用于分面列的变量
- `~`：构建网格（左为行，右为列）
- 若只指定一个变量，可写作 `. ~ var` 或 `var ~ .`

---

### 💡 示例 1：按 `drv` 分行、`cyl` 分列

```r
ggplot(mpg, aes(displ, hwy)) +
  geom_point() +
  facet_grid(drv ~ cyl)

```

效果：行 = drv，列 = cyl 的网格图，每格一个子图。

---

### 💡 示例 2：只按列分面

```r
facet_grid(. ~ class)

```

### 💡 示例 3：只按行分面

```r
facet_grid(drv ~ .)

```
