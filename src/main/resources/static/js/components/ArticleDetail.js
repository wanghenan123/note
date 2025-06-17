const ArticleDetail = {
    name: 'ArticleDetail',

    data() {
        return {
            article: null,
            loading: false
        }
    },

    template: `
        <div class="article-detail" v-loading="loading">
            <el-card v-if="article" class="article-main-card">
                <!-- 文章头部信息 -->
                <div class="article-detail-header">
                    <h1 class="article-title">{{ article.title }}</h1>
                    <div class="article-info">
                        <div class="author-info">
                            <el-avatar :size="40" :src="article.authorAvatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"></el-avatar>
                            <span class="author-name">{{ article.authorName }}</span>
                        </div>
                        <div class="article-stats">
<!--                            <el-tag size="small" effect="plain" type="info">-->
<!--                                <el-icon><Timer /></el-icon>-->
<!--                                {{ formatTime(article.createTime) }}-->
<!--                            </el-tag>-->
                            <el-tag size="small" effect="plain" type="success">
                                <el-icon><View /></el-icon>
                                {{ article.viewCount }} 阅读
                            </el-tag>
                            <el-tag size="small" effect="plain" type="warning">
                                <el-icon><Star /></el-icon>
                                {{ article.likeCount }} 点赞
                            </el-tag>
                        </div>
                    </div>
                </div>

                <!-- 文章内容 -->
                <div class="article-detail-content">
                    <div class="content-wrapper">
                        {{ article.content }}
                    </div>
                </div>

                <!-- 文章操作栏 -->
                <div class="article-actions">
                    <div class="action-group">
                        <el-button 
                            type="primary" 
                            :icon="Star"
                            round
                            @click="handleLike"
                        >
                            点赞 {{ article.likeCount }}
                        </el-button>
                    </div>
                </div>

                <!-- 分割线 -->
                <el-divider>
                    <el-icon><ChatDotRound /></el-icon>
                    评论区
                </el-divider>

                <!-- 评论区 -->
                <div class="article-comments">
                    <CommentList :article-id="Number($route.params.id)"></CommentList>
                </div>
            </el-card>

            <!-- 右侧信息栏 -->
            <div class="article-sidebar">
                <el-affix :offset="80">
                    <el-card class="author-card">
                        <template #header>
                            <div class="author-header">
                                <span>关于作者</span>
                            </div>
                        </template>
                        <div class="author-content">
                            <el-avatar 
                                :size="60" 
                                :src="article?.authorAvatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
                            ></el-avatar>
                            <h3>{{ article?.authorName }}</h3>
                            <p class="author-description">
                                专注于高质量笔记分享
                            </p>
                        </div>
                    </el-card>
                </el-affix>
            </div>
        </div>
    `,

    computed: {
        canEdit() {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            return this.article && (user.id === this.article.authorId || user.role === 'ADMIN');
        }
    },

    created() {
        this.loadArticle();
    },

    methods: {
        async loadArticle() {
            this.loading = true;
            try {
                const id = this.$route.params.id;
                const response = await articleApi.getById(id);
                if (response.data.code === 200) {
                    this.article = response.data.data;
                } else {
                    ElMessage.error(response.data.message || '加载文章失败');
                }
            } catch (error) {
                console.error('加载文章失败:', error);
                ElMessage.error('加载文章失败');
            }
            this.loading = false;
        },

        formatTime(time) {
            return new Date(time).toLocaleString();
        },

        async handleLike() {
            try {
                const response = await articleApi.like(this.article.id);
                if (response.data.code === 200) {
                    ElMessage.success('点赞成功');
                    this.loadArticle();
                } else {
                    ElMessage.error(response.data.message || '点赞失败');
                }
            } catch (error) {
                console.error('点赞失败:', error);
                ElMessage.error('点赞失败');
            }
        },

        handleEdit() {
            this.$router.push(`/article/edit/${this.article.id}`);
        },

        async handleDelete() {
            try {
                await ElMessageBox.confirm('确定要删除这篇文章吗？', '提示', {
                    type: 'warning'
                });

                const response = await articleApi.delete(this.article.id);
                if (response.data.code === 200) {
                    ElMessage.success('删除成功');
                    this.$router.push('/home');
                } else {
                    ElMessage.error(response.data.message || '删除失败');
                }
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('删除文章失败:', error);
                    ElMessage.error('删除失败');
                }
            }
        }
    }
}; 