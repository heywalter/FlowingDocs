# Publish a Markdown guide / 发布 Markdown 说明

This template uses Docusaurus 3.9.2. / 本模板使用 Docusaurus 3.9.2。

Choosing a publishing tool / 发布工具选择：https://flowingdocs.com/docs/publishing/

## 中文操作说明

这是一条 **Markdown → Docusaurus → Netlify** 的完整路径，用来观察构建与发布的关系。它不直接处理 AsciiDoc 或 DITA。准备 Markdown 练习包、可安装软件的电脑和文本编辑器；只有决定公开发布时才需要托管账号。本地构建只能验证生成结果；自己的线上页面是否正常，仍要在发布后打开正式网址检查。

### 准备说明和最小模板

1. 在标记语言示例的“查看整份说明”里，选择 **Markdown**，下载“**练习包（含图片）**”。解压后会看到源文件、`images` 目录和使用说明。下载会保留未完成的练习素材，先通读一遍。
2. 本 README 所在的 `publishing-starter` 文件夹就是最小站点模板。它固定使用 Docusaurus 3.9.2，只保留文档页、导航和少量样式。
3. 用编辑器打开模板的 `docs/index.md`。保留最上方两条 `---` 及其中的配置，把它们**下面的占位标题和段落**替换为你下载的 Markdown 全文。需要时把 `sidebar_label` 改成“MySQL 运维手册”。
4. 把练习包里的整个 `images` 文件夹复制到模板的 `docs` 目录下。

完成后，主要文件的位置应当是：

```text
publishing-starter/
├── docs/
│   ├── index.md                  ← 你的说明，顶部保留页面配置
│   └── images/
│       └── mysql-architecture.svg
├── src/css/custom.css            ← 少量外观设置
├── docusaurus.config.js          ← 站点名称、网址等
├── sidebars.js                   ← 自动读取文档目录
├── package.json                  ← 使用哪些工具、运行哪些命令
└── package-lock.json             ← 锁定安装依赖
```

练习包中的 `./images/mysql-architecture.svg` 表示“当前文档旁边的 images 目录”。保留这个位置关系，文档就不用依赖本站的图片地址。自行添加的图片要另外复制进来，并检查路径。

