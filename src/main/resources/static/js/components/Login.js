const Login = {
    name: 'Login',
    data() {
        return {
            loginForm: {
                username: '',
                password: ''
            },
            loading: false,
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
                ]
            }
        }
    },

    template: `
        <div class="login-container">
            <div class="login-box">
                <div class="login-left">
                    <div class="login-welcome">
                        <h1>欢迎来到</h1>
                        <h2>云笔记知识分享平台</h2>
                        <p>借助云笔记便捷特性，随时汲取养生知识养分</p>
                    </div>
                </div>
                
                <div class="login-right">
                    <div class="login-form-container">
                        <h3>用户登录</h3>
                        <el-form 
                            class="login-form" 
                            :model="loginForm" 
                            :rules="rules" 
                            ref="loginForm"
                        >
                            <el-form-item prop="username">
                                <el-input 
                                    v-model="loginForm.username"
                                    placeholder="请输入用户名"
                                    prefix-icon="User"
                                >
                                </el-input>
                            </el-form-item>
                            
                            <el-form-item prop="password">
                                <el-input 
                                    v-model="loginForm.password"
                                    type="password"
                                    placeholder="请输入密码"
                                    prefix-icon="Lock"
                                    show-password
                                >
                                </el-input>
                            </el-form-item>
                            
<!--                            <div class="login-options">-->
<!--                                <el-checkbox>记住我</el-checkbox>-->
<!--                                <a href="#" class="forgot-password">忘记密码？</a>-->
<!--                            </div>-->
                            
                            <div class="login-actions">
                                <el-button 
                                    type="primary" 
                                    class="login-button"
                                    @click="handleLogin" 
                                    :loading="loading"
                                >
                                    登录
                                </el-button>
                                
                                <div class="register-link">
                                    还没有账号？
                                    <el-button 
                                        type="text" 
                                        @click="$router.push('/register')"
                                    >
                                        立即注册
                                    </el-button>
                                </div>
                            </div>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
    `,

    methods: {
        async handleLogin() {
            if (!this.loginForm.username || !this.loginForm.password) {
                ElMessage.warning('请输入用户名和密码');
                return;
            }

            this.loading = true;
            try {
                const response = await userApi.login(this.loginForm.username, this.loginForm.password);
                if (response.data.code === 200) {
                    const user = response.data.data;
                    localStorage.setItem('user', JSON.stringify(user));
                    this.$router.push('/home');
                    ElMessage.success('登录成功');
                } else {
                    ElMessage.error(response.data.message || '登录失败');
                }
            } catch (error) {
                console.error('Login error:', error);
                ElMessage.error('登录失败，请稍后重试');
            }
            this.loading = false;
        }
    }
}; 