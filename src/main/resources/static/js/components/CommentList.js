const CommentList = {
    name: 'CommentList',

    props: {
        articleId: {
            type: Number,
            required: true
        }
    },

    data() {
        return {
            comments: [],
            loading: false,
            commentForm: {
                content: ''
            },
            currentUser: null
        }
    },

    created() {
        this.currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        this.loadComments();
    },

    computed: {
        isAdmin() {
            return this.currentUser.role === 'ADMIN';
        }
    },

    template: `
        <div class="comment-section">
            <h3>评论区</h3>
            
            <!-- 发表评论 -->
            <div class="comment-form">
                <el-form :model="commentForm" @submit.prevent="submitComment">
                    <el-form-item>
                        <el-input
                            v-model="commentForm.content"
                            type="textarea"
                            :rows="3"
                            placeholder="写下你的评论...">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitComment" :loading="loading">
                            发表评论
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>

            <!-- 评论列表 -->
            <div class="comment-list" v-loading="loading">
                <el-empty v-if="comments.length === 0" description="暂无评论">{{comments.length}}</el-empty>
                <div v-else class="comment-item" v-for="comment in comments" :key="comment.id">
                    <div class="comment-header">
                        <span class="author">{{ comment.authorName }}</span>
<!--                        <span class="time">{{ formatTime(comment.createTime) }}</span>-->
                    </div>
                    <div class="comment-content">{{ comment.content }}</div>
                    <div class="comment-actions" v-if="canManageComment(comment)">
                        <el-button type="text" @click="deleteComment(comment.id)">
                            <el-icon><Delete /></el-icon>
                            删除
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
    `,

    methods: {
        async loadComments() {
            this.loading = true;
            try {
                const response = await commentApi.list(this.articleId);
                if (response.data.code === 200) {
                    this.comments = response.data.data;
                    console.log(333,this.comments)
                } else {
                    ElMessage.error(response.data.message || '加载评论失败');
                }
            } catch (error) {
                ElMessage.error('加载评论失败');
            }
            this.loading = false;
        },

        async submitComment() {
            if (!this.commentForm.content.trim()) {
                ElMessage.warning('请输入评论内容');
                return;
            }

            this.loading = true;
            try {
                const comment = {
                    articleId: this.articleId,
                    content: this.commentForm.content.trim(),
                    authorId: this.currentUser.id,
                    userId:JSON.parse(localStorage.getItem('user') || '{}').id,
                    authorName: this.currentUser.nickname || this.currentUser.username
                };

                const response = await commentApi.create(comment);
                if (response.data.code === 200) {
                    ElMessage.success('评论成功');
                    this.commentForm.content = '';
                    this.loadComments();
                } else {
                    ElMessage.error(response.data.message || '评论失败');
                }
            } catch (error) {
                console.error('提交评论失败:', error);
                ElMessage.error('评论失败');
            }
            this.loading = false;
        },

        async deleteComment(commentId) {
            try {
                await ElMessageBox.confirm('确定要删除这条评论吗？', '提示', {
                    type: 'warning'
                });

                const response = await commentApi.delete(commentId);
                if (response.data.code === 200) {
                    ElMessage.success('删除成功');
                    this.loadComments();
                } else {
                    ElMessage.error(response.data.message || '删除失败');
                }
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('删除评论失败:', error);
                    ElMessage.error('删除失败');
                }
            }
        },

        canManageComment(comment) {
            // 管理员可以管理所有评论，普通用户只能管理自己的评论
            console.log(comment)
            console.log(comment.userId, this.currentUser.id)
            return this.isAdmin || comment.userId === this.currentUser.id;
        },

        formatTime(time) {
            return new Date(time).toLocaleString();
        }
    }
}; 