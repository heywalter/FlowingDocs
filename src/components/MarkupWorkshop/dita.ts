import type { Locale } from './course'

export function ditaProject(locale: Locale) {
  const zh = locale === 'zh'
  const topics = [
    {
      id: 'engines',
      kind: 'concept',
      title: zh ? '存储引擎有什么区别' : 'Choosing a storage engine',
      summary: zh ? '先解释核心特性，帮助读者做架构选型。' : 'Explain core features to guide architecture decisions.',
      paragraphs: zh
        ? ['InnoDB 支持事务与行级锁定，适用于核心高并发业务；MyISAM 仅支持表锁，适合离线只读报表。', '这是一个用于写作练习的示例数据库指南。生产环境配置请参考 MySQL 官方参考手册。']
        : ['Use InnoDB for ACID transactions and row-level locks, and MyISAM for read-only analytical workloads.', 'This database guide is a writing example. Consult the official MySQL manual for production tuning.'],
    },
    {
      id: 'start-service',
      kind: 'task',
      title: zh ? '初始化并启动服务' : 'Initialize and start the service',
      summary: zh ? '按顺序写出实例初始化的步骤。' : 'Give the steps to initialize and launch the instance.',
      paragraphs: zh
        ? ['执行初始化命令生成系统表与数据目录。', '配置 my.cnf 并启动 mysqld 服务进程。', '运行安全脚本配置管理员初始密码。']
        : ['Run the initialization command to create data directories.', 'Configure my.cnf and start the mysqld service daemon.', 'Run the security script to set the root password.'],
    },
    {
      id: 'parameters',
      kind: 'reference',
      title: zh ? '核心参数对照表' : 'Core parameters reference',
      summary: zh ? '把需要频繁查阅的配置项整理成参考表。' : 'Collect configuration options readers need to look up.',
      paragraphs: zh
        ? ['max_connections', '最大连接数', '依据并发需求调整', 'innodb_buffer_pool_size', '缓冲池大小', '建议设为物理内存的 50% 至 70%']
        : ['max_connections', 'Max connections', 'Adjust based on concurrent load', 'innodb_buffer_pool_size', 'Buffer pool size', 'Recommended 50% to 70% of physical RAM'],
    },
  ]
  const headers = zh ? ['参数', '说明', '建议配置'] : ['Parameter', 'Description', 'Recommendation']
  const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const files: Record<string, string> = {}
  for (const topic of topics) {
    const body = topic.kind === 'concept'
      ? '<conbody>\n' + topic.paragraphs.map(p => '    <p>' + escape(p) + '</p>').join('\n') + '\n  </conbody>'
      : topic.kind === 'task'
        ? '<taskbody>\n    <steps>\n' + topic.paragraphs.map(p => '      <step><cmd>' + escape(p) + '</cmd></step>').join('\n') + '\n    </steps>\n  </taskbody>'
        : '<refbody>\n    <simpletable>\n      <sthead>' + headers.map(p => '<stentry>' + escape(p) + '</stentry>').join('') + '</sthead>\n' + [0, 3].map(start => '      <strow>' + topic.paragraphs.slice(start, start + 3).map(p => '<stentry>' + escape(p) + '</stentry>').join('') + '</strow>').join('\n') + '\n    </simpletable>\n  </refbody>'
    const type = topic.kind[0]!.toUpperCase() + topic.kind.slice(1)
    files[topic.id + '.dita'] = `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE ${topic.kind} PUBLIC "-//OASIS//DTD DITA ${type}//EN" "${topic.kind}.dtd">\n<${topic.kind} id="${topic.id}" xml:lang="${zh ? 'zh-CN' : 'en-US'}">\n  <title>${escape(topic.title)}</title>\n  ${body}\n</${topic.kind}>\n`
  }
  const maps = [
    { id: 'quickstart', title: zh ? '快速上手' : 'Quick start', topics: ['engines', 'start-service'] },
    { id: 'guide', title: zh ? '完整运维手册' : 'Full operations guide', topics: ['engines', 'start-service', 'parameters'] },
  ]
  for (const map of maps) files[map.id + '.ditamap'] = `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE map PUBLIC "-//OASIS//DTD DITA Map//EN" "map.dtd">\n<map xml:lang="${zh ? 'zh-CN' : 'en-US'}">\n  <title>${escape(map.title)}</title>\n${map.topics.map(id => `  <topicref href="${id}.dita"/>`).join('\n')}\n</map>\n`
  return { topics, maps, headers, files }
}

export function ditaExerciseAnswer(locale: Locale, lesson: string) {
  const project = ditaProject(locale)
  const zh = locale === 'zh'
  if (lesson === 'map') {
    return project.files['guide.ditamap']!.replace(
      '<topicref href="engines.dita"/>\n  <topicref href="start-service.dita"/>',
      '<topicref href="start-service.dita"/>\n  <topicref href="engines.dita"/>',
    )
  }
  if (lesson === 'task' || lesson === 'reuse') {
    return project.files['start-service.dita']!.replace(
      project.topics[1]!.paragraphs[0]!,
      zh ? '确认 3306 端口未占用后，执行初始化命令生成数据目录。' : 'Verify port 3306 is free, then run the initialization command.',
    )
  }
  if (lesson === 'reference') {
    return project.files['parameters.dita']!.replace(
      zh ? '依据并发需求调整' : 'Adjust based on concurrent load',
      zh ? '依据业务峰值连接数评估调整' : 'Evaluate and adjust based on peak connection load',
    )
  }
  return project.files['engines.dita']!.replace(
    project.topics[0]!.paragraphs[0]!,
    zh ? '高并发核心业务优先选择 InnoDB；仅有离线分析和归档需求时，可评估 MyISAM。' : 'Choose InnoDB for high-concurrency transactions. Evaluate MyISAM only for offline analytical archives.',
  )
}
