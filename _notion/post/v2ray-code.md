## 0. 目标

本文档的目标是记录一次完整的 V2Ray (Xray 核心) 节点的搭建过程。

我们选择的方案是目前最为主流、稳定且不易被封锁的 **VMess + WebSocket (ws) + Nginx + TLS** 方案。

- **Xray (core):** 负责 V2Ray 协议的核心处理。
- **VMess:** V2Ray 的核心协议。
- **WebSocket (ws):** 一种传输协议，它将流量“打包”成网页流量。
- **Nginx:** 一个高性能的 Web 服务器，用作“反向代理”。它负责处理所有来自 443 端口的 HTTPS 流量，并将伪装成 WebSocket 的 V2Ray 流量转发给 Xray 核心。
- **TLS (SSL 证书):** 通过 Let's Encrypt 的 `certbot` 申请免费证书，让我们的流量看起来和访问任何 `https` 网站（如谷歌、银行）的流量一模一样，实现完美伪装。

## 1. 准备工作

在开始之前，你需要准备好三样东西：

1. **一台 VPS (服务器):** 本文使用 Vultr。我准备了两台，一台洛杉矶 (`us-los`)，一台东京 (`jp-tok`)。
2. **一个域名 (Domain):** 本文使用 `your-domain.com` 作为示例。
3. **DNS 管理权限:** 本文使用 Cloudflare 来管理 DNS 解析。

## 2. 【核心】服务器端配置

这个流程适用于任何一台**全新**的、基于 Debian/Ubuntu 的 VPS。

### 第 1 步：DNS 解析与服务器登录

这是**最关键**的第一步，也是**最容易出错**的一步。

1. **获取 IP:** 在 Vultr 创建 VPS 后，得到你的服务器 IP (例如: `1.2.3.4`)。
2. **登录服务器:** 在本地 PowerShell 中，使用 SSH 登录。
    
    ```powershell
    ssh root@1.2.3.4
    ```
    
3. **配置 DNS:** 登录 Cloudflare (或其他 DNS 服务商)，添加 `A` 记录。
    - **Type:** `A`
    - **Name:** `vps` (你的子域名, 完整就是 `vps.your-domain.com`)
    - **Content:** `1.2.3.4` (你的服务器 IP)
    - **Proxy status (代理状态):** **必须是 "DNS only" (灰色云朵)！**
    - **Proxy status (代理状态):** **必须是 "DNS only" (灰色云朵)！**
    - **Proxy status (代理状态):** **必须是 "DNS only" (灰色云朵)！**

> ⚠️ 为什么必须是灰色云朵？
> 
> 
> 如果开启了橙色云朵（Proxied），所有流量都会先绕道 Cloudflare 在美国的 CDN 节点，然后再转发给你的服务器。这会导致：
> 
> 1. **延迟暴增：** 即使是日本节点，Ping 也会变成 200ms+ (详见下文排错部分)。
> 2. **证书申请失败：** Certbot 可能会因为无法正确验证 IP 而失败。

### 第 2 步：安装核心软件 (Xray, Nginx, Certbot)

在新服务器上，依次运行以下命令。

```bash
# 1. 更新系统
apt update && apt upgrade -y

# 2. 安装 Xray 核心 (使用官方脚本)
bash <(curl -L https://raw.githubusercontent.com/XTLS/Xray-install/main/install-release.sh)

# 3. 安装 Nginx (Web服务器) 和 Certbot (证书工具)
apt install nginx python3-certbot-nginx nano -y
```

### 第 3 步：配置 Xray (config.json)

Xray 的配置文件决定了它如何接收和处理数据。

1. **生成 UUID (用户 ID):**
    
    ```bash
    cat /proc/sys/kernel/random/uuid
    (复制这串 xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx 格式的 ID)
    ```
    
2. **打开 Xray 配置文件：**
    
    ```bash
    nano /usr/local/etc/xray/config.json
    ```
    
3. **清空**里面的所有内容，**粘贴**以下配置：JSON
    - **`id` (UUID):** **[替换成你上一步生成的 UUID]**
    - **`port`:** 我们让 Xray 在本地 `10086` 端口监听，Nginx 会把 443 端口的流量转发到这里。
    - **`path`:** 我们设置路径为 `/ray`，这是 V2RayN 客户端必须匹配的“暗号”。
    
    ```bash
    {
      "inbounds": [
        {
          "port": 10086,
          "listen": "127.0.0.1",
          "protocol": "vmess",
          "settings": {
            "clients": [
              {
                "id": "a35cb270-bb0d-4d0e-ae9d-346a39e6fd6f", 
                "alterId": 0
              }
            ]
          },
          "streamSettings": {
            "network": "ws",
            "wsSettings": {
              "path": "/ray"
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
    
4. 按 `Ctrl + X` -> `Y` -> `Enter` 保存并退出。

### 第 4 步：配置 Nginx (反向代理)

Nginx 是我们的“门卫”，它负责处理所有 `https://vps.your-domain.com` 的流量。

1. **打开 Nginx 默认配置文件：**
    
    ```bash
    nano /etc/nginx/sites-available/default
    ```
    
2. **清空**所有内容，**粘贴**以下配置：Nginx
    - **注意：** 把下面所有的 `vps.your-domain.com` (共 4 处) **[替换成你自己的域名]**！
    - 第一个 `server` 块：将所有 http (80端口) 访问强制重定向到 https (443端口)。
    - 第二个 `server` 块：
        - `ssl_certificate`：定义 TSL 证书的位置 (Certbot 会自动生成)。
        - `location /`：一个伪装的网页根目录（可选）。
        - `location /ray`：**核心！** 将所有访问 `vps.your-domain.com/ray` 路径的流量，转发给 Xray 正在监听的 `127.0.0.1:10086`。
    
    ```bash
    server {
        listen 80;
        server_name vps.evanzhou.org;
        return 301 https://$host$request_uri;
    }
    
    server {
        listen 443 ssl http2;
        server_name vps.evanzhou.org;
    
        ssl_certificate /etc/letsencrypt/live/vps.evanzhou.org/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/vps.evanzhou.org/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
    
        location / {
            root /var/www/html;
            index index.html;
        }
    
        location /ray {
            if ($http_upgrade != "websocket") {
                return 404;
            }
            proxy_pass http://127.0.0.1:10086;
            proxy_redirect off;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
    ```
    
