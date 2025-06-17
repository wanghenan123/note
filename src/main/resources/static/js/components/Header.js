const Header = {
    name: 'Header',
    props: {
        user: {
            type: Object,
            required: true
        }
    },

    created() {
        console.log('Header created - user:', this.user);
        console.log('Header created - user role:', this.user?.role);
    },

    mounted() {
        console.log('Header mounted, user:', this.user);
    },

    template: `
        <div class="header">
            <div class="logo">
                <h1>云笔记知识分享平台</h1>
            </div>
            <div class="user-info">
                <el-dropdown trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{ user.nickname || user.username }}
                        <el-icon><ArrowDown /></el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                            <el-dropdown-item v-if="isAdmin" command="category">分类管理</el-dropdown-item>
                            <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    `,

    computed: {
        isAdmin() {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            return user.role === 'ADMIN';
        }
    },

    methods: {
        handleCommand(command) {
            if (command === 'logout') {
                this.$emit('logout');
            } else if (command === 'profile') {
                this.$router.push('/profile');
            } else if (command === 'category') {
                this.$router.push('/category/manage');
            }
        }
    }
}; 