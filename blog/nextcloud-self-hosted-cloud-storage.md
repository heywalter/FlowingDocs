---
title: 用旧主机搭私有云：Nextcloud 部署、版本溯源与 RAG 知识库实践
authors: Walter
date: 2026-08-01
tags: [Nextcloud, 私有云, Docker, 自建服务器, RAG, 个人知识库, AI, 家庭实验室]
image: https://img.flowingdocs.com/images/nextcloud_self_hosted.png
description: 商业云盘放不了敏感内容、本地存储又有限，用旧主机跑 Nextcloud 是个出路：低成本扩容、VPN 远程连回家、文件改坏了拉时间轴找——后来顺手接进 RAG，工作文档变成可查询的 AI 知识库。
---

工作文件越积越多，本地存储不够用，商业云盘又放不了敏感内容。最后在旧主机上跑了 Nextcloud：想加多少盘就加多少，出门用 VPN 拨回来就连上，即使文件改坏想回溯也非常方便，后来顺手接进本地 AI RAG 系统，能做的事比最初想的多得多。

<!--truncate-->

## 为什么不用商业云盘了

工作文件有点特别：产品截图、演示视频、API 草稿、竞品分析……类型杂，数量大，不少还不适合放第三方服务器上。商业云盘用了几年，几个问题一直绕不开：

- 产品还没上线的功能截图、内部架构讨论、客户场景分析——这类内容放第三方总有顾虑，要做本地 AI 检索就更不可能允许文件上云
- 文件被改坏了，想找回三天前还正常的那个版本，免费档基本没有版本管理，付费档价格又叠着容量一起收；更麻烦的是找不到"哪次改动有问题"，没有时间轴，只能靠备份碰运气
- 在家的 Mac、公司的 Windows、出差的笔记本，同步经常冲突，有时候打开的是一个小时前的旧版本
- 文件越存越多，想找两年前整理过的某个竞品分析，只能靠模糊的文件名记忆去翻

自建之后这几个问题基本都消失了。Nextcloud 内置版本管理，每次改动都有时间戳记录，出了问题直接拉历史时间轴定位，改了多少次都能找回去。外网访问连 VPN 拨回家，不管在公司还是咖啡馆，连上就跟在内网一样用。旧主机这边想扩多少容量就加多少盘，不需要为了存储换设备。

## 我的服务器环境

家里有两台服务器，都跑在 Proxmox VE（开源虚拟化平台，可以在一台物理机上同时运行多个独立系统）上：

- 高性能主机（R7 5700x + 64GB RAM + 双显卡）：按需开启，跑 AI 训练和高负载任务
- 低功耗主机（I3-8100T + 24GB RAM）：24 小时常驻，承载日常服务

Nextcloud 需要持续在线，放低功耗主机上，兼顾稳定性和电费。

## 方案选型：为什么是 Nextcloud

在决定之前，几个主流方案都在低功耗服务器上跑了一遍：

| 方案 | 客户端支持 | 全文搜索 | 文件存储方式 | VFS 支持 |
|------|-----------|---------|------------|---------|
| **Nextcloud** | 桌面/移动/Web | 支持（插件） | 原始格式 | ✅ |
| **ownCloud** | 桌面/移动/Web | 支持（需配置） | 原始格式 | ✅ |
| **Seafile** | 桌面/移动/Web | 支持（内置） | 块存储（加密） | ❌ |
| **Cloudreve** | 移动/Web | 不支持 | 哈希目录 | ❌ |
| **Pydio Cells** | 全平台 | 支持（内置） | 原始格式 | ❌ |

Seafile 性能最好，但它用块存储，数据库一旦出问题，文件基本废掉。对我来说这个风险不能接受——文件以原始格式存着，就算 Nextcloud 挂了，直接从硬盘就能拿走，没有任何依赖。

VFS 虚拟文件系统也是刚需。笔记本本地只存索引，用到哪个文件才下载，4TB 的内容在 256GB SSD 上完全可以用。

