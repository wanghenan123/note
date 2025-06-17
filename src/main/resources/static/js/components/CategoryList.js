const CategoryList = {
    name: 'CategoryList',

    props: {
        categories: {
            type: Array,
            required: true
        }
    },

    template: `
        <div class="category-list">
            <el-card>            
                <el-menu 
                    :default-active="activeCategory" 
                    @select="handleSelect">
                  
                    <el-menu-item index="0">
                        <el-icon><List /></el-icon>
                        全部文章
                    </el-menu-item>
                    <el-menu-item 
                        v-for="category in categories" 
                        :key="category.id"
                        :index="category.id.toString()">
                        <el-icon><Folder /></el-icon>
                        {{ category.name }}
                    </el-menu-item>
                </el-menu>
            </el-card>
        </div>
    `,

    data() {
        return {
            activeCategory: '0'
        }
    },

    computed: {
        isAdmin() {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            console.log('CategoryList - user:', user);
            console.log('CategoryList - isAdmin:', user.role === 'ADMIN');
            return user.role === 'ADMIN';
        }
    },

    created() {
        const categoryId = this.$route.query.category;
        if (categoryId) {
            this.activeCategory = categoryId.toString();
        }
    },

    methods: {
        handleSelect(index) {
            this.activeCategory = index;
            this.$emit('select', index === '0' ? null : Number(index));
        }
    }
}; 