3. 按 `Ctrl + X` -> `Y` -> `Enter` 保存并退出。

### 第 5 步：启动服务 & 申请证书

万事俱备，只欠证书。

**依次复制并运行**以下所有命令：

```bash
# 1. 先启动 Xray 服务
systemctl restart xray

# 2. 开放防火墙 (允许 SSH, HTTP, HTTPS)
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# 3. 停止 Nginx (Certbot 申请证书需要占用 80 端口)
systemctl stop nginx

# 4. 运行 Certbot 申请证书
# [注意!] 替换成你自己的域名和邮箱
certbot certonly --standalone -d vps.your-domain.com --non-interactive --agree-tos --email your-email@example.com
certbot certonly --standalone -d vps.evanzhou.org --non-interactive --agree-tos --email evanzhou.bio@gmail.com

# 5. 启动 Nginx (现在 Nginx 找到了证书, 可以成功启动了)
systemctl start nginx

# 6. 设置 Nginx 和 Xray 开机自启
systemctl enable xray
systemctl enable nginx
```

如果第 4 步显示 `Congratulations!`，并且第 5 步没有报错，那么**服务器端已全部配置成功！**

## 3. 客户端配置 (V2RayN)

服务器搞定，客户端就非常简单了。

打开 V2RayN，添加一个新的 [VMess] 服务器，填入以下信息：

- **别名 (remarks):** `My-VPS` (或任何你喜欢的)
- **地址 (address):** `vps.your-domain.com` (你的域名)
- **端口 (port):** `443`
- **用户ID (id):** `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` (必须和 `config.json` 里一致)
- **额外ID (alterId):** `0`
- **传输协议 (network):** `ws`
- **路径 (path):** `/ray`
- **传输层安全 (TLS):** `tls`

保存，设为活动服务器，现在你应该可以自由访问了。

## 4. 踩坑实录 (The War Stories)

在配置过程中，我遇到了两个致命问题。

### 坑点一：亚洲节点延迟 200ms+？(Cloudflare 橙色云朵)

- **现象：** 我配置好了洛杉矶 (`us-los`) 和东京 (`jp-tok`) 两个节点。但在 V2RayN 中测试延迟，发现两个节点的延迟**一模一样**，都是 200+ms，这显然不正常（东京延迟应 < 100ms）。
- **排查：** 这是因为我在 Cloudflare 添加 A 记录时，**忘记将“代理状态”从 ☁️ 橙色 (Proxied) 改为 ☁️ 灰色 (DNS only)**。
- **原理：** 橙色云朵会使所有流量先经过 Cloudflare 在美国的 CDN 节点，导致所有非美国节点（如东京）都会先绕一大圈美国，延迟暴增。
- **解决：** **登录 Cloudflare，将所有节点的 A 记录全部改为“DNS only” (灰色云朵)。**

### 坑点二：新节点连接失败 (IP 被封)

- **现象：** 在修复了“灰色云朵”问题后，刷新本地 DNS 缓存 (`ipconfig /flushdns`)，洛杉矶节点延迟恢复正常 (160ms)，但东京节点直接**连接失败**，V2RayN 日志显示 `failed to dial` 或 `context canceled`。
- **排查：** 这 99% 意味着 VPS 提供商分配给我的这个东京服务器 IP (例如 `5.6.7.8`) **已经被 GFW 封锁了**。
- **原理：** 这是新手自建 VPS 最大的“抽奖”环节。你拿到的 IP 可能是上一个租用者用过导致被封的“不干净”IP。
- **解决：** **VPS 按小时计费，唯一的办法就是“换 IP”**：
    1. 登录 VPS 控制台，**销毁 (Destroy)** 那台被封的服务器。
    2. **立刻**在同一地点 (Tokyo) **重新创建**一台新服务器。
    3. VPS 提供商会分配一个**新 IP**。
    4. 回到 Cloudflare，更新 A 记录，指向这个**新 IP**。
    5. SSH 登录**新 IP**，**从头到尾**重新执行一遍本文的**第 2 步到第 5 步**。
    6. (你可能需要重复 2-3 次，直到抽到一个“干净”的 IP 为止)。

## 5. 最终思考：自建 VPS vs. 付费“机场”

在折腾了这么久之后，我发现对于我个人的使用需求而言，自建节点的体验似乎不如市面上买的 VPN 节点。

- **自建 VPS (Vultr, DigitalOcean 等):**
    - **优点：** 100% 隐私和控制权；独享资源，非高峰期速度快；成本极低（例如 Vultr 5 美元/月，1TB 流量）；可以利用免费额度。
    - **缺点：** **线路差！** Vultr 这种大厂走的是普通“163 骨干网”，一到晚高峰（国内 8-11 点）会拥堵，导致卡顿、断流。IP 也需要自己“抽奖”。
- **付费“机场” (VPN 服务商):**
    - **优点：** **线路好！** 它们花高价购买了 CN2 GIA、IPLC 国际专线等“VIP 高速公路”，晚高峰也极其流畅。有专人维护 IP 池，保证可用。
    - **缺点：** 价格贵；隐私未知（多人共享，日志可能被记录）。