另一个没写进表里的理由是 WebDAV 支持。WebDAV 是一种让应用程序像操作本地文件夹一样访问远程文件的协议，Nextcloud 原生支持，RAG 框架可以直接挂进来，不需要额外的同步中间件，后面会细说。

选之前也查了一圈社区活跃度。Nextcloud 从 2016 年从 ownCloud 分叉出来一直在跑，AIO 版本持续更新，碰到问题在 GitHub issues 或 r/selfhosted 基本都有人处理过。Cloudreve 和 Pydio Cells 这块就差很多，遇到边界问题基本靠自己。

## 部署方案：Docker + Nextcloud AIO + Caddy

选的是 Nextcloud AIO（All-in-One）版本，数据库、Redis、OnlyOffice、全文搜索引擎这些依赖全打包进来了，不用自己一个个拼。在 Proxmox 上开了一个 Debian VM 专门跑这套。

### 步骤一：准备存储目录

OMV（OpenMediaVault，一款 NAS 磁盘管理软件）用 UUID 标识挂载点，先确认数据盘路径：

```bash
df -h | grep dev
```

我的 4TB 数据盘挂在 `/srv/dev-disk-by-uuid-d086850f-...`，在上面创建 Nextcloud 数据目录，用户 ID 33 是容器内的 `www-data`：

```bash
NCDATA=/srv/dev-disk-by-uuid-d086850f-1fa5-4046-8a3b-a9621d7cfe06/nextcloud-data/ncdata

sudo mkdir -p $NCDATA
sudo chown -R 33:33 $NCDATA
sudo chmod -R 770 $NCDATA
```

### 步骤二：Docker Compose 配置

在官方配置基础上加了 Caddy 做反向代理（Caddy 会自动签发和续期 HTTPS 证书，省去手动管理证书的麻烦），处理内网域名的加密访问：

```yaml
version: "3.8"

services:
  nextcloud-aio-mastercontainer:
    image: ghcr.io/nextcloud-releases/all-in-one:latest
    init: true
    restart: always
    container_name: nextcloud-aio-mastercontainer
    volumes:
      - nextcloud_aio_mastercontainer:/mnt/docker-aio-config
      - /var/run/docker.sock:/var/run/docker.sock:ro
    ports:
      - 8080:8080
    environment:
      - APACHE_PORT=11000
      - APACHE_IP_BINDING=127.0.0.1      # 只允许通过 Caddy 访问
      - SKIP_DOMAIN_VALIDATION=true       # 内网部署跳过域名验证
      - NEXTCLOUD_DATADIR=/srv/dev-disk-by-uuid-d086850f-1fa5-4046-8a3b-a9621d7cfe06/nextcloud-data/ncdata
    depends_on:
      - caddy

  caddy:
    image: caddy:alpine
    restart: always
    container_name: caddy
    volumes:
      - caddy_certs:/certs
      - caddy_config:/config
      - caddy_data:/data
      - caddy_sites:/srv
    network_mode: "host"
    configs:
      - source: Caddyfile
        target: /etc/caddy/Caddyfile

configs:
  Caddyfile:
    content: |
      https://data.local:443 {
        tls internal
        reverse_proxy localhost:11000
      }

volumes:
  nextcloud_aio_mastercontainer:
    name: nextcloud_aio_mastercontainer
  caddy_certs:
    name: caddy_certs
  caddy_config:
    name: caddy_config
  caddy_data:
    name: caddy_data
  caddy_sites:
    name: caddy_sites
```

`tls internal` 让 Caddy 自动签发内网证书，纯内网访问不需要公网域名。

### 步骤三：启动并初始化

```bash
docker compose up -d
```

首次访问 `https://服务器IP:8080`，浏览器会提示 AIO 的自签名证书，确认继续访问后按向导创建管理员账户。AIO 版本首次启动要拉取并初始化多个子容器，等 10-15 分钟。

### 步骤四：配置客户端访问

修改本地 hosts 文件：

```
# macOS/Linux: /etc/hosts
# Windows: C:\Windows\System32\drivers\etc\hosts
192.168.1.100  data.local
```

