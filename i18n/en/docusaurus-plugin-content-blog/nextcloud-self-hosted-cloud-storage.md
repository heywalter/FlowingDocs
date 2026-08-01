---
title: "Running Nextcloud on a Spare Machine: Self-Hosted Storage, File Versioning, and a Local RAG Knowledge Base"
authors: Walter
date: 2026-08-01
tags: [Nextcloud, Self-Hosted, Docker, Home Server, RAG, Knowledge Base, AI, Home Lab]
image: https://img.flowingdocs.com/images/nextcloud_self_hosted.png
description: "Commercial cloud storage isn't always right for sensitive work files — and local storage has limits. Running Nextcloud on a spare machine turned out to cover a lot at once: cheap storage expansion, VPN access from anywhere, file version history on a timeline, and a local RAG knowledge base that's actually useful."
---

Work files keep piling up, local storage fills fast, and commercial cloud services aren't always an option for sensitive content. I ended up deploying Nextcloud on a spare machine — add disks whenever storage runs low, connect over VPN from anywhere, roll back any file to an earlier version, and later hooked it into a local RAG system. It does a lot more than I expected.

<!--truncate-->

## Why I Stopped Using Commercial Cloud Storage

My work files are a bit of an odd mix: product screenshots, demo videos, API drafts, competitive analysis — varied types, large volume, and a fair amount of it too sensitive to put on a third-party server. After years of using commercial cloud storage, a few problems kept coming up:

- Pre-release feature screenshots, internal architecture discussions, client scenario analysis — anything I'm not comfortable uploading to a third party, and completely off the table if I want to feed it into a local AI system.
- When a file gets corrupted, free tiers rarely include version history. Paid plans bundle it with storage, so you pay for both even when you only need one. Worse, there's no timeline to pinpoint *which* change broke things — just backups, and guesswork about which one to restore.
- Sync conflicts across machines were constant. Open a file and sometimes you're editing a version from an hour ago.
- The more files accumulate, the harder it is to find anything. Searching by fuzzy filename memory isn't a strategy.

Running my own Nextcloud fixed most of this. Built-in version management with timestamps means I can see exactly when a file changed and revert to any point. VPN handles remote access — connect from the office or a coffee shop and it feels like being on the home network. When storage gets tight, I add a drive to the server rather than buying a new machine.

## My Home Server Setup

Two servers at home, both running on Proxmox VE (an open-source hypervisor that lets you run multiple isolated virtual machines on a single physical machine):

- **High-performance machine** (Ryzen 7 5700X + 64 GB RAM + two GPUs): spins up on demand for AI training and heavy workloads
- **Low-power machine** (i3-8100T + 24 GB RAM): runs 24/7, handles everyday services

Nextcloud needs to be always-on, so it lives on the low-power machine — a reasonable balance of reliability and electricity bill.

## Picking a Solution: Why Nextcloud

Before committing, I ran a few of the main self-hosted options on the low-power server:

| Solution | Client Support | Full-Text Search | File Storage | VFS |
|---|---|---|---|---|
| **Nextcloud** | Desktop / Mobile / Web | Yes (plugin) | Native format | ✅ |
| **ownCloud** | Desktop / Mobile / Web | Yes (needs config) | Native format | ✅ |
| **Seafile** | Desktop / Mobile / Web | Yes (built-in) | Block storage (encrypted) | ❌ |
| **Cloudreve** | Mobile / Web | No | Hashed directory | ❌ |
| **Pydio Cells** | All platforms | Yes (built-in) | Native format | ❌ |

Seafile has the best raw performance, but it uses block-based storage — if the database gets corrupted, the files go with it. That's not a risk I'm willing to take. Nextcloud stores files in their native format on disk. If Nextcloud itself goes down, I can pull files directly from the drive with zero dependencies.

Virtual File System (VFS) was a hard requirement. The desktop client syncs only the index locally and downloads files on demand. That makes a 4 TB library usable from a 256 GB laptop SSD.

One reason that doesn't show up in the table: WebDAV support. WebDAV is a protocol that lets applications read and write remote files the same way they access local ones. Nextcloud is a full WebDAV server, so RAG frameworks can mount it directly without a sync layer in between — more on that later.

I also checked community health before committing. Nextcloud forked from ownCloud in 2016 and has been actively maintained since. AIO gets regular updates, and when things go wrong, GitHub issues and r/selfhosted almost always have relevant threads. Cloudreve and Pydio Cells are thinner on that front — edge cases tend to stay edge cases.

## Deployment: Docker + Nextcloud AIO + Caddy

