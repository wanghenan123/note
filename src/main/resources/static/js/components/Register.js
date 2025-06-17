const Register = {
    data() {
        return {
            registerForm: {
                username: '',
                password: '',
                confirmPassword: '',
                nickname: '',
                email: '',
                phone: ''
            },
            loading: false
        }
    },

    template: `
        <div class="register-container">
            <div class="login-box">
                <div class="login-left">
                    <div class="login-welcome">
                        <h1>欢迎注册</h1>
                        <h2>云笔记知识分享平台</h2>
                        <p>借助云笔记便捷特性，随时汲取养生知识养分</p>
                    </div>
                </div>
                
                <div class="login-right">
                    <div class="login-form-container">
                        <h3>用户注册</h3>
                        <el-form 
                            :model="registerForm" 
                            label-width="0"
                            class="login-form"
                        >
                            <el-form-item>
                                <el-input 
                                    v-model="registerForm.username" 
                                    placeholder="请输入用户名"
                                    prefix-icon="User"
                                ></el-input>
                            </el-form-item>
                            
                            <el-form-item>
                                <el-input 
                                    v-model="registerForm.password" 
                                    type="password" 
                                    placeholder="请输入密码"
                                    prefix-icon="Lock"
                                    show-password
                                ></el-input>
                            </el-form-item>
                            
                            <el-form-item>
                                <el-input 
                                    v-model="registerForm.confirmPassword" 
                                    type="password" 
                                    placeholder="请确认密码"
                                    prefix-icon="Lock"
                                    show-password
                                ></el-input>
                            </el-form-item>
                            
                            <el-form-item>
                                <el-input 
                                    v-model="registerForm.nickname" 
                                    placeholder="请输入昵称"
                                    prefix-icon="User"
                                ></el-input>
                            </el-form-item>
                            
                            <el-form-item>
                                <el-input 
                                    v-model="registerForm.email" 
                                    placeholder="请输入邮箱"
                                    prefix-icon="Message"
                                ></el-input>
                            </el-form-item>
                            
                            <el-form-item>
                                <el-input 
                                    v-model="registerForm.phone" 
                                    placeholder="请输入手机号"
                                    prefix-icon="Phone"
                                ></el-input>
                            </el-form-item>
                            
                            <div class="login-actions">
                                <el-button 
                                    type="primary" 
                                    class="login-button"
                                    @click="handleRegister" 
                                    :loading="loading"
                                >
                                    注册
                                </el-button>
                                
                                <div class="register-link">
                                    已有账号？
                                    <el-button 
                                        type="text" 
                                        @click="goToLogin"
                                    >
                                        立即登录
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
        async handleRegister() {
            if (this.registerForm.password !== this.registerForm.confirmPassword) {
                ElMessage.error('两次输入的密码不一致');
                return;
            }

            this.loading = true;
            try {
                const response = await userApi.register(this.registerForm);
                if (response.data.code === 200) {
                    ElMessage.success('注册成功');
                    this.$router.push('/login');
                } else {
                    ElMessage.error(response.data.message || '注册失败');
                }
            } catch (error) {
                ElMessage.error('注册失败，请稍后重试');
            }
            this.loading = false;
        },

        goToLogin() {
            this.$router.push('/login');
        }
    }
}; 