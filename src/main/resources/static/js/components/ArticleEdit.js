const ArticleEdit = {
    name: 'ArticleEdit',

    data() {
        return {
            articleForm: {
                title: '',
                content: '',
                categoryId: '',
                status: 1,  // 默认为发布状态
                authorId: null,
                authorName: ''
            },
            categories: [],
            loading: false,
            isEdit: false,
            rules: {
                title: [
                    { required: true, message: '请输入文章标题', trigger: 'blur' },
                    { min: 2, max: 100, message: '标题长度在 2 到 100 个字符', trigger: 'blur' }
                ],
                content: [
                    { required: true, message: '请输入文章内容', trigger: 'blur' }
                ],
                categoryId: [
                    { required: true, message: '请选择文章分类', trigger: 'change' }
                ]
            }
        }
    },

    template: `
        <div class="article-edit-container" v-loading="loading">
            <el-card class="edit-card">
                <template #header>
                    <div class="edit-header">
                        <h2>{{ isEdit ? '编辑文章' : '发布文章' }}</h2>
                        <div class="header-actions">
                            <el-button 
                                type="info" 
                                plain
                                @click="handleCancel"
                            >
                                取消
                            </el-button>
                            <el-button 
                                type="primary" 
                                @click="saveAsDraft"
                                :loading="loading"
                            >
                                保存草稿
                            </el-button>
                            <el-button 
                                type="success" 
                                @click="publishArticle"
                                :loading="loading"
                            >
                                发布文章
                            </el-button>
                        </div>
                    </div>
                </template>

                <el-form 
                    ref="articleForm"
                    :model="articleForm"
                    :rules="rules"
                    label-position="top"
                    class="article-form"
                >
                    <div class="form-main">
                        <!-- 标题输入 -->
                        <el-form-item prop="title" class="title-input">
                            <el-input
                                v-model="articleForm.title"
                                placeholder="请输入文章标题"
                                size="large"
                                clearable
                            >
                                <template #prefix>
                                    <el-icon><Edit /></el-icon>
                                </template>
                            </el-input>
                        </el-form-item>

                        <!-- 文章内容 -->
                        <el-form-item prop="content" class="content-input">
                            <div class="content-toolbar">
                                <AIAssistant 
                                    :content="articleForm.content"
                                    :onApply="applyAIContent"
                                />
                            </div>
                            
                            <el-input
                                v-model="articleForm.content"
                                type="textarea"
                                :rows="15"
                                placeholder="请输入文章内容"
                                resize="none"
                            />
                        </el-form-item>
                    </div>

                    <!-- 右侧设置面板 -->
                    <div class="form-sidebar">
                        <el-card class="settings-card">
                            <template #header>
                                <div class="settings-header">
                                    <span>文章设置</span>
                                </div>
                            </template>
                            
                            <el-form-item label="文章分类" prop="categoryId">
                                <el-select
                                    v-model="articleForm.categoryId"
                                    placeholder="请选择分类"
                                    class="category-select"
                                >
                                    <el-option
                                        v-for="category in categories"
                                        :key="category.id"
                                        :label="category.name"
                                        :value="category.id"
                                    />
                                </el-select>
                            </el-form-item>

                            <el-form-item label="发布状态">
                                <el-radio-group v-model="articleForm.status">
                                    <el-radio :label="1">立即发布</el-radio>
                                    <el-radio :label="0">保存草稿</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-card>
                    </div>
                </el-form>
            </el-card>
        </div>
    `,

    created() {
        // 设置作者信息
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        this.articleForm.authorId = user.id;
        this.articleForm.authorName = user.nickname || user.username;

        this.loadCategories();
        const id = this.$route.params.id;
        if (id) {
            this.isEdit = true;
            this.loadArticle(id);
        }
    },

    methods: {
        async loadCategories() {
            try {
                const response = await categoryApi.list();
                this.categories = response.data.data;
            } catch (error) {
                console.error('加载分类失败:', error);
                ElMessage.error('加载分类失败');
            }
        },

        async loadArticle(id) {
            try {
                const response = await articleApi.getById(id);
                if (response.data.code === 200) {
                    this.articleForm = response.data.data;
                } else {
                    ElMessage.error(response.data.message || '加载文章失败');
                }
            } catch (error) {
                console.error('加载文章失败:', error);
                ElMessage.error('加载文章失败');
            }
        },

        async handleSubmit(status) {
            if (!this.articleForm.title.trim()) {
                ElMessage.warning('请输入文章标题');
                return;
            }
            if (!this.articleForm.categoryId) {
                ElMessage.warning('请选择文章分类');
                return;
            }
            if (!this.articleForm.content.trim()) {
                ElMessage.warning('请输入文章内容');
                return;
            }

            this.loading = true;
            try {
                this.articleForm.status = status;  // 设置文章状态

                // 确保作者信息存在
                if (!this.articleForm.authorId) {
                    const user = JSON.parse(localStorage.getItem('user') || '{}');
                    this.articleForm.authorId = user.id;
                    this.articleForm.authorName = user.nickname || user.username;
                }

                let response;
                if (this.isEdit) {
                    response = await articleApi.update(this.$route.params.id, this.articleForm);
                } else {
                    response = await articleApi.create(this.articleForm);
                }

                if (response.data.code === 200) {
                    ElMessage.success(status === 1 ?
                        (this.isEdit ? '保存成功' : '发布成功') :
                        '已保存为草稿');
                    this.$router.push('/home');
                } else {
                    ElMessage.error(response.data.message || (this.isEdit ? '保存失败' : '发布失败'));
                }
            } catch (error) {
                console.error(this.isEdit ? '保存文章失败:' : '发布文章失败:', error);
                ElMessage.error(this.isEdit ? '保存失败' : '发布失败');
            }
            this.loading = false;
        },

        handleCancel() {
            this.$router.back();
        },

        saveAsDraft() {
            this.handleSubmit(0);
        },

        publishArticle() {
            this.handleSubmit(1);
        },
        
        // AI助手相关方法
        applyAIContent(content) {
            this.articleForm.content = content;
        }
    }
}; 