I went with Nextcloud AIO (All-in-One) — the database, Redis, OnlyOffice, and full-text search engine are all bundled in. No manual assembly. It runs in a dedicated Debian VM on Proxmox VE.

### Step 1: Set up the data directory

OMV (OpenMediaVault, a disk management OS commonly used with NAS setups) identifies mount points by UUID. Confirm the data disk path first:

```bash
df -h | grep dev
```

My 4 TB data disk mounts at `/srv/dev-disk-by-uuid-d086850f-...`. Create the Nextcloud data directory there. User ID 33 is `www-data` inside the container:

```bash
NCDATA=/srv/dev-disk-by-uuid-d086850f-1fa5-4046-8a3b-a9621d7cfe06/nextcloud-data/ncdata

sudo mkdir -p $NCDATA
sudo chown -R 33:33 $NCDATA
sudo chmod -R 770 $NCDATA
```

### Step 2: Docker Compose configuration

Starting from the official config, I added Caddy — a reverse proxy that issues and renews HTTPS certificates automatically, so you don't have to manage them manually — to handle encrypted access over a local domain:

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
      - APACHE_IP_BINDING=127.0.0.1      # Only allow access through Caddy
      - SKIP_DOMAIN_VALIDATION=true       # Skip domain validation for LAN deployment
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

`tls internal` tells Caddy to issue a self-signed certificate for the LAN. No public domain needed.

### Step 3: Start and initialize

```bash
docker compose up -d
```

Navigate to `https://<server-ip>:8080`. Your browser will warn about AIO's self-signed certificate; continue past the warning, then follow the setup wizard to create an admin account. AIO pulls and initializes several sub-containers on first run; allow 10–15 minutes.

### Step 4: Configure client access

Add the local domain to your hosts file:

```
# macOS / Linux: /etc/hosts
# Windows: C:\Windows\System32\drivers\etc\hosts
192.168.1.100  data.local
```

The first time you visit `https://data.local`, the browser will flag the certificate as untrusted. Do not export the site certificate shown by the browser. Instead, export Caddy's root CA from the container and install it as a trusted root on every client:

```bash
docker cp caddy:/data/caddy/pki/authorities/local/root.crt ./caddy-local-root.crt
```

Import `caddy-local-root.crt` into each client's trusted root certificate store. Browsers and desktop clients can then validate the certificate for `data.local`.

:::tip Remote access
Port forwarding with DDNS is one approach. I use VPN instead — connect back home first, then access Nextcloud as if I'm on the local network. More secure than exposing a port directly.
:::

### Step 5: Configure backups

AIO ships with BorgBackup (a deduplicating incremental backup tool — only changed data is stored, so backups stay compact). Enable automatic backups from the **Backup** tab in the admin panel (`https://<server-ip>:8080`) and set a schedule. The schedule uses UTC: to back up at 4 AM in a UTC+8 time zone, enter `20:00`; convert from UTC for any other time zone.

If you have a second NAS for off-site copies, mount it over CIFS (a network file-sharing protocol — compatible with Synology, QNAP, and Windows file shares):

```bash
sudo apt install -y cifs-utils

sudo mkdir -p /etc/cifs-creds
sudo bash -c 'cat > /etc/cifs-creds/nc-backup.creds <<EOF
username=your_username
password=your_password
EOF'
sudo chmod 600 /etc/cifs-creds/nc-backup.creds

sudo mkdir -p /mnt/backup
sudo mount -t cifs //192.168.1.37/Backup /mnt/backup \
  -o credentials=/etc/cifs-creds/nc-backup.creds,iocharset=utf8,vers=3.1.1,_netdev
```

Point the AIO backup path to `/mnt/backup/nextcloud-aio` and enable automatic backups.

To auto-mount on boot, add this to `/etc/fstab`:

```
//192.168.1.37/Backup /mnt/backup cifs credentials=/etc/cifs-creds/nc-backup.creds,iocharset=utf8,vers=3.1.1,uid=0,gid=0,file_mode=0644,dir_mode=0755,_netdev 0 0
```

Once all five steps are done, `https://data.local` loads the full Nextcloud interface. Enable VFS in the desktop client, and the storage side is set.

## Connecting Nextcloud to a Local RAG System

Nextcloud AIO includes a full-text search engine out of the box. The built-in OCR plugin can extract text from scanned PDFs and images and index them automatically — no extra setup.

On top of that, I connected my local RAG system to Nextcloud via WebDAV. RAG (Retrieval-Augmented Generation) works by searching your document library first, then passing the relevant results to a language model to answer — rather than asking the model to guess from nothing. The details are in [Building a Local AI Content Review System](./building-a-local-ai-content-review-system.md); the Nextcloud-specific part is simple: mount it over WebDAV, and the extra capability you get is semantic search.

