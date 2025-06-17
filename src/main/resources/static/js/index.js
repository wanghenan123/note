// 导入API
const apiFiles = [
    'api/user.js',
    'api/article.js',
    'api/category.js',
    'api/comment.js',
    'api/ai-assistant.js'  // 添加AI助手API
];

// 导入组件
const componentFiles = [
    'components/Login.js',
    'components/Register.js',
    'components/ArticleList.js',
    'components/ArticleDetail.js',
    'components/ArticleEdit.js',
    'components/CategoryManage.js',
    'components/CommentList.js',
    'components/AIAssistant.js'  // 添加AI助手组件
];

// 注册组件
app.component('Login', Login);
app.component('Register', Register);
app.component('ArticleList', ArticleList);
app.component('ArticleDetail', ArticleDetail);
app.component('ArticleEdit', ArticleEdit);
app.component('CategoryManage', CategoryManage);
app.component('CommentList', CommentList);
app.component('AIAssistant', AIAssistant);  // 注册AI助手组件 