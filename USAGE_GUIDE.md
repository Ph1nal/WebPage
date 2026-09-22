# 摄影师作品集网站 - 使用指南

## 项目概述

这是一个专业的摄影师个人作品集网站，采用**Chiikawa风格**的柔和设计美学。网站具有以下特点：

- **极简柔和设计**：奶油白背景、柔和粉、婴儿蓝、淡黄等温暖色调
- **玻璃拟态效果**：导航栏采用毛玻璃设计，增加现代感
- **流畅动画**：所有交互都通过温和的过渡动画实现
- **响应式设计**：完美适配手机、平板和桌面设备
- **构图互动背景**：从 `construct.pdf` 提取的心形边框与摄影师插画作为背景装饰，支持鼠标视差和“互动构图”聚焦按钮
- **易于维护**：所有内容通过JSON配置文件管理，无需修改代码

## 快速开始

### 1. 本地运行项目

```bash
# 进入项目目录
cd photographer_portfolio

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

访问 `http://localhost:3000` 查看网站。

### 构图卡片主题说明

网页已重新围绕 `construct.pdf` 的视觉语言生成。PDF 中的薄荷绿底、奶油云朵、橄榄爱心边框、兔子摄影师和 BigBen 构图卡片被整合为完整的网页主题，并通过 WebDev 存储代理加载视觉资产：

- `client/src/components/PosterHero.tsx`：控制主题首屏、独立兔子与云朵装饰、构图卡片倾斜交互和“点击聚焦构图”状态。
- `client/src/theme-overrides.css`：控制薄荷绿主题、云朵装饰、心形边框、作品卡片和移动端布局。
- `vite.config.ts`：提供 `/manus-storage/*` 媒体存储代理，不能删除，否则背景资产在预览或部署环境中无法加载。

用户可在首屏构图卡片上移动鼠标查看轻微 3D 倾斜，点击卡片即可聚焦，再次点击恢复默认状态。系统检测到用户偏好减少动画时会自动关闭非必要过渡。

### 2. 构建生产版本

```bash
pnpm build
```

### 3. 预览生产版本

```bash
pnpm preview
```

## 更新内容

### 更新摄影师信息

编辑 `client/src/lib/portfolioData.json` 文件中的 `photographer` 对象：

```json
{
  "photographer": {
    "name": "您的名字",
    "title": "您的职位",
    "bio": "您的个人简介",
    "email": "your@email.com",
    "phone": "+1 (555) 123-4567",
    "location": "城市, 国家",
    "socialLinks": [
      {
        "platform": "Instagram",
        "url": "https://instagram.com/yourprofile",
        "icon": "instagram"
      },
      {
        "platform": "Behance",
        "url": "https://behance.net/yourprofile",
        "icon": "behance"
      }
    ],
    "cvUrl": "https://your-cv-url.com/cv.pdf"
  }
}
```

### 更新Hero轮播图片

编辑 `client/src/lib/portfolioData.json` 文件中的 `heroSlider` 数组。每个轮播项包含：

- `id`: 唯一标识符
- `title`: 标题
- `description`: 描述
- `imageUrl`: 图片URL（必须是CDN链接或完整URL）

```json
{
  "heroSlider": [
    {
      "id": 1,
      "title": "您的标题",
      "description": "您的描述",
      "imageUrl": "https://your-cdn.com/image.jpg"
    }
  ]
}
```

### 添加作品集图片

编辑 `client/src/lib/portfolioData.json` 文件中的 `portfolio` 数组。每个作品包含：

- `id`: 唯一标识符（必须唯一）
- `title`: 作品标题
- `category`: 分类（如 "Landscape", "Portrait", "Architecture" 等）
- `imageUrl`: 图片URL
- `aspectRatio`: 宽高比（"16:9", "3:4", "1:1" 等）
- `description`: 作品描述

```json
{
  "portfolio": [
    {
      "id": 1,
      "title": "作品标题",
      "category": "Landscape",
      "imageUrl": "https://your-cdn.com/image.jpg",
      "aspectRatio": "16:9",
      "description": "作品描述"
    }
  ]
}
```

### 添加新的分类

在 `client/src/lib/portfolioData.json` 文件中的 `categories` 数组中添加新分类：

```json
{
  "categories": ["All", "Landscape", "Portrait", "Architecture", "Nature", "Street", "您的新分类"]
}
```

## 设计系统

### 色彩调色板（Chiikawa风格）

| 用途 | 颜色 | 十六进制值 |
|------|------|----------|
| 背景 | 奶油白 | #FFFFFF |
| 文字 | 深灰 | #4A4A4A |
| 强调色1 | 柔和粉 | #FFD1DC |
| 强调色2 | 婴儿蓝 | #B1D4E5 |
| 强调色3 | 淡黄 | #FAF0BE |

### 排版系统

- **显示字体**：Playfair Display（优雅、高端）
- **正文字体**：Lato（可读性强、温和）

### 圆角设计

