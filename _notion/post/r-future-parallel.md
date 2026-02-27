## 1. 为什么要用 future？

在 R 里写并行代码常常需要切换不同接口（`parallel`、`foreach`、`BiocParallel`…），很容易混乱。

`future` 包提供了一层统一抽象：

- 写一次代码，只改 `plan()` 就能在 **顺序、本地并行、集群** 等环境切换；
- 支持异步：多个任务同时启动，之后再收集结果；
- 有丰富生态：`future.apply`, `furrr`, `doFuture` 等。

> 它的目标就是——把并行/异步计算写得像普通 R 代码一样自然。
> 

---

## 2. 核心概念

- **future**：一个“将在未来完成的计算”。
- **plan()**：设定执行策略（`sequential`, `multisession`, `multicore`, `cluster`）。
- **value()**：提取结果，必要时会阻塞。
- **resolved() / status()**：检查是否完成、返回状态。
- **%<-%**：future assignment 操作符，用来更简洁地“绑定”一个 future 结果。

---

## 3. 两种方式创建 future

### 3.1 用 `future()` 明确创建对象

```r
library(future)
plan(multisession)

f <- future({ Sys.sleep(2); 42 })  # 返回一个 Future 对象
f        # 显示状态
value(f) # 取结果

```

### 3.2 用 `%<-%` 异步赋值

```r
x %<-% { Sys.sleep(2); 42 }
x   # 第一次访问时阻塞，得到 42

```

📌 区别：

- `future()` → 得到一个 Future 对象，之后要显式 `value(f)`。
- `%<-%` → 得到的是结果的“占位符”，访问时才会触发计算完成。

---

## 4. 进阶用法

### 4.1 变量隔离

future 在独立进程里跑，不会修改全局环境：

```r
a <- 1
y %<-% { a <- 2; 2 * a }
y  # 4
a  # 仍然是 1

```

### 4.2 进程 PID

```r
pid <- Sys.getpid()
print(pid)

f1 %<-% { Sys.getpid() }
f2 %<-% { Sys.getpid() }

f1; f2   # 两个 worker PID ≠ 主进程 PID

```

### 4.3 批量并行

- **future.apply**

```r
library(future.apply)
plan(multisession)
res <- future_lapply(1:5, function(i) { Sys.sleep(i); i^2 })
print(res)

```

- **furrr**

```r
library(furrr)
plan(multisession)
res <- future_map(1:5, ~{ Sys.sleep(1); .x^2 })
print(res)

```

- **doFuture + foreach**

```r
library(doFuture)
plan(multisession)
foreach(i=1:5, .combine="c") %dofuture% {
  Sys.sleep(1)
  paste("任务", i, "完成")
}

```

---

## 5. 常见陷阱

| 场景 | 注意事项 |
| --- | --- |
| Windows 不支持 `multicore()` | 用 `multisession()` 代替 |
| 随机数结果不一致 | 设置 `options(future.seed = TRUE)` |
| 大对象传输 | 每个 worker 会拷贝，内存占用大 |
| 嵌套 futures | 有些后端不支持，需谨慎 |
| 错误提示不直观 | 先在 `plan(sequential)` 下调试 |

---

## 6. 调试技巧

- 开发阶段用 `plan(sequential)`，方便定位错误。
- 在 future 内多写 `message()`，方便追踪。
- 用 `resolved()` 检查任务是否完成。
- 用 `Sys.getpid()` 确认代码跑在哪个进程。

---

## 7. 典型使用场景

1. **长耗时计算 → 不想阻塞**
    
    ```r
    x %<-% { heavy_function() }
    # 继续做别的事
    result <- x   # 等到真正需要时才取结果
    
    ```
    
2. **独立任务的批量并行**
    - 模拟数据、重复实验、bootstrap
    - 图像/文件批量处理
    
    ```r
    res <- future_lapply(1:100, function(i) sim_once(i))
    
    ```
    
3. **管道/函数式写法下的并行**
    - 和 purrr 结合 → `furrr::future_map`
    - 在 tidyverse 流程里透明地切换并行
4. **已有 foreach 代码迁移**
    - 用 `doFuture` 替代原本的后端（如 doParallel），只需改一行 `registerDoFuture()`。
5. **跨平台脚本**
    - 在 Windows / Linux 都能运行相同代码，只需设置不同 plan。

---

## 8. 总结

- **核心理念**：统一 API，把并行/异步写得和普通 R 代码一样自然。
- **什么时候用？**
    - 需要同时跑多个独立任务（模拟、批处理、bootstrap）。
    - 想在 Windows / Linux 跨平台复用同一份代码。
    - 不想被某个后端绑定，未来可能切换到集群/远程计算。
    - 想在 tidyverse 或 foreach 生态里无缝接入并行。
- **实践建议**：
    - 开发时用顺序 plan 调试；
    - 投产时改为并行 plan；
    - 注意内存和随机数重现性。

> 一句话记住：future 适合“独立任务 + 跨平台 + 想省心”的并行场景。
>
