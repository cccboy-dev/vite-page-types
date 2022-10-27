import { dirname, resolve } from 'path'
import { Project } from 'ts-morph'

import type { ResolvedOptions } from '../../types/types'
import type { PageOptions } from './../types'
const replaceConfigImport = (pageOption: PageOptions, rootDir: string) => {
  const { config } = pageOption

  if (!config)
    return

  const project = new Project()

  const diskConfigPath = resolve(rootDir, config)

  project.addSourceFilesAtPaths([
    diskConfigPath,
    '!node_modules',
  ])

  project.resolveSourceFileDependencies()

  const configSourceFile = project.getSourceFileOrThrow(diskConfigPath)

  configSourceFile.getImportDeclarations().forEach((declaration) => {
    const moduleSpecifier = declaration.getModuleSpecifierValue()
    if (moduleSpecifier.startsWith('./'))
      declaration.setModuleSpecifier(resolve(dirname(diskConfigPath), moduleSpecifier))

    console.log(declaration.getImportClause()?.getNamedImports().map(v => v.getFullText()), 'xxxx')
  })

  const text = configSourceFile.getFullText()

  console.log(text, 'text')
}

export {
  replaceConfigImport,
}
