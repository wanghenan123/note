const CategoryManage = {
    name: 'CategoryManage',

    data() {
        return {
            categories: [],
            loading: false,
            dialogVisible: false,
            dialogTitle: '',
            form: {
                name: '',
                description: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                ],
                description: [
                    { max: 200, message: '描述不能超过200个字符', trigger: 'blur' }
                ]
            },
            editingId: null
        }
    },

    template: `
        <div class="category-manage-container" v-loading="loading">
            <!-- 页面标题和操作按钮 -->
            <div class="manage-header">
                <div class="header-left">
                    <h2>分类管理</h2>
                    <span class="back-home" @click="goToHome">返回首页</span>
                </div>
                <el-button 
                    type="primary" 
                    @click="showAddDialog"
                >
                    <el-icon><Plus /></el-icon>
                    添加分类
                </el-button>
            </div>

            <!-- 分类列表 -->
            <div class="category-list-container">
                <el-table 
                    :data="categories"
                    style="width: 100%"
                    border
                    stripe
                >
                    <el-table-column 
                        prop="id" 
                        label="ID" 
                        width="80" 
                        align="center"
                    />
                    <el-table-column 
                        prop="name" 
                        label="分类名称"
                        min-width="150"
                    >
                        <template #default="{ row }">
                            <div class="category-name">
                                <el-icon><Folder /></el-icon>
                                <span>{{ row.name }}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column 
                        prop="description" 
                        label="描述"
                        min-width="200"
                        show-overflow-tooltip
                    />
                    <el-table-column 
                        label="操作" 
                        width="200"
                        align="center"
                    >
                        <template #default="{ row }">
                            <el-button 
                                type="primary" 
                                link
                                @click="showEditDialog(row)"
                            >
                                <el-icon><Edit /></el-icon>
                                编辑
                            </el-button>
                            <el-button 
                                type="danger" 
                                link
                                @click="handleDelete(row)"
                            >
                                <el-icon><Delete /></el-icon>
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <!-- 添加/编辑分类弹窗 -->
            <el-dialog
                v-model="dialogVisible"
                :title="dialogTitle"
                width="500px"
                custom-class="category-dialog"
                :close-on-click-modal="false"
                @closed="resetForm"
            >
                <el-form
                    ref="categoryForm"
                    :model="form"
                    :rules="rules"
                    label-position="top"
                    class="category-form"
                >
                    <el-form-item 
                        label="分类名称" 
                        prop="name"
                    >
                        <el-input
                            v-model="form.name"
                            placeholder="请输入分类名称"
                            clearable
                        >
                            <template #prefix>
                                <el-icon><Folder /></el-icon>
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item 
                        label="分类描述" 
                        prop="description"
                    >
                        <el-input
                            v-model="form.description"
                            type="textarea"
                            :rows="4"
                            placeholder="请输入分类描述"
                            resize="none"
                        />
                    </el-form-item>
                </el-form>

                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="dialogVisible = false">取消</el-button>
                        <el-button 
                            type="primary" 
                            @click="handleSubmit"
                            :loading="loading"
                        >
                            确认
                        </el-button>
                    </div>
                </template>
            </el-dialog>
        </div>
    `,

    created() {
        this.loadCategories();
    },

    methods: {
        goToHome() {
            this.$router.push('/home');
        },

        async loadCategories() {
            this.loading = true;
            try {
                const response = await categoryApi.list();
                if (response.data.code === 200) {
                    this.categories = response.data.data;
                } else {
                    ElMessage.error(response.data.message || '加载分类失败');
                }
            } catch (error) {
                console.error('加载分类失败:', error);
                ElMessage.error('加载分类失败');
            }
            this.loading = false;
        },

        showAddDialog() {
            this.dialogTitle = '添加分类';
            this.form = {
                name: '',
                description: ''
            };
            this.editingId = null;
            this.dialogVisible = true;
        },

        showEditDialog(category) {
            this.dialogTitle = '编辑分类';
            this.form = {
                name: category.name,
                description: category.description
            };
            this.editingId = category.id;
            this.dialogVisible = true;
        },

        async handleSubmit() {
            if (!this.form.name.trim()) {
                ElMessage.warning('请输入分类名称');
                return;
            }

            this.loading = true;
            try {
                let response;
                if (this.editingId) {
                    response = await categoryApi.update(this.editingId, this.form);
                } else {
                    response = await categoryApi.create(this.form);
                }

                if (response.data.code === 200) {
                    ElMessage.success(this.editingId ? '更新成功' : '添加成功');
                    this.dialogVisible = false;
                    this.loadCategories();
                } else {
                    ElMessage.error(response.data.message || (this.editingId ? '更新失败' : '添加失败'));
                }
            } catch (error) {
                console.error(this.editingId ? '更新分类失败:' : '添加分类失败:', error);
                ElMessage.error(this.editingId ? '更新失败' : '添加失败');
            }
            this.loading = false;
        },

        async handleDelete(category) {
            try {
                await ElMessageBox.confirm(
                    '删除分类将会同时删除该分类下的所有文章，是否继续？',
                    '警告',
                    {
                        type: 'warning',
                        confirmButtonText: '确定',
                        cancelButtonText: '取消'
                    }
                );

                const response = await categoryApi.delete(category.id);
                if (response.data.code === 200) {
                    ElMessage.success('删除成功');
                    this.loadCategories();
                } else {
                    ElMessage.error(response.data.message || '删除失败');
                }
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('删除分类失败:', error);
                    ElMessage.error('删除失败');
                }
            }
        },

        resetForm() {
            this.form = {
                name: '',
                description: ''
            };
            this.editingId = null;
        }
    }
}; 