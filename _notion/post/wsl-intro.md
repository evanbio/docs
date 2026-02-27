> 在 Windows 上无缝运行 Linux，为开发者打开新世界的大门。

---

## 🧩 什么是 WSL？

Windows Subsystem for Linux（简称 **WSL**）是 Windows 提供的一项兼容子系统，

允许在 Windows 系统上原生运行 Linux 用户空间环境。

相比传统的虚拟机（如 VMware Workstation、VirtualBox）：

- WSL **几乎无启动开销**，打开终端即进入 Linux
- 占用资源极低，无需完整模拟硬件
- 可与 Windows 文件系统互通，开发效率更高

---

## ⚙️ 两个版本

| 版本 | 内核实现 | 性能 | 特点 |
| --- | --- | --- | --- |
| **WSL1** | 系统调用翻译层 | 快速启动、I/O快 | 轻量，但兼容性不足 |
| **WSL2** | 轻量 VM + 原生 Linux 内核 | 文件 I/O 较慢 | 兼容性最佳，支持 Docker 等容器生态 |

目前推荐使用 **WSL2**。

---

## 🧪 能做什么

- 使用 Linux 命令行工具（`bash`, `sed`, `grep`, `ssh`…）
- 运行 Linux-only 开发环境（Python、Node.js、Docker 等）
- 直接在 VS Code 中打开 WSL 里的项目进行开发
- 与 Windows 文件互通（Linux 里 `/mnt/c/` 就是 C 盘）

---

## ⚡️ 安装简述

1. **启用 WSL 功能**

    ```powershell
    wsl --install
    ```

2. **选择发行版**（如 Ubuntu）

    ```powershell
    wsl --install -d Ubuntu
    ```

3. **切换为 WSL2**

    ```powershell
    wsl --set-version Ubuntu 2
    ```

首次进入会提示创建用户名和密码。

---

## 🖥️ 使用体验

- 打开 Windows Terminal，选择 **Ubuntu** 即进入 Linux
- 可以同时使用 `explorer.exe .` 打开当前目录的资源管理器
- 在 VS Code 里安装 Remote - WSL 插件，即可在 WSL 环境中开发

---

## 📌 总结

WSL 让开发者在 Windows 上获得原生 Linux 环境，

特别适合：

- 想用 Linux 工具链但不想装虚拟机
- 平常主要在 Windows 工作但偶尔需要 Linux 环境
- 做数据科学、AI、后端开发等依赖 Linux 的项目