首次访问 `https://data.local` 浏览器会提示证书不信任。不要导出浏览器展示的站点证书；从 Caddy 容器导出根证书，并在每台客户端系统级安装为受信任根证书：

```bash
docker cp caddy:/data/caddy/pki/authorities/local/root.crt ./caddy-local-root.crt
```

将 `caddy-local-root.crt` 导入客户端的受信任根证书存储后，浏览器和桌面客户端就能正常验证 `data.local` 的证书。

:::tip 外网访问
路由器端口转发 + DDNS 是一种做法，也可以用 VPN 工具连回家再访问——不需要把端口直接暴露在公网上，安全一些。
:::

### 步骤五：备份配置

AIO 内置了 BorgBackup（增量去重备份工具，只备份有变化的部分，节省空间），在管理界面（`https://服务器IP:8080`）的 Backup 标签启用自动备份，设置触发时间。注意界面使用 UTC：例如本地时区为 UTC+8，想凌晨 4 点备份，填 `20:00`；其他时区按与 UTC 的时差换算。

如果有另一台 NAS，可以用 CIFS（网络文件共享协议，Windows 和群晖、威联通都支持）挂载过去做异机备份：

```bash
sudo apt install -y cifs-utils

sudo mkdir -p /etc/cifs-creds
sudo bash -c 'cat > /etc/cifs-creds/nc-backup.creds <<EOF
username=你的用户名
password=你的密码
EOF'
sudo chmod 600 /etc/cifs-creds/nc-backup.creds

sudo mkdir -p /mnt/backup
sudo mount -t cifs //192.168.1.37/Backup /mnt/backup \
  -o credentials=/etc/cifs-creds/nc-backup.creds,iocharset=utf8,vers=3.1.1,_netdev
```

然后在 AIO 备份界面填 `/mnt/backup/nextcloud-aio`，开启自动备份。

开机自动挂载，追加到 `/etc/fstab`：

```
//192.168.1.37/Backup /mnt/backup cifs credentials=/etc/cifs-creds/nc-backup.creds,iocharset=utf8,vers=3.1.1,uid=0,gid=0,file_mode=0644,dir_mode=0755,_netdev 0 0
```

五步跑完，浏览器访问 `https://data.local` 就是完整的 Nextcloud 界面。桌面客户端装好开 VFS，文件管理这部分就到位了。

## 把 Nextcloud 接进 RAG 系统

Nextcloud AIO 内置了全文搜索引擎，OCR 插件可以对扫描版 PDF 和图片提取文字、自动进索引——这部分开箱就有，不需要额外折腾。

在这基础上，我把自己搭的本地 RAG 系统接了进来——RAG（检索增强生成）的思路是先从文档库里找到相关内容，再交给语言模型来作答，而不是让模型凭空猜。具体实现在[文档审校那篇](./building-a-local-ai-content-review-system.md)里有介绍，这里只说 Nextcloud 这块：通过 WebDAV 挂进来，多的那一层是语义搜索。

为什么还需要语义搜索？因为全文搜索的前提是你知道文档里用了什么词。但工作中更多时候记得的是意思，不是词：某次产品评审讨论过某个方案的取舍，当时用的是"继承"还是"传递"还是别的表述，根本记不住；某篇竞品分析里有一段和现在要写的内容很像，连文件名都想不起来。这类场景，关键词搜索基本没用。

RAG 的向量库挂的是 Nextcloud 里这几年积累的所有工作文件，语言模型用 Ollama（在本机运行大模型的工具，不需要调用云端 API）在本地跑。实际感觉有价值的主要是两个场景：

一是写新文档前查有没有相关的已有内容。同一个功能在不同文档里可能用了完全不同的措辞，语义搜索比关键词更能找到真正相关的东西，省掉不少重复调研。

二是保持术语一致性。写到某个概念，先查"之前在哪里描述过这个，用的是什么表达"，从自己的文档库里直接拉出来对照，比翻文件夹快，也比靠记忆可靠。

