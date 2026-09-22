# 部署指南（GitHub Pages + www.benshots.art）

本项目的静态产物部署到 **GitHub Pages**，通过自定义域名 `www.benshots.art` 访问。
工作流文件：`.github/workflows/deploy.yml`（push 到 `main` 时自动构建并发布）。

---

## 一、一次性准备（需你手动操作）

### 1. 添加 SSH 公钥到 GitHub

本机已生成密钥：`~/.ssh/id_ed25519`（ed25519，无口令，已写入 `~/.ssh/config`）。

公钥内容：

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIM0GR6t4IBnNonGj9ohYl98YUrAgOFpS3nnHXRmsq1Gq ph1nal-web-pages-deploy
```

指纹：`SHA256:PQo3kDNDp9Jh+HsGa9rIQwjvKg1949ZAcs7QMMmAz4c`

两种加法，任选其一：

- **账号级（推荐，最省事）**：GitHub → 右上头像 → Settings → SSH and GPG keys → New SSH key，
  粘贴上面的公钥。
- **仓库级 Deploy key（权限最小，更安全）**：先建仓库，然后
  Settings → Deploy keys → Add deploy key，粘贴公钥并**勾选 Allow write access**（推送需要写权限）。

### 2. 创建 GitHub 仓库

在 GitHub 新建 **空仓库** `Ph1nal/WebPage`：
<https://github.com/new?name=WebPage>

- **不要**勾选 Add README / .gitignore / license（否则推送会冲突，需要先 pull）

### 3. 推送

凭据就绪后推送即可：

```bash
cd ~/web-pages
git push -u origin main
```

> 已启动后台守望进程，会自动检测「公钥已添加 + 仓库已创建」并完成推送。
> 进度查看：`cat /tmp/cline/push.log`

### 4. 启用 Pages 并绑定域名

推送成功后（或推送前）在仓库里设置：

1. **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**
   （必须选这个，否则 `deploy.yml` 不会运行）
2. **Settings → Pages → Custom domain** 填入 `www.benshots.art`，点 Save
3. 等 DNS 检查通过后，勾选 **Enforce HTTPS**

> ⚠️ 官方文档明确说明：用自定义 Actions 工作流发布时，**`CNAME` 文件会被忽略**，
> 也不需要在仓库里放 CNAME 文件。自定义域名的唯一生效位置是上面的 **Custom domain 设置项**。
> （仓库里保留了 `client/public/CNAME`，仅作声明用途 / 备将来改用「Deploy from a branch」时可用。）

---

## 二、DNS 配置（在 globaldomaingroup 面板操作）

域名当前解析商：`ns1.globaldomaingroup.com` / `ns2.globaldomaingroup.com`。

### 现状（需替换）

```
benshots.art        A      104.18.26.246      ← 旧 Manus 部署（Cloudflare for SaaS）
www.benshots.art    A      104.18.26.246      ← 且 301 跳转到裸域
```

### 目标记录（GitHub 官方值）

**根域 `benshots.art`：删掉旧的 A 记录，改为 GitHub 的 4 条 A + 4 条 AAAA**

| 类型 | 主机记录 | 记录值 |
|------|----------|--------|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |

**子域 `www`：删除旧的 A 记录，改为 CNAME**

| 类型 | 主机记录 | 记录值 |
|------|----------|--------|
| CNAME | `www` | `ph1nal.github.io` |

> 若面板支持 ALIAS / ANAME，根域也可以用一条 `@ → ph1nal.github.io` 代替 8 条 A/AAAA。

### 定向结论

以 **`www.benshots.art` 为主域名**（与 CNAME 设置一致）：
GitHub 会把裸域 `benshots.art` 自动 301 跳到 `www.benshots.art`。
这与当前的跳转方向相反（现在 www → 裸域），切换后访问习惯会变化，属预期行为。

### 验证命令

```bash
dig +short benshots.art A          # 期望 185.199.108~111.153
dig +short www.benshots.art CNAME  # 期望 ph1nal.github.io.
curl -sI https://www.benshots.art | head -3
```

DNS 生效最长约 24 小时；记录级 TTL 当前为 60s，实际通常几分钟。

---

## 三、日常发布

```bash
cd ~/web-pages
git add -A
git commit -m "更新说明"
git push          # 自动触发 Actions 构建 + 发布
```

查看构建：仓库 → **Actions** 标签页。

## 四、注意事项

- **切换后旧站即下线**：DNS 一改，`benshots.art` 不再指向原 Manus 部署（当前线上是旧版构建，
  标题为「张奔月 - 专业摄影师」，`/images/mascot.png` 为 404）。如需保留旧站，请先在 Manus 侧备份。
- **HTTPS**：GitHub Pages 会自动申请 Let's Encrypt 证书，签发前 `https` 会报错，属正常。
  现有域名带 `strict-transport-security ... preload`，因此必须等证书签发完成再访问，否则浏览器会拒绝降级。
- **不再经过 Cloudflare**：新解析直连 GitHub 的 anycast IP，无 Cloudflare 代理/缓存。
  若仍需 CDN，可把 NS 迁到 Cloudflare 后开小云朵（此时 `www` 可指向 `ph1nal.github.io` 并开启代理）。
- **依赖 Node 22**：工作流已固定 `node-version: 22`，pnpm 版本读自 `package.json` 的 `packageManager` 字段（`pnpm@10.4.1`）。
- **只构建前端**：工作流执行 `pnpm exec vite build`（不含 `server/index.ts` 的 Express 打包），
  因为 Pages 只提供静态托管；`dist/public` 即为发布目录。