所有元素都采用大圆角（border-radius: 1.5rem）以营造柔和感。

### 动画时间

所有过渡动画时间为 300-500ms，使用 `cubic-bezier(0.4, 0, 0.2, 1)` 缓动函数。

## 文件结构

```
photographer_portfolio/
├── client/
│   ├── public/
│   │   ├── favicon.ico
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.tsx        # 导航栏
│   │   │   ├── HeroSlider.tsx        # Hero轮播
│   │   │   ├── PortfolioGallery.tsx  # 作品集画廊
│   │   │   ├── Lightbox.tsx          # 灯箱查看器
│   │   │   ├── About.tsx             # 关于部分
│   │   │   ├── Contact.tsx           # 联系表单
│   │   │   └── Footer.tsx            # 页脚
│   │   ├── pages/
│   │   │   └── Home.tsx              # 主页面
│   │   ├── lib/
│   │   │   └── portfolioData.json    # 内容配置文件（主要编辑文件）
│   │   ├── index.css                 # 全局样式和设计令牌
│   │   └── main.tsx
│   └── index.html
├── package.json
└── USAGE_GUIDE.md                    # 本文件
```

## 关键功能说明

### 1. Navigation（导航栏）

- 采用玻璃拟态设计（glassmorphism）
- 固定在顶部，始终可见
- 响应式设计：桌面版显示完整导航，移动版显示汉堡菜单

### 2. Hero Slider（英雄轮播）

- 全屏轮播，展示摄影师的代表作
- 自动每5秒切换一次
- 支持手动导航（前后按钮和指示点）
- 键盘支持（左右箭头）

### 3. Portfolio Gallery（作品集画廊）

- Masonry网格布局，自动适应不同宽高比
- 分类过滤功能
- 图片懒加载优化性能
- 点击图片打开Lightbox查看高清版本

### 4. Lightbox（灯箱）

- 高分辨率图片查看
- 流畅的前后导航
- 键盘控制（←→箭头键导航，ESC关闭）
- 显示图片计数器

### 5. About（关于部分）

- 圆形头像展示
- 摄影师简介
- 联系方式和CV下载链接

### 6. Contact（联系表单）

- 最小化联系表单
- 社交媒体链接
- 联系信息展示

## 性能优化

- **图片懒加载**：使用原生 `loading="lazy"` 属性
- **代码分割**：React组件自动代码分割
- **CSS优化**：Tailwind CSS生成最小化CSS
- **平滑滚动**：全站启用平滑滚动行为

## 响应式断点

| 设备 | 宽度 | 特点 |
|------|------|------|
| 手机 | < 640px | 单列布局，汉堡菜单 |
| 平板 | 640px - 1024px | 两列布局 |
| 桌面 | > 1024px | 三列Masonry布局 |

## 常见问题

### Q: 如何添加新的社交媒体链接？

A: 编辑 `portfolioData.json` 中的 `photographer.socialLinks` 数组，添加新对象：

```json
{
  "platform": "Twitter",
  "url": "https://twitter.com/yourprofile",
  "icon": "twitter"
}
```

然后在 `Contact.tsx` 中添加对应的图标渲染逻辑。

### Q: 如何更改网站的颜色？

A: 编辑 `client/src/index.css` 文件中的 `:root` 部分的CSS变量。所有颜色都使用OKLCH格式定义。

### Q: 图片不显示怎么办？

A: 确保 `portfolioData.json` 中的 `imageUrl` 是完整的CDN URL或外部链接，不要使用本地路径。

### Q: 如何部署网站？

A: 项目已在Manus平台上托管。使用Management UI中的Publish按钮发布网站。

## 技术栈

- **React 19**：UI框架
- **Tailwind CSS 4**：样式系统
- **TypeScript**：类型安全
- **Vite**：构建工具
- **Framer Motion**：动画库（可选）

## 浏览器支持

- Chrome/Edge（最新版本）
- Firefox（最新版本）
- Safari（最新版本）
- 移动浏览器（iOS Safari, Chrome Mobile）

## 许可证

MIT License

## 支持

如有问题或需要帮助，请联系开发团队。

---

## 网站架构与素材说明

### 设计来源

页面视觉与交互来自一份单文件设计稿（日式手账风格摄影小站），已完整移植为 React + Vite + TypeScript 组件，人设为**张奔月 BigBen**。主色板在 `client/src/index.css` 中另起 `:root` 定义（与 shadcn 的 oklch 变量并存）：

| 变量 | 值 | 用途 |
|------|-----|------|
| `--paper` / `--paper2` | `#FAF5EA` / `#F4ECDC` | 纸张底色 |
| `--ink` / `--ink2` | `#4A4038` / `#8A7B6B` | 主文字 / 次要文字 |
| `--blue` / `--blue-d` | `#8FB6C6` / `#5E8798` | 婴儿蓝强调 |
| `--yellow` | `#F2C35C` | 高亮 / 胶带 / 按钮 |
| `--pink` | `#F4B6AE` | 腮红 / 爱心 |
| `--white` | `#FFFDF6` | 卡片 / 相纸底色 |

