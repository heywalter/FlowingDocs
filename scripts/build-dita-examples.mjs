import { readFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import ts from 'typescript'

// Keep the downloadable XML identical to the interactive lesson. Requires Python 3.
const source = await readFile('src/components/MarkupWorkshop/dita.ts', 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText
const { ditaProject } = await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'))
const projects = {}
for (const locale of ['zh', 'en']) {
  const { files } = ditaProject(locale)
  files['README.md'] = locale === 'zh'
    ? `# MySQL DITA 写作练习

这些数据库场景仅用于写作练习，不是完整的生产操作说明。

三个主题文件由两份 map 共用。修改 start-service.dita 后，两本说明书都使用修改后的步骤。

1. 在 Oxygen 的 DITA Maps Manager 中打开 quickstart.ditamap。
2. 打开 start-service.dita，在 Author 视图编辑一个步骤，运行校验并保存。
3. 打开 guide.ditamap，查看同一主题，然后用 HTML5 发布场景生成说明书。

也可以安装 DITA-OT，并将其 bin 目录加入 PATH，在解压目录执行：

\`\`\`sh
dita --input=quickstart.ditamap --format=html5 --output=out/quickstart
dita --input=guide.ditamap --format=html5 --output=out/guide
\`\`\`

命令说明：https://www.dita-ot.org/dev/topics/build-using-dita-command
`
    : `# MySQL DITA writing exercise

These database scenarios are writing exercises, not complete production procedures.

Two maps share three topic files. Edit start-service.dita once to use the updated steps in both guides.

1. Open quickstart.ditamap in Oxygen’s DITA Maps Manager.
2. Open start-service.dita, edit a step in Author mode, validate, and save.
3. Open guide.ditamap, inspect the same topic, and publish using an HTML5 transformation scenario.

Alternatively, install DITA-OT, add its bin directory to PATH, and run these commands from the extracted directory:

\`\`\`sh
dita --input=quickstart.ditamap --format=html5 --output=out/quickstart
dita --input=guide.ditamap --format=html5 --output=out/guide
\`\`\`

Command reference: https://www.dita-ot.org/dev/topics/build-using-dita-command
`
  projects[locale] = files
}
execFileSync('python3', ['-c', `
import json, sys, zipfile
from pathlib import Path
from xml.etree import ElementTree
folder = Path('static/docs/markup/examples')
folder.mkdir(parents=True, exist_ok=True)
for locale, files in json.load(sys.stdin).items():
    for name, value in files.items():
        if name.endswith(('.dita', '.ditamap')):
            root = ElementTree.fromstring(value)
            for ref in root.iter('topicref'):
                assert ref.attrib['href'] in files
    with zipfile.ZipFile(folder / ('washing-machine-dita-' + locale + '.zip'), 'w') as archive:
        for name, value in files.items():
            entry = zipfile.ZipInfo(name, date_time=(2026, 1, 1, 0, 0, 0))
            entry.compress_type = zipfile.ZIP_DEFLATED
            entry.external_attr = 0o644 << 16
            archive.writestr(entry, value.encode('utf-8'))
print('Built and checked both DITA example archives')
`], { input: JSON.stringify(projects), stdio: ['pipe', 'inherit', 'inherit'] })
