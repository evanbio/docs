> Linux 是一种开源的类 Unix 操作系统内核，由 Linus Torvalds 在 1991 年首次发布。基于 Linux 内核构建的发行版广泛应用于服务器、嵌入式系统、桌面环境和科研领域。
> 

---

## 1. 什么是 Linux

- **内核**：负责管理硬件资源与应用程序的交互。
- **开源**：遵循 GNU GPL 协议，任何人可自由使用、修改和分发。

---

## 2. Linux 的特点

- **开源**：代码透明，可自由修改。
- **稳定性**：长期运行不宕机，广泛用于服务器。
- **多用户/多任务**：支持多用户独立权限与多进程并行。
- **安全性**：文件权限和用户隔离；社区快速修复漏洞。
- **轻量与高性能**：适配从服务器到 IoT 的各类设备，可高度定制。

---

## 3. 常见发行版

- **服务器/企业级**：Ubuntu Server、CentOS/AlmaLinux/RockyLinux、Debian
- **桌面环境**：Ubuntu Desktop、Linux Mint、Fedora
- **嵌入式系统**：Raspberry Pi OS、Yocto Project

---

## 4. Linux 的基本架构

- **内核 (Kernel)**：管理硬件资源，提供系统调用。
- **Shell**：命令行交互工具（Bash、Zsh、Fish）。
- **文件系统**：树状结构，根目录 `/` 为起点；常见类型 ext4、XFS、Btrfs。
- **包管理器**：软件安装/更新工具（Debian 系列用 `apt`，Red Hat 系列用 `yum/dnf`）。

---

## 5. 应用场景

- **服务器**：网站托管、数据库、云计算（>90% 服务器运行 Linux）。
- **嵌入式设备**：智能电视、路由器、无人机。
- **开发与科研**：支持多语言与高性能计算，常见于生物信息学、机器学习。
- **网络与安全**：运行 Web 服务 (Nginx/Apache)，以及安全工具 (Kali Linux)。

---

## 6. 基本命令速览

- **文件与目录**：`ls` `cd` `pwd` `mkdir` `rm` `cp` `mv`
- **权限管理**：`chmod` `chown`
- **进程管理**：`ps` `top` `kill`
- **网络相关**：`ping` `curl` `ifconfig`
- **包管理**：
    
    ```bash
    sudo apt update
    sudo apt install pkg
    sudo apt remove pkg
    
    ```
    

---

## 7. Linux 的优缺点

- **优点**：免费开源、稳定安全、定制性强、社区支持活跃。
- **缺点**：学习曲线较陡，新手上手难度高；部分商业软件兼容性不足。

---

## 8. 学习资源

- **官网**：[Linux.org](https://www.linux.org/)，[Ubuntu](https://ubuntu.com/)
- **书籍**：[The Linux Command Line](https://linuxcommand.org/)
- **在线课程**：Coursera Linux 基础课程
- **练习平台**：VMware/VirtualBox 虚拟机，[OverTheWire](https://overthewire.org/wargames/bandit/)
