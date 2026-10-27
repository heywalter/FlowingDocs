import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import ts from 'typescript'

// These modules contain course data and string helpers only, without browser APIs.
export async function loadCourseReference(root) {
  const temporary = await mkdtemp(join(root, 'node_modules/.reading-reference-'))
  try {
    for (const name of ['course', 'tableSpans', 'dita', 'syntaxData', 'reuseData', 'reference']) {
      const source = await readFile(resolve(root, 'src/components/MarkupWorkshop', name + '.ts'), 'utf8')
      const compiled = ts.transpileModule(source, {
        compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
        transformers: {
          after: [context => (sourceFile) => {
            function visit(node) {
              if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier) && node.moduleSpecifier.text.startsWith('./')) {
                return context.factory.updateImportDeclaration(node, node.modifiers, node.importClause, context.factory.createStringLiteral(node.moduleSpecifier.text + '.mjs'), node.attributes)
              }
              return ts.visitEachChild(node, visit, context)
            }
            return ts.visitNode(sourceFile, visit)
          }],
        },
      }).outputText
      await writeFile(join(temporary, name + '.mjs'), compiled)
    }
    return await import(pathToFileURL(join(temporary, 'reference.mjs')))
  }
  finally { await rm(temporary, { recursive: true, force: true }) }
}

export async function loadLocalePaths(root) {
  const source = await readFile(join(root, 'src/lib/localePath.ts'), 'utf8')
  const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText
  return import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'))
}
