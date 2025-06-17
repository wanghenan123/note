#!/bin/bash

# 性能测试脚本，用于批量运行JMeter测试

# 确保脚本在出错时退出
set -e

# 定义变量
APP_HOST="localhost"
APP_PORT="8080"
TEST_DURATION=60  # 测试持续时间（秒）
RAMP_UP=10        # 线程启动时间（秒）
THREADS_USER_API=50   # 用户API测试的线程数
THREADS_ARTICLE_API=30 # 文章API测试的线程数

# 显示帮助信息
show_help() {
    echo "用法: $0 [选项]"
    echo "选项:"
    echo "  -h, --host        应用程序主机 (默认: localhost)"
    echo "  -p, --port        应用程序端口 (默认: 8080)"
    echo "  -d, --duration    测试持续时间，单位秒 (默认: 60)"
    echo "  -r, --rampup      线程启动时间，单位秒 (默认: 10)"
    echo "  -u, --users       用户API测试的线程数 (默认: 50)"
    echo "  -a, --articles    文章API测试的线程数 (默认: 30)"
    echo "  -h, --help        显示此帮助信息"
    exit 0
}

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        -h|--host)
            APP_HOST="$2"
            shift 2
            ;;
        -p|--port)
            APP_PORT="$2"
            shift 2
            ;;
        -d|--duration)
            TEST_DURATION="$2"
            shift 2
            ;;
        -r|--rampup)
            RAMP_UP="$2"
            shift 2
            ;;
        -u|--users)
            THREADS_USER_API="$2"
            shift 2
            ;;
        -a|--articles)
            THREADS_ARTICLE_API="$2"
            shift 2
            ;;
        --help)
            show_help
            ;;
        *)
            echo "未知选项: $1"
            show_help
            ;;
    esac
done

echo "========== 性能测试开始 =========="
echo "应用程序主机: $APP_HOST"
echo "应用程序端口: $APP_PORT"
echo "测试持续时间: $TEST_DURATION 秒"
echo "线程启动时间: $RAMP_UP 秒"
echo "用户API线程数: $THREADS_USER_API"
echo "文章API线程数: $THREADS_ARTICLE_API"
echo "=================================="

# 创建测试结果目录
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RESULTS_DIR="../../target/jmeter/results_$TIMESTAMP"
mkdir -p $RESULTS_DIR

# 首先执行configure目标
echo "配置JMeter环境..."
mvn jmeter:configure

# 运行用户API测试
echo "运行用户API测试..."
mvn jmeter:jmeter \
    -Djmeter.test.file=note-api-test-plan.jmx \
    -Dapplication.host=$APP_HOST \
    -Dapplication.port=$APP_PORT \
    -Dthreads=$THREADS_USER_API \
    -Drampup=$RAMP_UP \
    -Dduration=$TEST_DURATION \
    -Djmeter.reportgenerator.report.output.directory=$RESULTS_DIR/user_api_report

# 运行文章API测试
echo "运行文章API测试..."
mvn jmeter:jmeter \
    -Djmeter.test.file=article-api-test-plan.jmx \
    -Dapplication.host=$APP_HOST \
    -Dapplication.port=$APP_PORT \
    -Dthreads=$THREADS_ARTICLE_API \
    -Drampup=$RAMP_UP \
    -Dduration=$TEST_DURATION \
    -Djmeter.reportgenerator.report.output.directory=$RESULTS_DIR/article_api_report

# 生成HTML报告
echo "生成HTML报告..."
mvn jmeter:results \
    -Djmeter.reportgenerator.report.output.directory=$RESULTS_DIR/html_report

echo "========== 性能测试完成 =========="
echo "测试结果保存在: $RESULTS_DIR"
echo "HTML报告路径: $RESULTS_DIR/html_report/index.html"
echo "=================================="