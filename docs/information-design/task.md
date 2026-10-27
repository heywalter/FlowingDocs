---
title: "操作步骤：让读者做完，也知道是否成功"
sidebar_label: 操作类文档 (Task)
sidebar_position: 3
description: "按读者的实际任务组织条件、步骤和验证，附完整 JDBC 驱动加载示例。"
image: /img/flowingdocs.png
tags:
  - information-design
  - task-topics
  - sop-standards
  - user-experience
---

操作文档要让读者完成一件事，并知道是否成功。这里用“确认 JDBC 驱动可以加载”作为小例子，讨论步骤怎么拆、哪些条件要提前说，以及验证应该写到什么程度。

## 先确定读者需要哪些帮助 {#audience}

读者是否熟悉终端、是否有相应权限、多久做一次这个操作，都会影响详略。新手可能需要交代在哪里运行命令；熟悉系统的人也需要知道版本限制和失败后的处理方式。

### 把点击写成有目的的动作 {#gui-cli-antipatterns}

| 容易让人跟丢的写法 | 更容易执行的写法 |
| --- | --- |
| 点击设置，再点连接，再点新增，最后点击保存 | 在“设置 → 连接”中新增连接，填写地址和端口，然后保存 |
| 修改参数后确定 | 把当前会话的查询时限设为 30 秒，再查询当前值确认 |
| 执行下面的命令即可 | 在项目根目录执行命令；成功后会出现指定文件 |

菜单路径和按钮名称有用，不能为了“避免流水账”全部删掉。保留读者定位操作所需的信息，把相关的小动作放在一起。

## 让读者容易扫读 {#f-pattern}

标题先说明目标，关键条件放在操作之前，命令和预期输出分开。长步骤可以加小标题，风险提醒放在有关动作旁边。

F 型扫视是某些页面上观察到的一种阅读模式，不是所有读者都会遵循的路线，也不是把内容排成 F 形的要求。[NNG 对这一研究的解释](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/)强调了多种扫读方式。实际页面仍应通过读者试用来检查。

## 一篇操作说明需要什么 {#structure}

以下项目是检查思路，篇幅短、风险低的任务可以合并表达，不必为每项都设一个标题。

### 标题写出目标 {#anatomy-title}

例如“确认 JDBC 驱动可以加载”。读者能据此判断本页是否解决自己的问题。

### 简短说明结果与范围 {#anatomy-desc}

交代完成后能得到什么，同时说明本页没有验证什么。加载驱动成功，不等于已经连通数据库。

### 提前列出条件 {#anatomy-prerequisites}

写清已验证的版本、工具、工作目录和权限。有依赖就列出；不要用“环境准备完成”替代具体条件。

### 把影响与限制放在有关动作前 {#anatomy-limits}

涉及覆盖文件、重启服务或修改共享设置时，先说明影响。只对某一步成立的限制，就放在那一步旁边。

### 按实际工作拆步骤 {#rule-of-seven}

步骤数量由任务决定，没有必须达到 5 步或不许超过 9 步的通用要求。流程很长时，按准备、执行、验证等有意义的阶段分组。

每步围绕一个明确目的；紧密相关且容易一起完成的小动作可以放在同一步。给出必要的命令、位置和反馈，不要为每次点击单独编号。可参考 [Google 的步骤编写建议](https://developers.google.com/style/procedures)。

### 提供能执行的验证 {#anatomy-verification}

写出验证命令或界面位置，并说明预期结果。不要只贴一段“连接成功”的日志，却省略生成这段日志的程序。

### 说明失败后怎么办 {#anatomy-rollback}

列出最常见的失败原因。涉及状态变更时，补充恢复方法；若不能回退，要在执行前说明。

### 只推荐相关的下一步 {#anatomy-next}

验证完驱动加载后，下一步才是检查连接 URL、认证和网络。不要链接到与当前任务无关的知识清单。

## 一个完整的小例子：确认 JDBC 驱动可以加载 {#example}

本例只检查 Java 类路径能否加载 MySQL Connector/J，不会连接数据库。使用固定的 **Connector/J 8.4.0** 演示，它不代表当前最新版本或你的项目应该采用的版本。

**准备条件**：Linux 或 macOS 终端、JDK 8 或更新版本的 `java` 与 `javac`、`curl`，以及访问 Maven Central 的网络。下面使用 Unix 类路径分隔符；Windows 需要把 `:` 改为 `;`。

1. **创建空目录并下载示例驱动**。若目录已存在，请换一个新目录名，避免覆盖已有文件。

   ```bash
   mkdir jdbc-driver-check
   cd jdbc-driver-check
   curl --fail --location --output mysql-connector-j-8.4.0.jar \
     https://repo.maven.apache.org/maven2/com/mysql/mysql-connector-j/8.4.0/mysql-connector-j-8.4.0.jar
   ```

2. **新建测试文件**。把下面内容保存为当前目录的 `CheckDriver.java`。

   ```java
   public class CheckDriver {
       public static void main(String[] args) throws Exception {
           Class.forName("com.mysql.cj.jdbc.Driver");
           System.out.println("Driver loaded");
       }
   }
   ```

3. **编译并运行**。

   ```bash
   javac CheckDriver.java
   java -cp ".:mysql-connector-j-8.4.0.jar" CheckDriver
   ```

成功时输出：

```text
Driver loaded
```

| 现象 | 先检查什么 |
| --- | --- |
| `curl` 下载失败 | 地址、网络和代理；不要继续使用不完整的文件 |
| 找不到 `javac` | 是否安装了 JDK，终端能否找到它 |
| `ClassNotFoundException` | JAR 文件名、所在目录和类路径分隔符 |
| 显示 `Driver loaded` | 只证明驱动能加载；数据库网络和认证尚未验证 |

测试文件都在新目录内，不会改动数据库。需要在项目中长期使用时，按项目的依赖管理方式配置，可参考 [Connector/J 的 Maven 安装说明](https://dev.mysql.com/doc/connector-j/en/connector-j-installing-maven.html)。

## 页面、链接和目录怎么安排 {#discussion}

一个任务能独立完成时，通常值得单独成页；多个小任务有紧密先后关系时，也可以组织为一个快速入门。长页提供页内目录，短页不必为了模板增加空章节。

把链接放在读者需要它的位置：前置任务放在准备条件中，参数定义放在对应步骤旁，补充背景放在末尾。外部来源并非一律后置，执行所必需的官方信息应该能就近找到。

## 发布前自查 {#checklist}

- 读者能否判断这是不是自己要做的任务？
- 版本、权限、目录和工具是否交代清楚？
- 命令能否按给定顺序执行？哪些值需要替换？
- 验证结果是否支持本页承诺的结论？
- 失败后的处理方式是否与操作风险相称？

下一步：[把参数写成可查的参考说明](./reference.md)，或回到[信息表达总览](./index.mdx)。