**为什么提供模板？**
这个模板用于试发自己的内容。模板省去了删除演示页面、配置首页和导航的准备工作；理解流程之后，再按 [Docusaurus 安装说明](https://docusaurus.io/docs/3.9.2/installation) 创建自己的站点。

### 安装依赖，在电脑上预览

安装 [Node.js](https://nodejs.org/en/download) 的受支持 LTS 版本（本示例使用 Node.js 22 或更新的受支持版本），它通常同时提供 npm。npm 用来安装模板需要的工具，并运行预先配置好的命令。

在终端中进入刚才解压的 `publishing-starter` 目录。可以用编辑器打开这个文件夹，再打开它的集成终端。先确认环境：

```bash
node --version
npm --version
```

接着运行：

```bash
npm ci
npm start
```

`npm ci` 按锁定文件安装依赖，第一次需要联网，可能花几分钟；`npm start` 启动本地预览。看到终端给出的地址后，在浏览器打开它，通常是 `http://localhost:3000`。预览期间保持终端运行，停止时按 `Ctrl+C`。

现在把说明中的一处短句改清楚并保存，确认页面会更新。**到这一步，只有你自己能看到，还没有发布到网上。**

### 对照输出，调整必要样式

重点看这四处：

| 检查位置 | 应该看到什么 | 不符合时先查什么 |
| --- | --- | --- |
| 面板图片和“大图”链接 | 图片可见，点击能打开 | `docs/images` 是否复制齐，文件名大小写、路径是否一致 |
| 普通表格与合并表格 | 表头清楚，跨行和跨列符合原意 | 普通表格的分隔行；HTML 的 `rowspan`、`colspan` 和多余单元格 |
| “备份与维护计划”等页内链接 | 点击后跳到对应章节 | 改过标题后，链接目标是否也更新 |
| 提醒与步骤 | 顺序正确，提醒容易注意到 | Markdown 引用默认只是引用，不保证与标记语言示例的预览样式完全相同 |

模板设置了 `markdown.format: 'detect'`，让 `.md` 使用 CommonMark 解析方式，`.mdx` 使用 MDX。Docusaurus 3.9.2 的 CommonMark 支持仍标为实验性；本示例用它保留普通 Markdown 和内嵌 HTML 表格的写法，仍需检查实际输出。[官方格式说明](https://docusaurus.io/docs/3.9.2/markdown-features#mdx-vs-commonmark)

如果想把普通引用变成 Docusaurus 的提示框，可以把提醒段落改成下面这样，再看效果：

```markdown
:::note 变更前
确认适用版本、验证方法和恢复步骤，再按对应操作说明执行。
:::
```

这是 [Docusaurus 的提示框扩展](https://docusaurus.io/docs/3.9.2/markdown-features/admonitions)，移到其他工具时要重新检查。需要通用性时，保留原来的 `> **提醒**：…` 也可以。

只想改字号和行距，打开 `src/css/custom.css`，调整已有的 `--ifm-font-size-base` 和 `--ifm-line-height-base`。不要在每个段落里分别指定字体。导航名称则在 `docusaurus.config.js` 的 `navbar` 中修改。

也可以请 AI 辅助检查，给它一个小而明确的任务：

> 对照下面的文件树和 Markdown，列出可能失效的图片路径与页内链接。指出具体位置，不要改写正文，也不要假设缺失文件存在。

AI 列出的每一项，最后都到浏览器里点一下确认。

### 构建成品，发布到 Netlify

停止预览后，在同一个终端运行：

```bash
npm run build
npm run serve
```

构建成功会生成 `build` 目录。`serve` 用本地服务器打开这份生成结果；按终端显示的地址，再检查一次图片、表格、链接和手机宽度下的阅读效果。不要用双击 `build/index.html` 的方式代替服务器检查。

接下来使用 [Netlify 的手动发布入口](https://app.netlify.com/drop)：

1. 登录你准备使用的账号，确认这些练习内容可以公开。
2. 上传 **`build` 文件夹**。这是网页成品目录，里面应当能找到 `index.html`；本示例不上传源项目或 `node_modules`。
3. 等待部署完成，打开平台分配的网址。它通常以 `.netlify.app` 结尾。
4. 把这个站点的源站地址，例如 `https://你的站点名.netlify.app`，填入 `docusaurus.config.js` 的 `url`，替换 `https://example.com`。本示例在域名根路径发布，保留 `baseUrl: '/'`。
5. 再运行 `npm run build`，进入**同一个 Netlify 项目**的 Deploys 页面，在手动部署区域上传新的 `build` 文件夹。这样页面的规范地址也与真实网址一致。

上传方式和更新入口见 [Netlify 官方发布说明](https://docs.netlify.com/deploy/create-deploys/#drag-and-drop)。界面名称可能变化，寻找上传构建目录、更新现有项目的入口即可。

**本地构建成功不等于发布成功。** 用手机或另一个浏览器打开正式网址，确认无需你的本地预览服务也能看到内容。点一次大图链接和页内链接。只有这些都正常，这份说明才算真正交到读者手里。

### 修改一句话，更新原站点

比如，把“验证备份”补充为“在隔离的测试环境中验证备份能否恢复，并记录验证结果”。这里演示的是文档修改流程，具体恢复步骤仍要按自己的环境编写和验证。

1. 修改 `docs/index.md`，保存。
2. 本地预览并检查新句子，再运行 `npm run build`。
3. 将新的 `build` 目录上传到**原项目**的部署区域。
4. 打开原来的网址，刷新后找到新句子。

不要直接修改 `build` 中的 HTML：下次构建会重新生成它。以后更新都从源文件开始。更新频繁时，再把项目放进 Git 仓库，接入自动构建和发布。

### 操作时遇到问题

| 现象 | 下一步 |
| --- | --- |
| 找不到 `node` 或 `npm` | 确认已安装 Node.js，重新打开终端，再检查版本 |
| 提示找不到 `package.json` | 当前目录不对，进入模板根目录后重试 |
| 安装失败 | 先看第一条错误，确认网络和 Node.js 版本；不要先删除自己的说明文件 |
| 构建失败 | 按日志给出的文件和行号检查语法、图片或链接；本地开发预览能打开，也可能有构建错误 |
| 网页打开了，但图片不见了 | 检查复制位置、相对路径和文件名大小写，再构建和上传 |
| 刷新后仍是旧内容 | 确认重新构建过、更新的是同一个项目，并查看该项目最新部署状态 |
| 换平台后页面 404 或样式丢失 | 检查上传的是否为输出目录，以及平台是否要求不同的 `baseUrl`；本示例模板假设在域名根路径发布 |

这些例子的用途是帮助定位问题。放到实际项目里，还需要记录使用的工具版本、检查过的输出，以及没有验证的部分。

## English instructions

The following **Markdown → Docusaurus → Netlify** path demonstrates building and publishing. It does not process AsciiDoc or DITA directly. Bring the Markdown practice package, a computer on which you can install software, and a text editor. A hosting account is only needed if you decide to publish publicly. A local build only verifies the generated output; check your own live URL after publishing.

### Prepare the guide and minimal template

1. In the markup example, select **Markdown**, open “Read the complete guide,” and download the **practice package with image**. Extract the source, `images` folder, and instructions. The download includes unfinished material, so review it first.
2. The `publishing-starter` folder containing this README is the minimal template. It uses Docusaurus 3.9.2 with documentation, navigation, and a little CSS.
3. Open the template's `docs/index.md` in your editor. Keep the opening `---` lines and the configuration between them. Replace the **placeholder heading and paragraph below them** with the entire Markdown guide you downloaded. Change `sidebar_label` if needed.
4. Copy the practice package's entire `images` folder into the template's `docs` folder.

The key files should now be arranged as follows:

```text
publishing-starter/
├── docs/
│   ├── index.md                  ← Your guide, with page configuration at the top
│   └── images/
│       └── mysql-architecture.svg
├── src/css/custom.css            ← Basic appearance settings
├── docusaurus.config.js          ← Site name, URL, and other settings
├── sidebars.js                   ← Reads the document directory automatically
├── package.json                  ← Tools and commands
└── package-lock.json             ← Locked dependencies
```

The package uses `./images/mysql-architecture.svg`: the image is in an `images` folder next to the document. Keep that relationship so your guide no longer depends on this site's image URL. Copy any images you added yourself separately and check their paths.

**Why start with a template?**
The template handles homepage and navigation configuration and removes demonstration pages, so you can focus on publishing your content. Once you understand the workflow, use the [Docusaurus installation guide](https://docusaurus.io/docs/3.9.2/installation) to create your own site.

### Install dependencies and preview locally

Install a supported [Node.js LTS release](https://nodejs.org/en/download), using Node.js 22 or a newer supported release for this example. It normally includes npm, which installs the required tools and runs the commands defined in the template.

Open a terminal in the extracted `publishing-starter` directory. One option is to open that folder in your editor and use its integrated terminal. Check the environment:

```bash
node --version
npm --version
```

Then run:

```bash
npm ci
npm start
```

`npm ci` installs the locked dependencies. It needs internet access and can take a few minutes. `npm start` starts the local preview. Open the address printed in the terminal, usually `http://localhost:3000`. Keep the terminal running while previewing; press `Ctrl+C` to stop it.

Improve one short sentence in the guide, save the file, and check that the page updates. **This is still a local preview, not a published website.**

### Inspect output and adjust essential styles

Check these four areas:

| Area | Expected result | If it fails, check |
| --- | --- | --- |
| Panel image and full-size link | The image appears and the link opens it | The `docs/images` folder, filename capitalization, and paths |
| Ordinary and merged tables | Clear headers and correct row and column spans | The pipe table's separator row; HTML `rowspan`, `colspan`, and redundant cells |
| Links to sections such as the backup plan | Clicking jumps to the right heading | Whether changing a heading also requires changing the link target |
| Notices and steps | Correct order, with visible reminders | A Markdown blockquote is a quote; its styling may differ from the markup example's preview |

The template sets `markdown.format: 'detect'`: `.md` uses CommonMark parsing, and `.mdx` uses MDX. CommonMark support in Docusaurus 3.9.2 is still experimental. We use it to retain ordinary Markdown and embedded HTML tables, while checking the output. See the [official format guide](https://docusaurus.io/docs/3.9.2/markdown-features#mdx-vs-commonmark).

To turn a plain quote into a Docusaurus notice, replace the reminder with this and check the result:

```markdown
:::note Before a change
Confirm the applicable version, verification method, and recovery steps before following the procedure.
:::
```

This is a [Docusaurus admonition extension](https://docusaurus.io/docs/3.9.2/markdown-features/admonitions); check compatibility when moving to another tool. Keep the original `> **Note**: …` if portability matters more.

For font size and line spacing, adjust the existing `--ifm-font-size-base` and `--ifm-line-height-base` values in `src/css/custom.css`. Avoid setting fonts separately in each paragraph. Navigation labels are under `navbar` in `docusaurus.config.js`.

You can give AI a small review task:

> Compare this file tree with the Markdown below. List image paths and section links that may fail, identifying the exact location. Do not rewrite the content or assume missing files exist.

Check each reported issue in the browser yourself.

### Build and publish to Netlify

Stop the development preview, then run these commands in the same terminal:

```bash
npm run build
npm run serve
```

A successful build creates the `build` folder. `serve` opens those generated files through a local server. Use the address printed in the terminal and check images, tables, links, and reading at phone widths. Double-clicking `build/index.html` is not a substitute for checking through a server.

Next, use [Netlify's manual deployment page](https://app.netlify.com/drop):

1. Sign in to the account you intend to use and confirm the practice content can be public.
2. Upload the **`build` folder**, containing the finished pages and an `index.html` file. This example uploads the output, not the source project or `node_modules`.
3. Wait for deployment to finish and open the assigned URL, usually ending in `.netlify.app`.
4. Replace `https://example.com` in the `url` setting in `docusaurus.config.js` with your site's origin, such as `https://your-site-name.netlify.app`. Keep `baseUrl: '/'` because this example publishes at the domain root.
5. Run `npm run build` again. Open the **same Netlify project's** Deploys page and upload the new `build` folder in its manual deployment area. The canonical page URLs will now match the real site.

See [Netlify's publishing instructions](https://docs.netlify.com/deploy/create-deploys/#drag-and-drop) for current upload and update controls. Labels can change; look for uploading build output and updating an existing project.

**A successful local build does not prove the public site works.** Open the live URL on a phone or another browser. Confirm it works without your local preview server, then test the full-size image link and a section link.

### Change a sentence and update the existing site

For example, clarify “Verify the backup” as “Verify that the backup can be restored in an isolated test environment, and record the result.” This demonstrates a documentation update; write and verify the actual recovery steps for your environment.

1. Edit `docs/index.md` and save it.
2. Preview and check the new sentence, then run `npm run build`.
3. Upload the new `build` folder to the **existing project's** deployment area.
4. Refresh the original URL and find the new sentence.

Do not edit the generated HTML in `build`: the next build replaces it. Start future updates from the source. When updates become frequent, put the project in Git and connect automated builds and publishing.

### Troubleshooting the worked example

| Symptom | Next check |
| --- | --- |
| `node` or `npm` cannot be found | Confirm Node.js is installed, reopen the terminal, and check the versions |
| `package.json` cannot be found | Open the terminal in the template's root folder |
| Installation fails | Read the first error; check network access and Node.js version before changing anything. Keep your guide files |
| The build fails | Check the file and line reported for syntax, image, or link errors. A working development preview does not guarantee a successful build |
| The page opens without images | Check copy location, relative paths, and filename case, then rebuild and upload |
| Refreshing still shows old content | Confirm you rebuilt, updated the same project, and checked its latest deployment status |
| Another host shows a 404 or missing styles | Check the uploaded output folder and the required `baseUrl`; this template assumes publication at the domain root |

Use these examples to locate problems. For a real project, also record tool versions, the output you checked, and what remains unverified.

## For template maintainers

The webpack override keeps the build compatible with this Docusaurus version. Revalidate before changing dependencies. From the FlowingDocs repository root, install template dependencies with `npm ci --prefix examples/publishing-starter`, then run `node scripts/build-publishing-starter.mjs` and `pnpm test:publishing`.
