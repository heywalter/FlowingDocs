---
title: "Procedures: actions and verifiable results"
sidebar_label: Task Topics
sidebar_position: 3
description: "Organize prerequisites, actions and verification, with a complete JDBC driver-loading example."
image: /img/flowingdocs.png
tags:
  - information-design
  - task-topics
  - sop-standards
  - user-experience
---

A procedure should help readers complete a task and tell whether it worked. This page uses a small JDBC driver-loading check to explain prerequisites, step boundaries and useful verification.

## Decide what help the reader needs {#audience}

Terminal experience, permissions and how often someone performs the task affect the detail they need. Beginners may need a working directory; experienced readers still need version limits and failure recovery.

### Give each action a purpose {#gui-cli-antipatterns}

| Hard to follow | Easier to use |
| --- | --- |
| Click Settings, Connections, Add, then Save | Under Settings → Connections, add a connection, enter its address and port, then save |
| Change the parameter and confirm | Set the current session's query limit to 30 seconds, then query the value |
| Just run this command | Run the command in the project root; the specified file should appear |

Keep menu paths and button names when they help readers locate an action. Combine related small actions instead of removing useful UI details.

## Make the page easy to scan {#f-pattern}

State the goal in the title, put prerequisites before actions, and separate commands from expected output. Use headings for long procedures and place warnings near the relevant action.

F-shaped scanning is one observed reading pattern, not a universal route or a requirement to arrange text in an F. [NNG's explanation](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/) describes several scanning patterns. Check your page with actual readers.

## What a procedure needs {#structure}

Use these as review questions. A short, low-risk task can combine them without a separate heading for every item.

### State the goal {#anatomy-title}

For example, “Check that the JDBC driver loads.” Readers can decide whether it addresses their problem.

### Explain the result and scope {#anatomy-desc}

Say what completing the task proves. Loading a driver does not prove that a database connection works.

### List prerequisites {#anatomy-prerequisites}

Identify tested versions, tools, working directories and permissions. Replace “environment ready” with specific conditions.

### Explain impact before the relevant action {#anatomy-limits}

Describe overwrites, restarts and changes to shared settings before they happen. Keep step-specific limits next to that step.

### Split steps by the actual work {#rule-of-seven}

There is no universal requirement to have at least five steps or at most nine. Group long procedures into meaningful stages such as preparation, execution and verification.

Each step should have a clear purpose. Closely related small actions can share a step. Include the commands, location and feedback the reader needs; do not number every click. See [Google's procedure guidance](https://developers.google.com/style/procedures).

### Make verification executable {#anatomy-verification}

Provide a command or UI location and its expected result. A sample success log is insufficient without the program that produces it.

### Explain failures and recovery {#anatomy-rollback}

Cover common failure causes. For state changes, include recovery steps; disclose irreversible effects before execution.

### Recommend a relevant next task {#anatomy-next}

After driver loading, check the connection URL, authentication and network. Avoid unrelated reading lists.

## Complete example: check that the JDBC driver loads {#example}

This example checks whether Java can load MySQL Connector/J from its classpath. It does not connect to a database. **Connector/J 8.4.0** is a fixed example version, not a claim about the latest release or the version your project should adopt.

**Prerequisites:** a Linux or macOS shell, JDK 8 or later with `java` and `javac`, `curl`, and network access to Maven Central. The example uses the Unix classpath separator; use `;` instead of `:` on Windows.

1. **Create an empty directory and download the example driver.** If the directory exists, choose another name to avoid overwriting files.

   ```bash
   mkdir jdbc-driver-check
   cd jdbc-driver-check
   curl --fail --location --output mysql-connector-j-8.4.0.jar \
     https://repo.maven.apache.org/maven2/com/mysql/mysql-connector-j/8.4.0/mysql-connector-j-8.4.0.jar
   ```

2. **Create the test file.** Save this as `CheckDriver.java` in the current directory.

   ```java
   public class CheckDriver {
       public static void main(String[] args) throws Exception {
           Class.forName("com.mysql.cj.jdbc.Driver");
           System.out.println("Driver loaded");
       }
   }
   ```

3. **Compile and run it.**

   ```bash
   javac CheckDriver.java
   java -cp ".:mysql-connector-j-8.4.0.jar" CheckDriver
   ```

Expected output:

```text
Driver loaded
```

| Result | Check |
| --- | --- |
| Download fails | URL, network and proxy; do not continue with an incomplete file |
| `javac` not found | Whether a JDK is installed and available in the shell |
| `ClassNotFoundException` | JAR filename, directory and classpath separator |
| `Driver loaded` | Driver loading works; database connectivity and authentication remain untested |

All test files stay in the new directory. No database is changed. For use in a project, follow its dependency-management approach; see [Connector/J installation with Maven](https://dev.mysql.com/doc/connector-j/en/connector-j-installing-maven.html).

## Pages, links and navigation {#discussion}

An independent task often deserves its own page. Closely related tasks can form a quickstart. Add on-page navigation to long pages without padding short tasks with empty sections.

Place links where readers need them: prerequisite tasks before execution, parameter definitions by the relevant step, optional background afterward. Required external references should be available at the point of use.

## Review before publishing {#checklist}

- Can readers identify the task and whether it applies to them?
- Are versions, permissions, directories and tools explicit?
- Can the commands run in order, with replacement values identified?
- Does verification support the result the page promises?
- Does recovery guidance match the risk?

Next: [write useful parameter reference entries](./reference.md), or return to [information design](./index.mdx).
