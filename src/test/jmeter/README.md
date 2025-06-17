# JMeter测试说明

本目录包含用于测试笔记应用API的JMeter测试计划。

## 测试计划文件

- `note-api-test-plan.jmx`: 用户API测试计划，包括用户注册、登录和获取用户信息的测试
- `article-api-test-plan.jmx`: 文章API测试计划，包括创建、获取、更新文章的测试

## 运行测试

### 使用Maven运行

在项目根目录下执行以下命令运行所有JMeter测试：

```bash
mvn clean verify jmeter:configure jmeter:jmeter
```

或者可以一步执行：

```bash
mvn clean verify
```

因为JMeter插件已配置在Maven构建生命周期中，`configure`目标会在测试前自动执行。

### 运行特定测试计划

指定特定的测试计划文件：

```bash
# 确保首先执行configure目标
mvn jmeter:configure jmeter:jmeter -Djmeter.test.file=note-api-test-plan.jmx
```

或者

```bash
mvn jmeter:configure jmeter:jmeter -Djmeter.test.file=article-api-test-plan.jmx
```

### 自定义主机和端口

如果应用程序运行在非默认主机或端口上，可以通过以下方式指定：

```bash
mvn jmeter:configure jmeter:jmeter -Dapplication.host=192.168.1.100 -Dapplication.port=9090
```

## 查看测试结果

测试执行后，结果将保存在 `target/jmeter/results` 目录下。可以使用JMeter GUI查看这些结果文件，或者查看生成的HTML报告。

### 生成HTML报告

要生成HTML格式的测试报告，执行：

```bash
mvn jmeter:results -Djmeter.reportgenerator.report.output.directory=target/jmeter/html-report
```

然后可以在浏览器中打开 `target/jmeter/html-report/index.html` 查看详细的测试报告。

## 使用JMeter GUI

如果需要使用JMeter GUI来编辑测试计划或运行测试，可以按照以下步骤操作：

1. 下载并安装JMeter (https://jmeter.apache.org/download_jmeter.cgi)
2. 启动JMeter GUI：`bin/jmeter.bat` (Windows) 或 `bin/jmeter.sh` (Linux/Mac)
3. 通过"文件" > "打开"菜单加载测试计划文件
4. 根据需要修改测试计划
5. 点击运行按钮执行测试

## 注意事项

- 确保在运行测试前，应用程序已经启动并正常运行
- 测试计划中使用的端点路径应与应用程序实际API路径一致
- 测试数据（如用户名、密码等）仅用于测试目的 