import { spanSource } from './tableSpans'

export type Syntax = 'markdown' | 'asciidoc'
export type Locale = 'zh' | 'en'
export type Task = { id: string, label: string, heading: string, goal: string, hint: Record<Syntax, string>, initial: Record<Syntax, string>, answer: Record<Syntax, string> }
export const courses: Record<Locale, Task[]> = {
  zh: [
    {
      id: 'headings',
      label: '标题与段落',
      heading: '服务简介',
      goal: '给手册加上一级标题，把“服务简介”设为小节标题，段落之间留空行。',
      hint: {
        markdown: '文档标题写作 # 标题，小节写作 ## 标题。# 后留一个空格。',
        asciidoc: '文档标题写作 = 标题，小节写作 == 标题。标题后留空行，再开始正文。',
      },
      initial: {
        markdown: 'MySQL 数据库服务\n\n服务简介\n\nMySQL 是广泛应用的开源关系型数据库管理系统。支持高并发连接、ACID 事务与多存储引擎，是现代 Web 架构与企业核心系统的基础数据存储设施。',
        asciidoc: 'MySQL 数据库服务\n\n服务简介\n\nMySQL 是广泛应用的开源关系型数据库管理系统。支持高并发连接、ACID 事务与多存储引擎，是现代 Web 架构与企业核心系统的基础数据存储设施。',
      },
      answer: {
        markdown: '# MySQL 数据库服务\n\n## 服务简介\n\nMySQL 是广泛应用的开源关系型数据库管理系统。支持高并发连接、ACID 事务与多存储引擎，是现代 Web 架构与企业核心系统的基础数据存储设施。',
        asciidoc: '= MySQL 数据库服务\n\n== 服务简介\n\nMySQL 是广泛应用的开源关系型数据库管理系统。支持高并发连接、ACID 事务与多存储引擎，是现代 Web 架构与企业核心系统的基础数据存储设施。',
      },
    },
    {
      id: 'bullets',
      label: '无序列表',
      heading: '启动前检查',
      goal: '把三项准备事项改成无序列表。它们不需要编号。',
      hint: {
        markdown: '每行前加 - 和一个空格。* 或 + 也可以。',
        asciidoc: '每行前加 * 和一个空格。',
      },
      initial: {
        markdown: '## 启动前检查\n\n确认系统 3306 端口未被占用。\n验证当前用户具备数据目录读写权限。\n准备有效的配置文件 my.cnf。',
        asciidoc: '== 启动前检查\n\n确认系统 3306 端口未被占用。\n验证当前用户具备数据目录读写权限。\n准备有效的配置文件 my.cnf。',
      },
      answer: {
        markdown: '## 启动前检查\n\n- 确认系统 3306 端口未被占用。\n- 验证当前用户具备数据目录读写权限。\n- 准备有效的配置文件 my.cnf。',
        asciidoc: '== 启动前检查\n\n* 确认系统 3306 端口未被占用。\n* 验证当前用户具备数据目录读写权限。\n* 准备有效的配置文件 my.cnf。',
      },
    },
    {
      id: 'ordered',
      label: '有序列表',
      heading: '初始化实例',
      goal: '把三项操作改成从 1 开始的有序列表。',
      hint: {
        markdown: '用 1.、2.、3. 加空格。每行都写 1. 也可以自动编号。',
        asciidoc: '每行以一个英文句点和空格开头：. 操作。编号由处理器生成。',
      },
      initial: {
        markdown: '## 初始化实例\n\n执行初始化命令生成系统表与数据目录。\n启动 mysqld 服务进程。\n运行安全脚本配置管理员初始密码。',
        asciidoc: '== 初始化实例\n\n执行初始化命令生成系统表与数据目录。\n启动 mysqld 服务进程。\n运行安全脚本配置管理员初始密码。',
      },
      answer: {
        markdown: '## 初始化实例\n\n1. 执行初始化命令生成系统表与数据目录。\n2. 启动 mysqld 服务进程。\n3. 运行安全脚本配置管理员初始密码。',
        asciidoc: '== 初始化实例\n\n. 执行初始化命令生成系统表与数据目录。\n. 启动 mysqld 服务进程。\n. 运行安全脚本配置管理员初始密码。',
      },
    },
    {
      id: 'emphasis',
      label: '加粗与斜体',
      heading: '服务启停与重载',
      goal: '把“systemctl start mysqld”加粗，把“停止服务前，应先确认业务连接可以中断”设为斜体。',
      hint: {
        markdown: '**文字** 加粗，*文字* 斜体。中文说明通常优先用加粗，斜体这里只用来认识语法。',
        asciidoc: '*文字* 加粗，_文字_ 斜体。示例在标记两侧留空格，避免与前后文字粘连。',
      },
      initial: {
        markdown: '## 服务启停与重载\n\n需要启动服务时，执行 systemctl start mysqld。停止服务使用 systemctl stop mysqld。\n\n停止服务前，应先确认业务连接可以中断。',
        asciidoc: '== 服务启停与重载\n\n需要启动服务时，执行 systemctl start mysqld。停止服务使用 systemctl stop mysqld。\n\n停止服务前，应先确认业务连接可以中断。',
      },
      answer: {
        markdown: '## 服务启停与重载\n\n需要启动服务时，执行 **systemctl start mysqld**。停止服务使用 systemctl stop mysqld。\n\n*停止服务前，应先确认业务连接可以中断*。',
        asciidoc: '== 服务启停与重载\n\n需要启动服务时，执行 *systemctl start mysqld*。停止服务使用 systemctl stop mysqld。\n\n_停止服务前，应先确认业务连接可以中断_。',
      },
    },
    {
      id: 'nested',
      label: '嵌套列表',
      heading: '按环境规划实例',
      goal: '把实例规划分成生产集群和测试环境两组，每组下面放一项说明。',
      hint: {
        markdown: '子列表缩进两个空格。列表内另起段落也要保持缩进，否则会跳出列表。',
        asciidoc: '第一层用 *，第二层用 **。这里的双星号是列表层级，不是加粗标记。',
      },
      initial: {
        markdown: '## 按环境规划实例\n\n生产集群\n主节点写入，只读副本同步。\n测试环境\n单元测试库与数据沙箱。',
        asciidoc: '== 按环境规划实例\n\n生产集群\n主节点写入，只读副本同步。\n测试环境\n单元测试库与数据沙箱。',
      },
      answer: {
        markdown: '## 按环境规划实例\n\n- 生产集群\n  - 主节点写入，只读副本同步。\n- 测试环境\n  - 单元测试库与数据沙箱。',
        asciidoc: '== 按环境规划实例\n\n* 生产集群\n** 主节点写入，只读副本同步。\n* 测试环境\n** 单元测试库与数据沙箱。',
      },
    },
    {
      id: 'media',
      label: '图片与链接',
      heading: '架构拓扑与参考资料',
      goal: '插入架构图，写上替代文字，再加一个“查看架构大图”链接。',
      hint: {
        markdown: '![替代文字](图片路径) 插入图片，[链接文字](地址) 插入链接。替代文字要说明图里有什么。',
        asciidoc: 'image::路径[替代文字] 插入块级图片，link:地址[链接文字] 插入链接。',
      },
      initial: {
        markdown: '## 架构拓扑与参考资料\n\n这里放一张架构图。\n\n查看架构大图。',
        asciidoc: '== 架构拓扑与参考资料\n\n这里放一张架构图。\n\n查看架构大图。',
      },
      answer: {
        markdown: '## 架构拓扑与参考资料\n\n![MySQL 架构拓扑：连接池、查询优化器与 InnoDB 存储引擎](/img/markup/mysql-architecture.svg)\n\n[查看架构大图](/img/markup/mysql-architecture.svg)',
        asciidoc: '== 架构拓扑与参考资料\n\nimage::/img/markup/mysql-architecture.svg[MySQL 架构拓扑：连接池、查询优化器与 InnoDB 存储引擎]\n\nlink:/img/markup/mysql-architecture.svg[查看架构大图]',
      },
    },
    {
      id: 'table',
      label: '普通表格',
      heading: '存储引擎对照',
      goal: '把引擎、事务支持和适用场景整理成三列表格，保留两行引擎数据。',
      hint: {
        markdown: 'GFM 表格需要表头和分隔行。:--- 左对齐，:---: 居中，---: 右对齐。表格是 GFM 扩展。',
        asciidoc: '用两行 |=== 包住表格；表头后空一行，每个单元格用 | 开头。[cols="1,2,2",options="header"] 设置列和表头。',
      },
      initial: {
        markdown: '## 存储引擎对照\n\n引擎 / 事务支持 / 适用场景\nInnoDB / 支持 (ACID) / 高并发事务与核心业务\nMyISAM / 不支持 / 历史只读数据归档',
        asciidoc: '== 存储引擎对照\n\n引擎 / 事务支持 / 适用场景\nInnoDB / 支持 (ACID) / 高并发事务与核心业务\nMyISAM / 不支持 / 历史只读数据归档',
      },
      answer: {
        markdown: '## 存储引擎对照\n\n| 引擎 | 事务支持 | 适用场景 |\n| :--- | :--- | :--- |\n| InnoDB | 支持 (ACID) | 高并发事务与核心业务 |\n| MyISAM | 不支持 | 历史只读数据归档 |',
        asciidoc: '== 存储引擎对照\n\n[cols="1,2,2",options="header"]\n|===\n|引擎 |事务支持 |适用场景\n\n|InnoDB |支持 (ACID) |高并发事务与核心业务\n|MyISAM |不支持 |历史只读数据归档\n|===',
      },
    },
    {
      id: 'literal',
      label: '代码与原样文本',
      heading: '终端回显与状态码',
      goal: '把 1045 标为行内等宽文字，把两行状态放进原样文本块。',
      hint: {
        markdown: '行内文字用反引号包住，多行文字用三个反引号围起来。后面的 text 表示普通文本。',
        asciidoc: '行内文字用反引号包住。用两行 .... 围住多行文字，保留换行和空格。',
      },
      initial: {
        markdown: '## 终端回显与状态码\n\n认证失败时客户端将回显 1045 错误码。\n\n状态：运行中\n活跃连接：18',
        asciidoc: '== 终端回显与状态码\n\n认证失败时客户端将回显 1045 错误码。\n\n状态：运行中\n活跃连接：18',
      },
      answer: {
        markdown: '## 终端回显与状态码\n\n认证失败时客户端将回显 `1045` 错误码。\n\n```text\n状态：运行中\n活跃连接：18\n```',
        asciidoc: '== 终端回显与状态码\n\n认证失败时客户端将回显 `1045` 错误码。\n\n....\n状态：运行中\n活跃连接：18\n....',
      },
    },
    {
      id: 'xref',
      label: '页内链接',
      heading: '故障排查',
      goal: '把“实例维护”变成指向对应小节的链接，并在预览中点击试试。',
      hint: {
        markdown: '写成 [实例维护](#实例维护)。本练习按标题生成锚点，不同站点的规则可能不同。',
        asciidoc: '写成 <<maintenance,实例维护>>。目标小节上方已放了 [[maintenance]]，作为固定锚点。',
      },
      initial: {
        markdown: '## 故障排查\n\n排查权限与连接故障见实例维护。',
        asciidoc: '== 故障排查\n\n排查权限与连接故障见实例维护。',
      },
      answer: {
        markdown: '## 故障排查\n\n排查权限与连接故障见[实例维护](#实例维护)。',
        asciidoc: '== 故障排查\n\n排查权限与连接故障见 <<maintenance,实例维护>>。',
      },
    },
    {
      id: 'note',
      label: '提示说明',
      heading: '实例维护',
      goal: '把全量备份提醒单独放在 mysqldump 导出动作前面。',
      hint: {
        markdown: '> **提醒**：文字 可以单独显示提醒。引用块本身没有“警告”等级，标题是你写的。',
        asciidoc: 'NOTE: 文字 创建提示块。AsciiDoc 有专门的提示类型，与 Markdown 引用块的语义不同。',
      },
      initial: {
        markdown: '## 实例维护\n\n执行结构变更前，先对数据进行全量备份。\n\n使用 mysqldump 导出 SQL 脚本。',
        asciidoc: '[[maintenance]]\n== 实例维护\n\n执行结构变更前，先对数据进行全量备份。\n\n使用 mysqldump 导出 SQL 脚本。',
      },
      answer: {
        markdown: '## 实例维护\n\n> **提醒**：执行结构变更前，先对数据进行全量备份。\n\n使用 mysqldump 导出 SQL 脚本。',
        asciidoc: '[[maintenance]]\n== 实例维护\n\nNOTE: 执行结构变更前，先对数据进行全量备份。\n\n使用 mysqldump 导出 SQL 脚本。',
      },
    },
    {
      id: 'checklist',
      label: '任务清单',
      heading: '上线检查清单',
      goal: '把两项内容改成任务清单，一项已完成，一项未完成。',
      hint: {
        markdown: '- [x] 表示已完成，- [ ] 表示未完成。本课通过编辑标记改变状态，预览里的框只负责显示。',
        asciidoc: '* [x] 表示已完成，* [ ] 表示未完成。本课预览使用静态复选框。',
      },
      initial: {
        markdown: '## 上线检查清单\n\n慢查询日志已开启。\n备份脚本已加入定时任务。',
        asciidoc: '== 上线检查清单\n\n慢查询日志已开启。\n备份脚本已加入定时任务。',
      },
      answer: {
        markdown: '## 上线检查清单\n\n- [x] 慢查询日志已开启。\n- [ ] 备份脚本已加入定时任务。',
        asciidoc: '== 上线检查清单\n\n* [x] 慢查询日志已开启。\n* [ ] 备份脚本已加入定时任务。',
      },
    },
    {
      id: 'escape',
      label: '字符转义',
      heading: '授权语句记录',
      goal: '让“*.*”连同两个星号原样显示，不被当作强调标记。',
      hint: {
        markdown: '在星号前加反斜杠：\\*.\\*。表格里的竖线也需要转义，才能留在同一个单元格。',
        asciidoc: '用反斜杠阻止标记生效：\\*.*。预览中应看到两个星号。',
      },
      initial: {
        markdown: '## 授权语句记录\n\n授权全局库表时写作 *.*。',
        asciidoc: '== 授权语句记录\n\n授权全局库表时写作 *.*。',
      },
      answer: {
        markdown: '## 授权语句记录\n\n授权全局库表时写作 \\*.\\*。',
        asciidoc: '== 授权语句记录\n\n授权全局库表时写作 \\*.*。',
      },
    },
  ],
  en: [
    {
      id: 'headings',
      label: 'Headings',
      heading: 'Overview',
      goal: 'Add a document title and a section heading. Leave a blank line between paragraphs.',
      hint: {
        markdown: 'Use # Title for the document and ## Section for a section.',
        asciidoc: 'Use = Title for the document and == Section for a section. Leave a blank line before the body.',
      },
      initial: {
        markdown: 'MySQL Database Service\n\nOverview\n\nMySQL is a widely used open-source relational database management system. Supporting ACID transactions, high-concurrency connections, and pluggable storage engines, it powers mission-critical web applications.',
        asciidoc: 'MySQL Database Service\n\nOverview\n\nMySQL is a widely used open-source relational database management system. Supporting ACID transactions, high-concurrency connections, and pluggable storage engines, it powers mission-critical web applications.',
      },
      answer: {
        markdown: '# MySQL Database Service\n\n## Overview\n\nMySQL is a widely used open-source relational database management system. Supporting ACID transactions, high-concurrency connections, and pluggable storage engines, it powers mission-critical web applications.',
        asciidoc: '= MySQL Database Service\n\n== Overview\n\nMySQL is a widely used open-source relational database management system. Supporting ACID transactions, high-concurrency connections, and pluggable storage engines, it powers mission-critical web applications.',
      },
    },
    {
      id: 'bullets',
      label: 'Unordered lists',
      heading: 'Pre-flight checks',
      goal: 'Turn the three readiness checks into an unordered list.',
      hint: {
        markdown: 'Prefix each line with - and a space. * or + also work.',
        asciidoc: 'Prefix each line with * and a space.',
      },
      initial: {
        markdown: '## Pre-flight checks\n\nConfirm that port 3306 is not in use.\nVerify read and write permissions on the data directory.\nPrepare a valid my.cnf configuration file.',
        asciidoc: '== Pre-flight checks\n\nConfirm that port 3306 is not in use.\nVerify read and write permissions on the data directory.\nPrepare a valid my.cnf configuration file.',
      },
      answer: {
        markdown: '## Pre-flight checks\n\n- Confirm that port 3306 is not in use.\n- Verify read and write permissions on the data directory.\n- Prepare a valid my.cnf configuration file.',
        asciidoc: '== Pre-flight checks\n\n* Confirm that port 3306 is not in use.\n* Verify read and write permissions on the data directory.\n* Prepare a valid my.cnf configuration file.',
      },
    },
    {
      id: 'ordered',
      label: 'Ordered lists',
      heading: 'Initialize the instance',
      goal: 'Turn the three operational steps into an ordered list starting at 1.',
      hint: {
        markdown: 'Use 1., 2., and 3. followed by a space. Writing 1. on every line also auto-numbers.',
        asciidoc: 'Start each line with a period and a space: . step. Numbers are generated by the processor.',
      },
      initial: {
        markdown: '## Initialize the instance\n\nRun the initialization command to create data directories.\nStart the mysqld service daemon.\nRun the security script to set the root password.',
        asciidoc: '== Initialize the instance\n\nRun the initialization command to create data directories.\nStart the mysqld service daemon.\nRun the security script to set the root password.',
      },
      answer: {
        markdown: '## Initialize the instance\n\n1. Run the initialization command to create data directories.\n2. Start the mysqld service daemon.\n3. Run the security script to set the root password.',
        asciidoc: '== Initialize the instance\n\n. Run the initialization command to create data directories.\n. Start the mysqld service daemon.\n. Run the security script to set the root password.',
      },
    },
    {
      id: 'emphasis',
      label: 'Bold and italics',
      heading: 'Service lifecycle',
      goal: 'Bold “systemctl start mysqld” and italicize “Before stopping, confirm that active client sessions can be interrupted”.',
      hint: {
        markdown: '**text** for bold, *text* for italics.',
        asciidoc: '*text* for bold, _text_ for italics. Leave spaces around markers.',
      },
      initial: {
        markdown: '## Service lifecycle\n\nTo start the service, execute systemctl start mysqld. Use systemctl stop mysqld to stop it.\n\nBefore stopping, confirm that active client sessions can be interrupted.',
        asciidoc: '== Service lifecycle\n\nTo start the service, execute systemctl start mysqld. Use systemctl stop mysqld to stop it.\n\nBefore stopping, confirm that active client sessions can be interrupted.',
      },
      answer: {
        markdown: '## Service lifecycle\n\nTo start the service, execute **systemctl start mysqld**. Use systemctl stop mysqld to stop it.\n\n*Before stopping, confirm that active client sessions can be interrupted*.',
        asciidoc: '== Service lifecycle\n\nTo start the service, execute *systemctl start mysqld*. Use systemctl stop mysqld to stop it.\n\n_Before stopping, confirm that active client sessions can be interrupted_.',
      },
    },
    {
      id: 'nested',
      label: 'Nested lists',
      heading: 'Deployment environments',
      goal: 'Group instance planning into Production and Staging clusters, each with one nested item.',
      hint: {
        markdown: 'Indent sublists with two spaces.',
        asciidoc: 'Use * for top level and ** for nested level.',
      },
      initial: {
        markdown: '## Deployment environments\n\nProduction cluster\nPrimary write node and read replicas.\nStaging cluster\nUnit test databases and sandbox instances.',
        asciidoc: '== Deployment environments\n\nProduction cluster\nPrimary write node and read replicas.\nStaging cluster\nUnit test databases and sandbox instances.',
      },
      answer: {
        markdown: '## Deployment environments\n\n- Production cluster\n  - Primary write node and read replicas.\n- Staging cluster\n  - Unit test databases and sandbox instances.',
        asciidoc: '== Deployment environments\n\n* Production cluster\n** Primary write node and read replicas.\n* Staging cluster\n** Unit test databases and sandbox instances.',
      },
    },
    {
      id: 'media',
      label: 'Images and links',
      heading: 'Architecture diagram',
      goal: 'Insert the architecture diagram with descriptive alt text, then add a “View full-size diagram” link.',
      hint: {
        markdown: '![alt text](path) for images, [link text](url) for links. Alt text should describe the image.',
        asciidoc: 'image::path[alt text] for block images, link:url[link text] for links.',
      },
      initial: {
        markdown: '## Architecture diagram\n\nInsert the architecture diagram here.\n\nView full-size diagram.',
        asciidoc: '== Architecture diagram\n\nInsert the architecture diagram here.\n\nView full-size diagram.',
      },
      answer: {
        markdown: '## Architecture diagram\n\n![MySQL architecture: connection pool, optimizer, and InnoDB engine](/img/markup/mysql-architecture.svg)\n\n[View full-size diagram](/img/markup/mysql-architecture.svg)',
        asciidoc: '== Architecture diagram\n\nimage::/img/markup/mysql-architecture.svg[MySQL architecture: connection pool, optimizer, and InnoDB engine]\n\nlink:/img/markup/mysql-architecture.svg[View full-size diagram]',
      },
    },
    {
      id: 'table',
      label: 'Tables',
      heading: 'Storage engines',
      goal: 'Organize engine, transaction support, and workload into a three-column table with two rows.',
      hint: {
        markdown: 'GFM tables require header and delimiter rows. :--- aligns left, :---: center, ---: right.',
        asciidoc: 'Wrap tables with |===; leave a blank line after headers. Use [cols="1,2,2",options="header"].',
      },
      initial: {
        markdown: '## Storage engines\n\nEngine / Transactions / Workload\nInnoDB / Supported (ACID) / High-concurrency online transactions\nMyISAM / Not supported / Read-only historical archives',
        asciidoc: '== Storage engines\n\nEngine / Transactions / Workload\nInnoDB / Supported (ACID) / High-concurrency online transactions\nMyISAM / Not supported / Read-only historical archives',
      },
      answer: {
        markdown: '## Storage engines\n\n| Engine | Transactions | Workload |\n| :--- | :--- | :--- |\n| InnoDB | Supported (ACID) | High-concurrency online transactions |\n| MyISAM | Not supported | Read-only historical archives |',
        asciidoc: '== Storage engines\n\n[cols="1,2,2",options="header"]\n|===\n|Engine |Transactions |Workload\n\n|InnoDB |Supported (ACID) |High-concurrency online transactions\n|MyISAM |Not supported |Read-only historical archives\n|===',
      },
    },
    {
      id: 'literal',
      label: 'Code and literal text',
      heading: 'Terminal status',
      goal: 'Mark 1045 as inline code and preserve the two status lines in a literal block.',
      hint: {
        markdown: 'Use backticks for inline code and a fenced block for multiple lines. The text label indicates plain text.',
        asciidoc: 'Use backticks for inline code and two lines of .... around a literal block.',
      },
      initial: {
        markdown: '## Terminal status\n\nThe client returns error 1045 when credentials fail.\n\nState: Running\nActive connections: 18',
        asciidoc: '== Terminal status\n\nThe client returns error 1045 when credentials fail.\n\nState: Running\nActive connections: 18',
      },
      answer: {
        markdown: '## Terminal status\n\nThe client returns error `1045` when credentials fail.\n\n```text\nState: Running\nActive connections: 18\n```',
        asciidoc: '== Terminal status\n\nThe client returns error `1045` when credentials fail.\n\n....\nState: Running\nActive connections: 18\n....',
      },
    },
    {
      id: 'xref',
      label: 'Section links',
      heading: 'Troubleshooting',
      goal: 'Link “Instance maintenance” to its section, then try the link in the preview.',
      hint: {
        markdown: 'Use [Instance maintenance](#instance-maintenance). This preview generates IDs from headings.',
        asciidoc: 'Use <<maintenance,Instance maintenance>>. The destination section already has a [[maintenance]] anchor.',
      },
      initial: {
        markdown: '## Troubleshooting\n\nSee Instance maintenance for permission and connection issues.',
        asciidoc: '== Troubleshooting\n\nSee Instance maintenance for permission and connection issues.',
      },
      answer: {
        markdown: '## Troubleshooting\n\nSee [Instance maintenance](#instance-maintenance) for permission and connection issues.',
        asciidoc: '== Troubleshooting\n\nSee <<maintenance,Instance maintenance>> for permission and connection issues.',
      },
    },
    {
      id: 'note',
      label: 'Notes',
      heading: 'Instance maintenance',
      goal: 'Set the backup reminder apart before the mysqldump export instruction.',
      hint: {
        markdown: '> **Note**: text separates a reminder visually. A blockquote has no built-in warning severity.',
        asciidoc: 'NOTE: text creates an admonition. AsciiDoc has explicit types; a blockquote is not semantically identical.',
      },
      initial: {
        markdown: '## Instance maintenance\n\nBack up all databases before applying schema changes.\n\nExport SQL dump files using mysqldump.',
        asciidoc: '[[maintenance]]\n== Instance maintenance\n\nBack up all databases before applying schema changes.\n\nExport SQL dump files using mysqldump.',
      },
      answer: {
        markdown: '## Instance maintenance\n\n> **Note**: Back up all databases before applying schema changes.\n\nExport SQL dump files using mysqldump.',
        asciidoc: '[[maintenance]]\n== Instance maintenance\n\nNOTE: Back up all databases before applying schema changes.\n\nExport SQL dump files using mysqldump.',
      },
    },
    {
      id: 'checklist',
      label: 'Task lists',
      heading: 'Production checklist',
      goal: 'Create a task list with one checked item and one unchecked item.',
      hint: {
        markdown: '- [x] is checked; - [ ] is unchecked. Edit the source to change the state; preview checkboxes are read-only.',
        asciidoc: '* [x] is checked; * [ ] is unchecked. This preview uses static checkboxes.',
      },
      initial: {
        markdown: '## Production checklist\n\nSlow query log is enabled.\nAutomated backup job is scheduled.',
        asciidoc: '== Production checklist\n\nSlow query log is enabled.\nAutomated backup job is scheduled.',
      },
      answer: {
        markdown: '## Production checklist\n\n- [x] Slow query log is enabled.\n- [ ] Automated backup job is scheduled.',
        asciidoc: '== Production checklist\n\n* [x] Slow query log is enabled.\n* [ ] Automated backup job is scheduled.',
      },
    },
    {
      id: 'escape',
      label: 'Escaping',
      heading: 'Wildcard escaping',
      goal: 'Display “*.*” with both asterisks rather than as emphasized text.',
      hint: {
        markdown: 'Escape each asterisk with a backslash: \\*.\\*. Escape pipes in a table to keep them inside a cell.',
        asciidoc: 'Escape the opening marker: \\*.*. Both asterisks should remain visible.',
      },
      initial: {
        markdown: '## Wildcard escaping\n\nGranting global permissions is written as *.*.',
        asciidoc: '== Wildcard escaping\n\nGranting global permissions is written as *.*.',
      },
      answer: {
        markdown: '## Wildcard escaping\n\nGranting global permissions is written as \\*.\\*.',
        asciidoc: '== Wildcard escaping\n\nGranting global permissions is written as \\*.*.',
      },
    },
  ],
}
export const architectureImage = '/img/markup/mysql-architecture.svg'
export const panelImage = '/img/markup/mysql-architecture.svg'

export function documentSource(locale: Locale, syntax: Syntax, solved = false) {
  const source = courses[locale].map(t => t[solved ? 'answer' : 'initial'][syntax]).join('\n\n')
  return solved ? source + '\n\n' + spanSource(locale, syntax) : source
}