字体通过 Google Fonts 加载：标题 `ZCOOL XiaoWei`、手写 `Long Cang` + `Caveat`、正文 `Noto Sans SC`。

### 组件结构（`client/src/`）

| 模块 | 文件 | 职责 |
|------|------|------|
| 页面装配 | `pages/Home.tsx` | 单页组装 + 滚动显现（`.reveal` 的 IntersectionObserver） |
| 开场动效 | `components/Curtain.tsx` | 快门帘拉开 |
| 自定义光标 | `components/CursorRing.tsx` | 取景环光标，悬停可交互元素时变形 |
| 导航 | `components/NavBar.tsx` | 顶部导航 + 当前区块高亮 |
| 首屏 | `components/Hero.tsx` + `StageCharacters.tsx` | 舞台 SVG 角色：眼球跟随鼠标、眨眼、点击跳跃、拟声气泡 |
| 相册 | `components/Works.tsx` + `lib/photoData.ts` | 拍立得照片墙（胶带、随机倾角、懒加载） |
| 灯箱 | `components/Lightbox.tsx` | 大图浏览、键盘切换、点赞（localStorage 持久化） |
| 关于我 | `components/About.tsx` | 卡通形象 + 器材清单 + 拍摄年表 |
| 留言板 | `components/Guestbook.tsx` | 便签墙 + 表单（localStorage 持久化） |
| 页脚 | `components/Footer.tsx` | 版权与标语 |
| 右下角形象 | `components/MomoCorner.tsx` | 兔子摄影师（见下节），点击跳跃 + 撒粒子 |
| 相纸堆 | `components/SnapStack.tsx` | 「拍下此刻」生成的可下载相纸 |
| 提示条 | `components/ToastHost.tsx` | 全局 Toast |
| 工具库 | `lib/` | `interactions.ts`（跳跃/气泡）、`particles.ts`（粒子）、`storage.ts`（localStorage 封装）、`toast.ts`、`photoData.ts` |
| 复用 Hook | `hooks/` | `useMagnetic.ts`（磁吸）、`useMobile.tsx`、`usePersistFn.ts`、`useComposition.ts` |

### 兔子摄影师形象（当前方案）

**一张抠图 PNG 同时用于两处**：页面右下角交互形象（`MomoCorner.tsx`）与「关于我」个人形象（`About.tsx`）。

- 页面素材：`client/public/images/mascot.png`（572×708，透明底，约 300 KB）
- 源文件：项目根目录 `chaU.jpg`（1080×1080 白底卡通兔子：Lucky 橙帽 + 黑框圆眼镜 + 黄色相机 + 棕色围巾 + 蓝色外套）
- 抠图脚本：`scripts/cutout_chau.py`
  1. 从四边泛洪填充清除近白中性色背景（容差 `BG_TOL = 42`）
  2. 连通块分析清除小于 `MIN_BLOB = 900` px 的背景碎片
  3. 裁剪 alpha 包围盒后缩放 2/3 输出
- 重新生成：`python3 scripts/cutout_chau.py`
- 交互行为：指针轻微跟随（侧倾 + 平移）、点击跳跃 + 拟声气泡 + 撒萝卜/星星粒子、待机呼吸缩放

> `client/public/images/` 下现仅有 `mascot.png` 一个文件，页面不依赖任何外部图床或 Manus 云存储。
> 照片墙目前仍用 `picsum.photos` 占位图；换真实作品时只需改 `lib/photoData.ts` 的 `photoSrc()` 返回地址。

### 无障碍与工程修复

- 所有动画均尊重 `prefers-reduced-motion`（减弱动态）设置
- `index.html` 使用内联 SVG data URI 作为 favicon，已移除失效的 umami 统计脚本
- 清理了全部 `Zone.Identifier` 垃圾文件；删除了未使用的历史组件与素材（`RabbitMascot.tsx`、`RabbitCover.tsx`、`ClickHearts.tsx`、`ScrollProgress.tsx`、`Marquee.tsx`、`PosterHero.tsx`、`Map.tsx`、`ManusDialog.tsx`、`ConstructBackdrop.tsx`，以及 `rabbit-cover.png` / `rabbit-avatar.png` / `cloud-cover.png` / `heart-border.svg` / `favicon.svg`）
- 页脚版权为「张奔月 BigBen」

### 本机运行环境

Node.js v22 已安装在 `~/.local/opt/node-current/`（已写入 `~/.bashrc` PATH），pnpm 10.4.1 全局可用。常用命令：

```bash
cd ~/web-pages
pnpm dev     # 开发服务器 http://localhost:3000
pnpm check   # TypeScript 类型检查
pnpm build   # 生产构建（client → dist/public，server → dist/index.js）
pnpm start   # 以生产模式运行 Express 服务器
```