Why semantic search on top of full-text? Full-text search assumes you know the exact words the document uses. In practice, I remember the idea, not the wording. Whether a product review discussion used "inherit" or "delegate" or something else entirely — I have no idea. A competitive analysis that's directly relevant to something I'm writing now — I can't recall the filename. Keyword search doesn't help in either case.

The vector index covers everything accumulated in Nextcloud over the years. Inference runs locally with Ollama (a tool for running large language models on your own hardware, no cloud API required). Two use cases have actually proved useful:

**Before writing something new**, I check whether relevant material already exists. The same feature might be described differently across multiple documents; semantic search finds the truly relevant ones better than keywords, which saves a round of duplicate research.

**Staying consistent with terminology.** When writing about a concept, I check: "where did I describe this before, and what phrasing did I use?" Pulling from my own document library is faster than digging through folders and more reliable than memory.

Running this locally has a practical benefit beyond data privacy: the range of content I can include in the knowledge base is much wider. Pre-release feature prototypes, internal architecture reviews, client analysis — none of that could go into a cloud-based knowledge tool. Locally, there's no concern. A more complete knowledge base produces more useful results.

There are real limits: document quality directly affects RAG quality. A disorganized corpus with inconsistent terminology produces disorganized results. Below a few hundred documents, the gap between semantic and full-text search is subtle enough that it's not obviously worth the overhead. The value becomes clearer somewhere past 200–300 files.

## A Few Months In

Deployment took a few hours. The certificate trust and client configuration steps are where problems tend to hide — nothing surfaces obviously, so expect to work through them methodically. Running Nextcloud alongside Ollama and the RAG service needs at least 16 GB of RAM; my 24 GB low-power machine handles it without trouble. Remote access setup is a real complexity cost — there's no way around it.

Once it's running, version control disappears into the background. A file gets corrupted — roll it back. Everything's stored in native format, so if you ever want to stop using Nextcloud, the data leaves with you, no migration required.

VFS worked better than I expected. A 256 GB laptop stays manageable against a 4 TB library: pin the files you need for an upcoming trip, let everything else download on demand.

RAG was a genuine surprise. I started skeptical, and now checking "what did I write about this before?" is a habit before starting any new document. It comes up useful more often than I expected — and saves real research time when it does.

A few issues I hit along the way:

:::tip Common issues
- **Certificate error on client**: Export Caddy's internal certificate from the browser (`.crt`) and install it as a trusted root certificate at the system level.
- **Office file preview fails**: Check the OnlyOffice container status in the AIO admin panel. Restart it if it looks stuck.
- **WebDAV connection fails**: Make sure the path ends with `/`, and URL-encode any special characters in your username or password.
:::

## Summary

Whether self-hosting is worth it depends on what you want from it. If you just need somewhere to store files, commercial cloud storage is the simpler choice. If you care about owning your data, want real version history, or want to connect your files to a local AI system, self-hosting makes sense.

What made it feel worth the effort, for me, was discovering how much had accumulated — drafts, meeting notes, screenshots, analysis reports. Once it was in the knowledge base, it became searchable and reusable rather than just taking up disk space.

---

## What's Next: Connecting Storage to a Broader Workflow

Once the storage layer was stable, I started thinking about whether it could plug into something larger.

Nextcloud covers the file side of things: where they live, how versions are managed, how to get to them remotely. What's still missing is daily notes and working thoughts — too scattered to live neatly in Nextcloud, but inseparable from the file library if the goal is AI search that's actually useful.

The next piece I want to write about is connecting a self-hosted notes system to Nextcloud and feeding both into a shared RAG index — so "I worked through this before" is something I can actually retrieve, not just vaguely remember.

Still getting that workflow stable. Will write it up once it is.

---

## Further Reading

- [Building a Local AI Content Review System from Scratch](./building-a-local-ai-content-review-system.md): The implementation details behind the local OCR and AI processing system referenced in this post.
- [Don't Let AI-Written Docs Mislead Users: From One-Off Prompts to Reliable Documentation Engineering](./ai-docs-engineering-practice.md): Quality control for AI-generated content, and GEO practices for making documentation more legible to AI systems.
- [Nextcloud AIO Deployment Guide](https://github.com/nextcloud/all-in-one): Official Docker deployment docs with full environment variable reference.
- [AnythingLLM Documentation](https://docs.anythingllm.com/): WebDAV data source configuration is under Data Connectors.
- [Reddit r/selfhosted](https://www.reddit.com/r/selfhosted/): The self-hosting community. Most problems have already been solved in a thread somewhere.
