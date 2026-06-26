---
title: DMIT VLESS-Reality 部署与 TCP 劫持排障笔记
type: Post
status: Published
date: 2026-06-26
slug: dmit-vless-reality
summary: 本笔记记录在 DMIT Debian 12 纯净环境中部署 Xray VLESS-Reality 的过程，并复盘一次客户端断连、端口可达但 Xray 无入站日志的 TCP 劫持排障。
tags: DMIT; Xray; VLESS; Reality; VPS
category: 🛠 Tech
---

本文记录一次在 DMIT Debian 12 纯净环境中部署 Xray VLESS-Reality 的过程，以及后续遇到连接异常时的排查思路。内容以复盘为主，便于以后迁移、重装或定位类似问题。

## 环境概览

| 项目 | 配置 |
| --- | --- |
| OS | Debian 12 |
| 核心 | Xray-core v26.3.27 |
| 协议 | VLESS-TCP-Reality |
| Flow | `xtls-rprx-vision` |
| 网络 | DMIT Premium，CN2 GIA / CMIN2 |

---

## Phase 1: 基础环境初始化

### 1. SSH 密钥登录

DMIT 默认使用密钥文件登录。Windows PowerShell 下可直接指定 `.pem` 文件：

```powershell
ssh -i "D:\dmit\id_rsa.pem" root@<Server_IP>
```

如果遇到 `UNPROTECTED PRIVATE KEY FILE` 警告，需要调整 `.pem` 文件的 Windows 安全权限，仅保留当前用户的读取权限。

### 2. 补齐基础组件与云环境支持

先更新系统并安装常用工具：

```bash
apt update && apt upgrade -y
apt install curl wget nano -y
```

随后安装 DMIT 官方推荐的云环境组件，确保面板中的平滑关机、IP 更换后的自动配置等功能可以正常工作：

```bash
apt install -y qemu-guest-agent cloud-init
systemctl start qemu-guest-agent
```

### 3. 启用 BBR 与 fq 队列

开启 BBR 拥塞控制算法与 fq 队列，以更好地利用线路带宽：

```bash
echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf
echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf
sysctl -p
```

---

## Phase 2: 部署 Xray 核心服务

### 1. 安装 Xray-core

使用 XTLS 官方安装脚本部署 Xray：

```bash
bash <(curl -L https://raw.githubusercontent.com/XTLS/Xray-install/main/install-release.sh)
```

安装过程中如果出现 `curl: (22) The requested URL returned error: 502`，通常是 GitHub CDN 节点临时异常，导致 `.dgst` 签名文件拉取失败。等待片刻后重新执行即可。

### 2. 生成 Reality 所需参数

Reality 配置需要 UUID、X25519 密钥对和 shortId：

```bash
xray uuid             # 生成 UUID
xray x25519           # 生成 Private Key 与 Public Key
openssl rand -hex 8   # 生成 16 位 shortId
```

生成后建议将这些参数同步备份到本地，后续客户端配置会用到。

### 3. 编写 Xray 配置

创建配置目录并编辑主配置文件：

```bash
mkdir -p /usr/local/etc/xray/
nano /usr/local/etc/xray/config.json
```

核心配置如下：

```json
{
  "inbounds": [
    {
      "port": 443,
      "listen": "0.0.0.0",
      "protocol": "vless",
      "settings": {
        "clients": [
          {
            "id": "[填入 UUID]",
            "flow": "xtls-rprx-vision"
          }
        ],
        "decryption": "none"
      },
      "streamSettings": {
        "network": "tcp",
        "security": "reality",
        "realitySettings": {
          "dest": "gateway.icloud.com:443",
          "serverNames": [
            "gateway.icloud.com",
            "icloud.com"
          ],
          "privateKey": "[填入 Private Key]",
          "shortIds": [
            "[填入 shortId]"
          ]
        }
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom"
    }
  ]
}
```

配置完成后重启服务：

```bash
systemctl restart xray
```

---

## Phase 3: 故障排查

### 现象

节点初期运行正常，随后 Windows v2rayN 与 iOS Shadowrocket 同时出现断连，客户端报错为 `-1`。

### 排查过程

1. 检查 Xray 服务状态

```bash
systemctl status xray
```

结果显示 `Active: active (running)`，CPU 与内存占用正常，因此基本排除 Xray 进程崩溃。

2. 校验服务端时间

```bash
date
```

Reality 对时间偏移较敏感。检查后发现服务端 UTC 时间与本地客户端时间误差小于 10 秒，排除时间漂移导致握手失败的可能。

3. 测试 443 端口连通性

在 Windows PowerShell 中执行：

```powershell
Test-NetConnection -ComputerName <IP> -Port 443
```

结果显示 `TcpTestSucceeded : True`，说明服务器 IP 可达，443 端口也没有被物理阻断。

4. 追踪服务端实时日志

```bash
journalctl -u xray -f
```

客户端发起连接时，服务端日志没有任何新增请求。结合端口可达但 Xray 无入站记录这一点，可以判断连接没有真正到达 Xray 进程。

### 原因判断

问题大概率出在 TCP 握手后的流量识别与截断。原先使用的伪装目标为 `www.microsoft.com`，相关 SNI 流量特征可能被识别，导致握手数据在到达服务器前已经被丢弃。

### 处理方式

修改 `/usr/local/etc/xray/config.json` 中的 `dest` 与 `serverNames`，将 SNI 目标切换为其他高权重、相对稳定的厂商网关，例如 Apple 的 `gateway.icloud.com`。随后同步更新客户端配置并重启服务端：

```bash
systemctl restart xray
```

调整后链路恢复正常。

---

## 小结

这次问题的关键线索是：客户端无法连接，但服务端进程正常、端口可达，并且 Xray 日志没有入站请求。排查时不要只看客户端报错，应同时结合服务状态、时间、端口连通性和服务端实时日志判断问题发生在哪一层。

后续如果再次出现类似情况，可以优先按以下顺序检查：

1. `systemctl status xray` 确认服务是否运行。
2. `date` 确认时间是否明显漂移。
3. `Test-NetConnection` 或同类工具确认端口是否可达。
4. `journalctl -u xray -f` 确认请求是否到达 Xray。
5. 若端口可达但日志无入站记录，再考虑 SNI、Reality 目标站点或链路侧拦截问题。
