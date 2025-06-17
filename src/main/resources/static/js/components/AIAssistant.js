const AIAssistant = {
    name: 'AIAssistant',

    props: {
        content: {
            type: String,
            default: ''
        },
        onApply: {
            type: Function,
            required: true
        }
    },

    data() {
        return {
            dialogVisible: false,
            activeTab: 'generate',
            loading: false,
            
            // 生成文章相关数据
            generateForm: {
                prompt: '',
                topic: '',
                style: '',
                length: '500'
            },
            
            // 优化文章相关数据
            improveForm: {
                content: this.content,
                instruction: ''
            },
            
            // 生成结果
            generatedContent: '',
            
            // 预设风格
            presetStyles: [
                { label: '学术论文', value: '学术论文' },
                { label: '新闻报道', value: '新闻报道' },
                { label: '科普文章', value: '科普文章' },
                { label: '故事叙述', value: '故事叙述' },
                { label: '议论文', value: '议论文' },
                { label: '技术博客', value: '技术博客' }
            ],
            
            // 预设长度
            presetLengths: [
                { label: '短文(300字左右)', value: '300' },
                { label: '中等(500-800字)', value: '600' },
                { label: '长文(1000字以上)', value: '1000' }
            ]
        };
    },

    watch: {
        content: {
            immediate: true,
            handler(val) {
                this.improveForm.content = val;
            }
        }
    },

    template: `
        <div>
            <!-- 触发按钮 -->
            <el-button 
                type="primary" 
                @click="openDialog"
                size="small"
            >
                <el-icon><Magic /></el-icon>
                AI写作助手
            </el-button>
            
            <!-- AI助手弹窗 -->
            <el-dialog
                v-model="dialogVisible"
                title="AI写作助手"
                width="650px"
                destroy-on-close
                :close-on-click-modal="false"
                class="ai-assistant-dialog"
            >
                <template #header>
                    <div class="ai-assistant-header">
                        <h3>AI写作助手 <span class="ai-model-badge">ChatGLM</span></h3>
                        <el-tooltip content="AI可以帮助你生成文章或优化现有内容，由智谱AI提供支持" placement="top">
                            <el-icon><QuestionFilled /></el-icon>
                        </el-tooltip>
                    </div>
                </template>
                
                <div class="ai-assistant-body">
                    <el-tabs v-model="activeTab" stretch>
                        <el-tab-pane label="生成文章" name="generate">
                            <el-form :model="generateForm" label-position="top">
                                <el-form-item label="主题">
                                    <el-input 
                                        v-model="generateForm.topic" 
                                        placeholder="输入文章主题，如'人工智能的发展'"
                                    />
                                </el-form-item>
                                
                                <el-form-item label="写作风格">
                                    <el-select 
                                        v-model="generateForm.style" 
                                        placeholder="选择文章风格"
                                        clearable
                                        style="width: 100%"
                                    >
                                        <el-option 
                                            v-for="style in presetStyles"
                                            :key="style.value"
                                            :label="style.label"
                                            :value="style.value"
                                        />
                                    </el-select>
                                </el-form-item>
                                
                                <el-form-item label="文章长度">
                                    <el-select 
                                        v-model="generateForm.length" 
                                        placeholder="选择文章长度"
                                        style="width: 100%"
                                    >
                                        <el-option 
                                            v-for="length in presetLengths"
                                            :key="length.value"
                                            :label="length.label"
                                            :value="length.value"
                                        />
                                    </el-select>
                                </el-form-item>
                                
                                <el-form-item label="详细提示(可选)">
                                    <el-input 
                                        v-model="generateForm.prompt" 
                                        type="textarea"
                                        :rows="3"
                                        placeholder="输入更详细的要求，如'分析人工智能对教育领域的影响，包括优势和挑战'"
                                    />
                                </el-form-item>
                                
                                <el-form-item>
                                    <el-button 
                                        type="primary" 
                                        @click="handleGenerate"
                                        :loading="loading"
                                        style="width: 100%"
                                    >
                                        <el-icon><Magic /></el-icon>
                                        生成文章
                                    </el-button>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                        
                        <el-tab-pane label="优化内容" name="improve">
                            <el-form :model="improveForm" label-position="top">
                                <el-form-item label="优化指令">
                                    <el-input 
                                        v-model="improveForm.instruction" 
                                        type="textarea"
                                        :rows="2"
                                        placeholder="输入优化要求，如'使语言更生动''修正语法错误''调整结构使文章更连贯'"
                                    />
                                </el-form-item>
                                
                                <el-form-item label="原始内容">
                                    <el-input 
                                        v-model="improveForm.content" 
                                        type="textarea"
                                        :rows="5"
                                        placeholder="输入需要优化的内容"
                                    />
                                </el-form-item>
                                
                                <el-form-item>
                                    <el-button 
                                        type="primary" 
                                        @click="handleImprove"
                                        :loading="loading"
                                        style="width: 100%"
                                    >
                                        <el-icon><Brush /></el-icon>
                                        优化内容
                                    </el-button>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                    </el-tabs>
                    
                    <!-- 生成结果 -->
                    <div v-if="generatedContent" class="generated-content">
                        <el-divider>生成结果</el-divider>
                        
                        <el-scrollbar height="200px">
                            <div class="content-preview">{{ generatedContent }}</div>
                        </el-scrollbar>
                        
                        <div class="content-actions">
                            <el-button 
                                type="success" 
                                @click="applyContent"
                            >
                                <el-icon><Check /></el-icon>
                                应用内容
                            </el-button>
                            
                            <el-button 
                                type="primary"
                                @click="copyToClipboard"
                            >
                                <el-icon><CopyDocument /></el-icon>
                                复制内容
                            </el-button>
                            
                            <el-button 
                                @click="generatedContent = ''"
                            >
                                <el-icon><Close /></el-icon>
                                清除
                            </el-button>
                        </div>
                    </div>
                </div>
            </el-dialog>
        </div>
    `,

    methods: {
        openDialog() {
            this.dialogVisible = true;
            // 如果有当前编辑器内容，则设置到优化表单中
            if (this.content) {
                this.improveForm.content = this.content;
                this.activeTab = 'improve'; // 如果有内容，默认切换到优化选项卡
            } else {
                this.activeTab = 'generate'; // 否则默认生成选项卡
            }
        },
        
        closeDialog() {
            this.dialogVisible = false;
        },
        
        async handleGenerate() {
            if (!this.generateForm.topic) {
                ElMessage.warning('请输入文章主题');
                return;
            }
            
            this.loading = true;
            try {
                const response = await aiAssistantApi.generateContent(this.generateForm);
                if (response.data.code === 200) {
                    this.generatedContent = response.data.data;
                    ElMessage.success('文章生成成功');
                } else {
                    ElMessage.error(response.data.message || '生成失败');
                }
            } catch (error) {
                console.error('生成文章失败:', error);
                ElMessage.error('生成文章失败');
            } finally {
                this.loading = false;
            }
        },
        
        async handleImprove() {
            if (!this.improveForm.content) {
                ElMessage.warning('请输入需要优化的内容');
                return;
            }
            
            this.loading = true;
            try {
                const response = await aiAssistantApi.improveContent(this.improveForm);
                if (response.data.code === 200) {
                    this.generatedContent = response.data.data;
                    ElMessage.success('内容优化成功');
                } else {
                    ElMessage.error(response.data.message || '优化失败');
                }
            } catch (error) {
                console.error('优化内容失败:', error);
                ElMessage.error('优化内容失败');
            } finally {
                this.loading = false;
            }
        },
        
        applyContent() {
            this.onApply(this.generatedContent);
            ElMessage.success('内容已应用');
            this.closeDialog();
        },
        
        copyToClipboard() {
            if (!this.generatedContent) {
                ElMessage.warning('没有可复制的内容');
                return;
            }
            
            // 使用Clipboard API复制文本
            navigator.clipboard.writeText(this.generatedContent)
                .then(() => {
                    ElMessage.success('内容已复制到剪贴板');
                })
                .catch(err => {
                    console.error('复制失败:', err);
                    ElMessage.error('复制失败，请手动复制');
                });
        }
    }
}; 