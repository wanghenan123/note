const ArticleList = {
    name: 'ArticleList',

    data() {
        return {
            articles: [],
            isAdmin: false,
            loading: false,
            currentCategory: null,
            status: 1,
            sortBy: 'default',
            categories: [],
            selectedCategory: null,
            // 修改导航菜单数据
            navItems: [
                { id: 1, name: '知识交流', icon: 'Reading' },
                { id: 2, name: '文章管理', icon: 'Document', requireAuth: true },
            ],
            activeNavItem: 1,
            carouselItems: [
                {
                    id: 1,
                    image: 'images/1.jpg',
                    title: '数字时代的高效知识管家',
                    description: '深入探索云笔记在数字时代的核心优势'
                },
                {
                    id: 2,
                    image: 'images/2.jpg',
                    title: '开启便捷知识之旅',
                    description: '为你展现从灵感捕捉到知识体系搭建的全过程'
                },
                {
                    id: 3,
                    image: 'images/3.jpg',
                    title: '解锁云笔记的无限可能',
                    description: '致力于为你解锁云笔记的多样用途'
                }
            ],
            searchKeyword: '',
            searchTimer: null
        }
    },

    computed: {
        // 计算显示的导航项
        displayNavItems() {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            let items = this.navItems.filter(item => {
                // 如果需要权限且用户未登录，则不显示
                if (item.requireAuth && !user.id) {
                    return false;
                }
                return true;
            });

            // 如果是管理员，添加分类管理选项
            if (user.role === 'ADMIN') {
                items.push({
                    id: 5,
                    name: '分类管理',
                    icon: 'Setting'
                });
            }
            return items;
        },
        emptyText() {
            return this.status === 0 ? '暂无草稿' : '暂无已发布的文章';
        },
        sortedArticles() {
            if (this.activeNavItem !== 1 || this.sortBy === 'default') {
                return this.articles;
            }

            return [...this.articles].sort((a, b) => {
                switch (this.sortBy) {
                    case 'likes':
                        return b.likeCount - a.likeCount;
                    case 'views':
                        return b.viewCount - a.viewCount;
                    default:
                        return 0;
                }
            });
        },
        filteredArticles() {
            let articles = this.sortedArticles;
            if (this.selectedCategory) {
                articles = articles.filter(article => article.categoryId === this.selectedCategory);
            }
            return articles;
        }
    },

    created() {
        // 确保在组件创建时加载分类
        this.loadCategories();
        // 从 URL 获取导航 ID
        const navId = Number(this.$route.query.nav) || 1;
        this.activeNavItem = navId;
        this.handleNavClick(navId, true);
    },

    template: `
        <div class="home-container">
            <!-- 导航栏 -->
            <div class="nav-bar">
                <div class="nav-menu">
                    <div v-for="item in displayNavItems" 
                         :key="item.id"
                         :class="['nav-item', { active: activeNavItem === item.id }]"
                         @click="handleNavClick(item.id)">
                        <el-icon><component :is="item.icon" /></el-icon>
                        <span>{{ item.name }}</span>
                    </div>
                    <div class="nav-actions">
                        <a class="nav-link" @click="goToLogin">
                            <el-icon><SwitchButton /></el-icon>
                            退出登录
                        </a>
                    </div>
                </div>
            </div>

            <!-- 轮播图 - 仅在首页显示 -->
            <div class="carousel-section" v-if="activeNavItem === 1">
                <el-carousel :interval="4000" type="card" height="400px">
                    <el-carousel-item v-for="item in carouselItems" :key="item.id">
                        <div class="carousel-content">
                            <img :src="item.image" :alt="item.title">
                            <div class="carousel-info">
                                <h2>{{ item.title }}</h2>
                                <p>{{ item.description }}</p>
                            </div>
                        </div>
                    </el-carousel-item>
                </el-carousel>
            </div>

            <!-- 内容区域 -->
            <div class="content-section">
                <div v-if="activeNavItem === 1" class="filter-bar">
                    <!-- 搜索框 -->
                    <div class="search-box">
                        <el-input
                            v-model="searchKeyword"
                            placeholder="搜索文章标题..."
                            clearable
                            @keyup.enter="handleSearch"
                        >
                            <template #prefix>
                                <el-icon><Search /></el-icon>
                            </template>
                            <template #append>
                                <el-button type="primary" @click="handleSearch">
                                    <el-icon><Search /></el-icon>
                                    搜索
                                </el-button>
                            </template>
                        </el-input>
                    </div>
                    
                    <!-- 分类选择 -->
                    <el-select
                        v-model="selectedCategory"
                        placeholder="选择文章分类"
                        clearable
                        class="category-select"
                        @change="handleCategoryChange"
                    >
                        <!-- 添加全部选项 -->
                        <el-option
                            label="全部分类"
                            value=""
                        >
                            <div class="category-option">
                                <el-icon><Collection /></el-icon>
                                <span>全部分类</span>
                            </div>
                        </el-option>
                        <!-- 分类列表选项 -->
                        <el-option
                            v-for="category in categories"
                            :key="category.id"
                            :label="category.name"
                            :value="category.id"
                        >
                            <div class="category-option">
                                <el-icon><Folder /></el-icon>
                                <span>{{ category.name }}</span>
                            </div>
                        </el-option>
                    </el-select>

                    <!-- 排序选项 -->
                    <div class="sort-section">
                        <el-radio-group v-model="sortBy" size="large">
                            <el-radio-button label="default">默认排序</el-radio-button>
                            <el-radio-button label="likes">按点赞数</el-radio-button>
                            <el-radio-button label="views">按阅读量</el-radio-button>
                        </el-radio-group>
                    </div>
                </div>

                <!-- 文章管理页面 -->
                <template v-if="activeNavItem === 2">
                    <div class="article-manage-header">
<!--                        <h2>文章管理</h2>-->
                        <el-button type="primary" @click="createArticle">
                            <el-icon><Plus /></el-icon>
                            写文章
                        </el-button>
                    </div>
                    <el-tabs v-model="status" @tab-click="handleStatusChange">
                        <el-tab-pane :label="'已发布'" :name="1"></el-tab-pane>
                        <el-tab-pane :label="'草稿箱'" :name="0"></el-tab-pane>
                    </el-tabs>
                </template>

                <!-- 文章列表 -->
                <div class="article-list">
                    <el-empty v-if="filteredArticles.length === 0" :description="emptyText"></el-empty>
                    <div v-else v-for="article in filteredArticles" :key="article.id" class="article-item">
                        <el-card shadow="hover">
                            <template #header>
                                <div class="article-title">
                                    <h3>{{ article.title }}</h3>
                                    <div class="article-meta">
                                        <span>
                                            <el-icon><User /></el-icon>
                                            {{ article.authorName }}
                                        </span>
                                        <span>
                                            <el-icon><View /></el-icon>
                                            {{ article.viewCount }} 阅读
                                        </span>
                                        <span>
                                            <el-icon><Star /></el-icon>
                                            {{ article.likeCount }} 点赞
                                        </span>
                                        <span v-if="article.status === 0" class="draft-tag">草稿</span>
                                    </div>
                                </div>
                            </template>
                            
                            <div class="article-content">{{ article.content }}</div>
                            
                            <div class="article-footer">
                                <el-button type="primary" @click="viewArticle(article.id)">
                                    <el-icon><View /></el-icon>
                                    查看
                                </el-button>
                                <el-button 
                                    v-if="activeNavItem === 1" 
                                    type="primary" 
                                    @click="likeArticle(article.id)"
                                >
                                    <el-icon><Star /></el-icon>
                                    点赞
                                </el-button>
                                <template v-if="(activeNavItem === 2 || activeNavItem === 3) && canEdit(article)">
                                    <el-button type="primary" @click="editArticle(article.id)">
                                        <el-icon><Edit /></el-icon>
                                        编辑
                                    </el-button>
                                    <el-button type="danger" @click="deleteArticle(article.id)">
                                        <el-icon><Delete /></el-icon>
                                        删除
                                    </el-button>
                                </template>
                            </div>
                        </el-card>
                    </div>
                </div>
            </div>
        </div>
    `,

    methods: {
        goToLogin() {
            localStorage.removeItem('user');
            this.$router.push('/login');
            ElMessage.success('已退出登录');
        },

        canEdit(article) {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            return article && (user.id === article.authorId || user.role === 'ADMIN');
        },
        async handleNavClick(id, isInitial = false) {
            if (!isInitial) {
                this.$router.push({ query: { ...this.$route.query, nav: id } });
            }
            this.activeNavItem = id;

            // 切换到养生交流页面时重新加载分类
            if (id === 1) {
                await this.loadCategories();
            }

            switch (id) {
                case 2: // 文章管理
                    this.status = 1; // 默认显示已发布的文章
                    await this.loadArticles();
                    break;
                case 5: // 分类管理
                    this.$router.push('/category/manage');
                    break;
                default:
                    this.status = 1;
                    await this.loadArticles();
            }
        },

        async loadCategories() {
            try {
                const response = await categoryApi.list();
                if (response.data.code === 200) {
                    // 确保categories是一个数组
                    this.categories = Array.isArray(response.data.data) ? response.data.data : [];
                    console.log('加载的分类列表:', this.categories); // 添加调试日志
                } else {
                    ElMessage.warning('加载分类失败');
                }
            } catch (error) {
                console.error('加载分类失败:', error);
                ElMessage.error('加载分类列表失败');
            }
        },

        handleCategoryChange(value) {
            console.log('选择的分类ID:', value);
            this.selectedCategory = value || null; // 当选择全部或清空时，设置为 null
            this.loadArticles();
        },

        async loadArticles() {
            this.loading = true;
            try {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                const params = {
                    categoryId: this.selectedCategory || null,
                    status: this.status,
                    authorId: this.activeNavItem === 2 ? user.id : null,
                    keyword: this.searchKeyword || null  // 添加搜索关键词参数
                };

                const response = await articleApi.list(params);
                if (response.data.code === 200) {
                    this.articles = response.data.data;
                    if (this.activeNavItem === 1) {
                        this.sortBy = 'default';
                    }
                } else {
                    ElMessage.error(response.data.message || '加载文章失败');
                }
            } catch (error) {
                console.error('加载文章列表失败:', error);
                ElMessage.error('加载文章列表失败');
            }
            this.loading = false;
        },

        formatTime(time) {
            return new Date(time).toLocaleString();
        },
        async likeArticle(id) {
            try {
                const response = await articleApi.like(id);
                if (response.data.code === 200) {
                    ElMessage.success('点赞成功');
                    this.loadArticles();
                } else {
                    ElMessage.error(response.data.message || '点赞失败');
                }
            } catch (error) {
                console.error('点赞失败:', error);
                ElMessage.error('点赞失败');
            }
        },

        viewArticle(id) {
            this.$router.push(`/article/${id}`);
        },

        createArticle() {
            this.$router.push('/article/create');
        },

        editArticle(id) {
            this.$router.push(`/article/edit/${id}`);
        },

        async deleteArticle(id) {
            try {
                await ElMessageBox.confirm('确定要删除这篇文章吗？', '提示', {
                    type: 'warning'
                });

                const response = await articleApi.delete(id);
                if (response.data.code === 200) {
                    ElMessage.success('删除成功');
                    this.loadArticles();
                } else {
                    ElMessage.error(response.data.message || '删除失败');
                }
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('删除文章失败:', error);
                    ElMessage.error('删除失败');
                }
            }
        },

        handleStatusChange() {
            console.log('Status changed to:', this.status);
            this.loadArticles();
        },

        showCategoryManage() {
            this.$router.push('/category/manage');
        },

        handleSearch() {
            // 添加防抖，避免频繁请求
            if (this.searchTimer) {
                clearTimeout(this.searchTimer);
            }
            this.searchTimer = setTimeout(() => {
                this.loadArticles();
            }, 300);
        }
    }
}; 