本地跑这套系统带来的实际好处不只是"数据安全"——更关键的是，能放进知识库的内容范围变宽了。产品未发布功能的原型讨论、内部架构评审、客户场景分析……这些内容放云端知识库工具（Claude、Notion AI 之类）根本不现实，本地部署完全没顾虑。知识库的覆盖面越完整，查出来的结果才越有实际价值。

当然也有局限：文档质量直接影响 RAG 效果，组织混乱、术语不统一的文档进库之后查出来也乱。文件量不够多的时候，语义搜索和全文搜索的差距也不明显，大概积累到两三百份以上才觉得这层真的有意义。

## 用了几个月的感受

部署这件事本身，确实要花几个小时，证书信任和客户端配置那两步遇到问题不容易一眼看出来，得挨个试。加上 Ollama 和 RAG 服务，服务器建议 16GB 内存以上，我低功耗主机的 24GB 跑起来还算宽裕。外网访问要自己处理，这个复杂度绕不开。

版本控制这件事装好之后就不用想了，改错了随时找回来，文件也是原始格式存着，就算哪天 Nextcloud 不想用了，数据直接拿走没有任何依赖。

VFS 比预期好用。笔记本 256GB，接了 4TB 的云盘还跑得动，出差要用某个项目的文件就提前标记一下本地缓存，其他的按需下载。

RAG 这块是真的有惊喜。从刚开始有点半信半疑，到现在写新文档前已经习惯先问一下"这个话题之前整理过什么"——能找到的次数比想象的多，省了不少重新调研的时间。

中间踩过几个坑，记一下解法：

:::tip 常见问题
- **客户端证书报错**：从浏览器导出 Caddy 的内网证书（`.crt`），系统级安装为受信任根证书
- **Office 文件预览失败**：AIO 管理界面确认 OnlyOffice 容器状态，异常就重启
- **WebDAV 连接失败**：路径末尾要有 `/`，用户名密码含特殊字符要 URL 编码
:::

## 总结

自建值不值，取决于你想要什么。只是需要一个地方存文件，商业云盘更省心；在意数据自主、版本管理、或者想把文件接进本地 AI，自建才有意义。

对我来说，真正让这件事值了的，是搭起来之后发现原来积累了这么多东西——文档草稿、会议记录、截图、分析报告——放进知识库之后，它们开始可以被查询、被复用，而不只是占硬盘空间。

---

## 下一步：把存储接进完整工作流

存储这块稳下来之后，开始想能不能把它串进更完整的工作流里。

Nextcloud 解决的是文件的问题：存哪里、版本怎么管、出门怎么访问。但还有一块没接进来——日常的笔记和思考。这部分零散，不适合直接扔进 Nextcloud 里，但真要让 AI 检索有价值，文件和笔记不能分开。

接下来想写的是在 Nextcloud 基础上接一套自建笔记系统，把文件和笔记都喂进 RAG，让 AI 统一查——目标就是"这件事之前想清楚过"这种感觉能找得到，不只是靠记忆碰运气。

这套流程还在跑通，等稳定了单独写一篇。

---

## 延伸阅读

- [从零构建本地 AI 内容审校系统：小模型推理到工程化落地](./building-a-local-ai-content-review-system.md)：本文提到的本地 OCR 和 AI 处理系统的具体实现，规则引擎、小模型、保护机制的设计思路。
- [别让 AI 写的文档误导用户：从单次 Prompt 到高可信文档工程化实践](./ai-docs-engineering-practice.md)：AI 生成文档的质量控制，以及让文档更好地被 AI 系统理解的 GEO 实践。
- [Nextcloud AIO 部署指南](https://github.com/nextcloud/all-in-one)：官方 Docker 部署文档，所有环境变量说明在这里。
- [AnythingLLM 文档](https://docs.anythingllm.com/)：WebDAV 数据源的配置在 Data Connectors 章节。
- [Reddit r/selfhosted](https://www.reddit.com/r/selfhosted/)：自建服务社区，遇到问题搜一下基本都有人踩过。
