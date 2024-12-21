<template>
  <div class="config-page">
    <el-card class="config-card">
      <div slot="header" class="card-header">
        <div class="header-content">
          <a class="back-btn" @click="goToHome">
            <i class="el-icon-arrow-left"></i>
            返回首页
          </a>
          <h2 class="title">MiGPT 智能管家配置中心</h2>
          <div class="service-controls">
            <el-tag
              :type="serviceStatus.serverRunning ? 'success' : 'danger'"
              class="status-tag"
            >
              <i
                :class="
                  serviceStatus.serverRunning
                    ? 'el-icon-success'
                    : 'el-icon-error'
                "
              ></i>
              服务器: {{ serviceStatus.serverRunning ? "运行中" : "已停止" }}
            </el-tag>
            <el-tag
              :type="serviceStatus.miGPTRunning ? 'success' : 'warning'"
              class="status-tag"
            >
              <i
                :class="
                  serviceStatus.miGPTRunning
                    ? 'el-icon-success'
                    : 'el-icon-warning'
                "
              ></i>
              MiGPT: {{ serviceStatus.miGPTRunning ? "运行中" : "未启动" }}
            </el-tag>

            <el-button-group class="control-buttons">
              <el-button
                type="success"
                icon="el-icon-video-play"
                :loading="isStarting"
                :disabled="
                  serviceStatus.miGPTRunning || isStarting || isRestarting
                "
                @click="startService"
              >
                启动
              </el-button>
              <el-button
                type="danger"
                icon="el-icon-video-pause"
                :loading="isStopping"
                :disabled="
                  !serviceStatus.miGPTRunning || isStopping || isRestarting
                "
                @click="stopService"
              >
                停止
              </el-button>
              <el-button
                type="warning"
                icon="el-icon-refresh"
                :loading="isRestarting"
                :disabled="isRestarting"
                @click="restartService"
              >
                重启
              </el-button>
            </el-button-group>

            <el-popover placement="bottom" width="400" trigger="click">
              <div class="guide-content">
                <h3>智能管家启动指南</h3>
                <div
                  v-for="(step, index) in guideSteps"
                  :key="index"
                  class="guide-step"
                >
                  <h4>{{ step.title }}</h4>
                  <p>{{ step.content }}</p>
                  <el-input
                    v-if="step.command"
                    :value="step.command"
                    readonly
                    size="small"
                  >
                    <el-button
                      slot="append"
                      icon="el-icon-document-copy"
                      @click="copyCommand(step.command)"
                      >复制</el-button
                    >
                  </el-input>
                </div>
                <el-alert class="mt-4" type="info" :closable="false" show-icon>
                  <template slot="title"
                    >提示：修改配置后需要重启服务才能生效</template
                  >
                </el-alert>
              </div>
              <el-button slot="reference" type="primary" icon="el-icon-question"
                >使用指南</el-button
              >
            </el-popover>
          </div>
        </div>
      </div>

      <el-tabs v-model="activeTab" class="config-tabs">
        <el-tab-pane name="basic">
          <span slot="label">
            <i class="fas fa-cogs"></i>
            基础配置
          </span>
          <el-form
            ref="configForm"
            :model="config"
            label-width="120px"
            class="config-form"
          >
            <el-collapse accordion>
              <el-collapse-item title="智能助手配置" name="1">
                <el-form-item
                  label="助手名称"
                  :rules="[
                    {
                      required: true,
                      message: '请输入智能助手名称',
                      trigger: 'blur',
                    },
                  ]"
                >
                  <el-input
                    v-model="config.bot.name"
                    placeholder="例如：小美"
                  ></el-input>
                </el-form-item>
                <el-form-item label="助手简介">
                  <el-input
                    type="textarea"
                    v-model="config.bot.profile"
                    :rows="4"
                    placeholder="请描述智能助手的性格、特点等"
                  ></el-input>
                  <div class="form-tip">建议包含性别、性格、专长等特征</div>
                </el-form-item>
              </el-collapse-item>

              <el-collapse-item title="用户配置" name="2">
                <el-form-item
                  label="用户名称"
                  :rules="[
                    {
                      required: true,
                      message: '请输入用户名称',
                      trigger: 'blur',
                    },
                  ]"
                >
                  <el-input
                    v-model="config.master.name"
                    placeholder="您的称呼"
                  ></el-input>
                </el-form-item>
                <el-form-item label="用户简介">
                  <el-input
                    type="textarea"
                    v-model="config.master.profile"
                    :rows="4"
                    placeholder="请描述您的兴趣、习惯等"
                  ></el-input>
                  <div class="form-tip">有助于智能助手更好地为您服务</div>
                </el-form-item>
              </el-collapse-item>

              <el-collapse-item title="账号设置" name="3">
                <el-form-item
                  label="小米ID"
                  :rules="[
                    {
                      required: true,
                      message: '请输入小米ID',
                      trigger: 'blur',
                    },
                  ]"
                >
                  <el-input v-model="config.speaker.userId">
                    <template slot="append">
                      <el-tooltip
                        content="请在小米账号的「个人信息」-「小米 ID」中查看"
                        placement="top"
                      >
                        <i class="el-icon-question"></i>
                      </el-tooltip>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item
                  label="账号密码"
                  :rules="[
                    {
                      required: true,
                      message: '请输入账号密码',
                      trigger: 'blur',
                    },
                  ]"
                >
                  <el-input
                    v-model="config.speaker.password"
                    type="password"
                    show-password
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="设备名称"
                  :rules="[
                    {
                      required: true,
                      message: '请输入设备名称',
                      trigger: 'blur',
                    },
                  ]"
                >
                  <el-input v-model="config.speaker.did">
                    <template slot="append">
                      <el-tooltip
                        content="小爱音箱 DID 或在米家中设置的名称"
                        placement="top"
                      >
                        <i class="el-icon-question"></i>
                      </el-tooltip>
                    </template>
                  </el-input>
                </el-form-item>
              </el-collapse-item>

              <el-collapse-item title="音箱配置" name="4">
                <el-form-item label="音箱型号">
                  <el-select
                    v-model="selectedDeviceModel"
                    placeholder="请选择音箱型号"
                    filterable
                    allow-create
                    @change="handleDeviceModelChange"
                  >
                    <el-option
                      v-for="(preset, key) in devicePresets"
                      :key="key"
                      :label="preset.label"
                      :value="key"
                    ></el-option>
                  </el-select>
                  <div class="form-tip">支持自定义添加音箱型号</div>
                </el-form-item>

                <el-form-item
                  label="播放命令"
                  :rules="[
                    {
                      required: true,
                      message: '请设置播放命令',
                      trigger: 'change',
                      validator: (rule, value, callback) => {
                        if (
                          !this.config.speaker.ttsCommand ||
                          this.config.speaker.ttsCommand.length === 0
                        ) {
                          callback(new Error('请设置播放命令'));
                        } else if (
                          this.config.speaker.ttsCommand.some(
                            (v) => v === null || v === undefined
                          )
                        ) {
                          callback(new Error('播放命令不能为空'));
                        } else {
                          callback();
                        }
                      },
                    },
                  ]"
                >
                  <div class="command-group">
                    <el-input-number
                      v-for="(num, index) in config.speaker.ttsCommand"
                      :key="'tts-' + index"
                      v-model="config.speaker.ttsCommand[index]"
                      :min="0"
                      :max="10"
                      :step="1"
                      :controls="true"
                      size="small"
                      controls-position="right"
                      class="command-input"
                    ></el-input-number>
                  </div>
                </el-form-item>

                <el-form-item
                  label="唤醒命令"
                  :rules="[
                    {
                      required: true,
                      message: '请设置唤醒命令',
                      trigger: 'change',
                      validator: (rule, value, callback) => {
                        if (
                          !this.config.speaker.wakeUpCommand ||
                          this.config.speaker.wakeUpCommand.length === 0
                        ) {
                          callback(new Error('请设置唤醒命令'));
                        } else if (
                          this.config.speaker.wakeUpCommand.some(
                            (v) => v === null || v === undefined
                          )
                        ) {
                          callback(new Error('唤醒命令不能为空'));
                        } else {
                          callback();
                        }
                      },
                    },
                  ]"
                >
                  <div class="command-group">
                    <el-input-number
                      v-for="(num, index) in config.speaker.wakeUpCommand"
                      :key="'wake-' + index"
                      v-model="config.speaker.wakeUpCommand[index]"
                      :min="0"
                      :max="10"
                      :step="1"
                      :controls="true"
                      size="small"
                      controls-position="right"
                      class="command-input"
                    ></el-input-number>
                  </div>
                </el-form-item>

                <el-form-item
                  v-if="config.speaker.playingCommand.length > 0"
                  label="播放检测命令"
                >
                  <div class="command-group">
                    <el-input-number
                      v-for="(num, index) in config.speaker.playingCommand"
                      :key="'play-' + index"
                      v-model="config.speaker.playingCommand[index]"
                      :min="0"
                      :max="10"
                      :step="1"
                      :controls="true"
                      size="small"
                      controls-position="right"
                      class="command-input"
                    ></el-input-number>
                  </div>
                </el-form-item>
              </el-collapse-item>

              <el-collapse-item title="高级设置" name="6">
                <el-form-item label="调用AI键词" class="keyword-select">
                  <el-select
                    v-model="config.speaker.callAIKeywords"
                    multiple
                    allow-create
                    filterable
                    default-first-option
                    placeholder="请输入或选择关键词"
                  >
                    <el-option
                      v-for="word in ['请', '你', '智能助手']"
                      :key="word"
                      :label="word"
                      :value="word"
                    ></el-option>
                  </el-select>
                  <div class="form-tip">支持自定义添加，按回车确认</div>
                </el-form-item>

                <el-form-item label="唤醒关键词" class="keyword-select">
                  <el-select
                    v-model="config.speaker.wakeUpKeywords"
                    multiple
                    allow-create
                    filterable
                    default-first-option
                    placeholder="请输入或选择唤醒关键词"
                  >
                    <el-option
                      v-for="word in ['打开', '进入', '激活']"
                      :key="word"
                      :label="word"
                      :value="word"
                    ></el-option>
                  </el-select>
                  <div class="form-tip">支持自定义添加，按回车确认</div>
                </el-form-item>

                <el-form-item label="退出关键词" class="keyword-select">
                  <el-select
                    v-model="config.speaker.exitKeywords"
                    multiple
                    allow-create
                    filterable
                    default-first-option
                    placeholder="请输入或选择退出关键词"
                  >
                    <el-option
                      v-for="word in ['关闭', '退出', '再见']"
                      :key="word"
                      :label="word"
                      :value="word"
                    ></el-option>
                  </el-select>
                  <div class="form-tip">支持自定义添加，按回车确认</div>
                </el-form-item>

                <el-form-item label="进入提示语" class="keyword-select">
                  <el-select
                    v-model="config.speaker.onEnterAI"
                    multiple
                    allow-create
                    filterable
                    default-first-option
                    placeholder="请输入或选择入提示语"
                  >
                    <el-option
                      v-for="text in ['您好，我是您的智能助手']"
                      :key="text"
                      :label="text"
                      :value="text"
                    ></el-option>
                  </el-select>
                  <div class="form-tip">支持自定义添加，按回车确认</div>
                </el-form-item>

                <el-form-item label="退出提示语" class="keyword-select">
                  <el-select
                    v-model="config.speaker.onExitAI"
                    multiple
                    allow-create
                    filterable
                    default-first-option
                    placeholder="请输入或选择退出提示语"
                  >
                    <el-option
                      v-for="text in ['再见，期待下次为您服务']"
                      :key="text"
                      :label="text"
                      :value="text"
                    ></el-option>
                  </el-select>
                  <div class="form-tip">支持自定义添加，按回车确认</div>
                </el-form-item>

                <el-form-item label="AI思考提示语" class="keyword-select">
                  <el-select
                    v-model="config.speaker.onAIAsking"
                    multiple
                    allow-create
                    filterable
                    default-first-option
                    placeholder="请输入或选择AI思考提示语"
                  >
                    <el-option
                      v-for="text in ['让我思考一下']"
                      :key="text"
                      :label="text"
                      :value="text"
                    ></el-option>
                  </el-select>
                  <div class="form-tip">支持自定义添加，按回车确认</div>
                </el-form-item>

                <el-form-item label="AI回答提示语" class="keyword-select">
                  <el-select
                    v-model="config.speaker.onAIReplied"
                    multiple
                    allow-create
                    filterable
                    default-first-option
                    placeholder="请输入或选择AI回答提示语"
                  >
                    <el-option
                      v-for="text in ['我的回答是']"
                      :key="text"
                      :label="text"
                      :value="text"
                    ></el-option>
                  </el-select>
                  <div class="form-tip">支持自定义添加，按回车确认</div>
                </el-form-item>

                <el-form-item label="AI错误提示语" class="keyword-select">
                  <el-select
                    v-model="config.speaker.onAIError"
                    multiple
                    allow-create
                    filterable
                    default-first-option
                    placeholder="请输入或选择AI错误提示语"
                  >
                    <el-option
                      v-for="text in ['抱歉，我遇到了一些问题']"
                      :key="text"
                      :label="text"
                      :value="text"
                    ></el-option>
                  </el-select>
                  <div class="form-tip">支持自定义添加，按回车确认</div>
                </el-form-item>
                <div class="continuous-dialog-settings">
                  <el-form-item label="连续对话">
                    <el-switch
                      v-model="config.speaker.streamResponse"
                    ></el-switch>
                    <div class="form-tip">启用后持连续对话功能</div>
                  </el-form-item>

                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="自动退出时间">
                        <el-input-number
                          v-model="config.speaker.exitKeepAliveAfter"
                          :min="1"
                          :max="60"
                          :step="1"
                          controls-position="right"
                        ></el-input-number>
                        <div class="form-tip">无响应自动退出（秒）</div>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="检测延迟">
                        <el-input-number
                          v-model="config.speaker.checkTTSStatusAfter"
                          :min="1"
                          :max="10"
                          :step="1"
                          controls-position="right"
                        ></el-input-number>
                        <div class="form-tip">开始检测延迟（秒）</div>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="检测间隔">
                        <el-input-number
                          v-model="config.speaker.checkInterval"
                          :min="500"
                          :max="5000"
                          :step="100"
                          controls-position="right"
                        ></el-input-number>
                        <div class="form-tip">播放态检测间隔（毫秒）</div>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="请求超时">
                        <el-input-number
                          v-model="config.speaker.timeout"
                          :min="1000"
                          :max="30000"
                          :step="1000"
                          controls-position="right"
                        ></el-input-number>
                        <div class="form-tip">网络请求超时（毫秒）</div>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="调试模式">
                        <el-switch v-model="config.speaker.debug"></el-switch>
                        <div class="form-tip">启用调试日志输出</div>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="跟踪日志">
                        <el-switch
                          v-model="config.speaker.enableTrace"
                        ></el-switch>
                        <div class="form-tip">跟踪 Mi Service 日志</div>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-collapse-item>

              <el-collapse-item title="语音配置" name="5">
                <el-form-item label="TTS 引擎">
                  <el-select
                    v-model="selectedTTSEngine"
                    placeholder="请选择 TTS 引擎"
                    @change="handleTTSEngineChange"
                  >
                    <el-option
                      v-for="(engine, key) in ttsEngines"
                      :key="key"
                      :label="engine.label"
                      :value="key"
                    >
                      <span class="engine-tooltip">{{ engine.tooltip }}</span>
                      <span v-if="!engine.isDefault" class="engine-actions">
                        <el-button
                          type="text"
                          size="mini"
                          icon="el-icon-delete"
                          @click.stop="removeTTSEngine(key)"
                        ></el-button>
                      </span>
                    </el-option>
                    <el-option
                      value="add_new"
                      label="+ 添加自定义引擎"
                    ></el-option>
                  </el-select>
                  <div class="form-tip">语音合成引擎选择</div>
                </el-form-item>

                <template
                  v-if="
                    selectedTTSEngine &&
                    ttsEngines[selectedTTSEngine]?.value === 'custom'
                  "
                >
                  <el-form-item label="服务地址">
                    <el-input
                      v-model="config.tts.baseUrl"
                      placeholder="请输入 TTS 服务地址"
                    >
                      <template slot="append">
                        <el-tooltip
                          content="TTS 服务的接口地址"
                          placement="top"
                        >
                          <i class="el-icon-question"></i>
                        </el-tooltip>
                      </template>
                    </el-input>
                  </el-form-item>
                </template>

                <template
                  v-if="
                    selectedTTSEngine &&
                    ttsEngines[selectedTTSEngine]?.value === 'custom'
                  "
                >
                  <el-form-item label="音色切换关键词">
                    <el-select
                      v-model="config.speaker.switchSpeakerKeywords"
                      multiple
                      allow-create
                      filterable
                      default-first-option
                      placeholder="请输入或选择音色切换关键词"
                    >
                      <el-option
                        v-for="word in ['把声音换成', '切换声音为', '使用音色']"
                        :key="word"
                        :label="word"
                        :value="word"
                      ></el-option>
                    </el-select>
                    <div class="form-tip">
                      支持自定义添加，按回车确认。使用方式：关键词 + 色名称
                    </div>
                  </el-form-item>
                </template>

                <template
                  v-if="
                    selectedTTSEngine &&
                    ttsEngines[selectedTTSEngine]?.value === 'custom'
                  "
                >
                  <el-form-item label="可用音色">
                    <el-table
                      :data="ttsEngines[selectedTTSEngine].speakers"
                      style="width: 100%"
                      size="small"
                    >
                      <el-table-column
                        prop="label"
                        label="音色名称"
                        width="180"
                      ></el-table-column>
                      <el-table-column
                        prop="value"
                        label="音色ID"
                      ></el-table-column>
                    </el-table>
                  </el-form-item>
                </template>
              </el-collapse-item>
            </el-collapse>
          </el-form>
        </el-tab-pane>

        <el-tab-pane name="ai">
          <span slot="label">
            <i class="fas fa-robot"></i>
            AI服务配置
          </span>
          <el-form
            ref="aiForm"
            :model="config"
            label-width="120px"
            class="config-form"
          >
            <el-form-item label="选择 AI 服务">
              <el-select
                v-model="selectedAIService"
                placeholder="请选择 AI 服务"
                filterable
                allow-create
                @change="handleAIServiceChange"
              >
                <el-option
                  v-for="(service, key) in aiServices"
                  :key="key"
                  :label="service.label"
                  :value="key"
                ></el-option>
                <el-option label="自定义 AI 服务" value="custom"></el-option>
              </el-select>
              <div class="form-tip">支持自定义添加按回车确认</div>
            </el-form-item>

            <template v-if="selectedAIService">
              <el-form-item
                label="接口地址"
                class="endpoint-item"
                :rules="[
                  {
                    required: true,
                    message: '请输入接口地址',
                    trigger: 'blur',
                  },
                ]"
              >
                <el-select
                  v-model="config[selectedAIService].endpoint"
                  placeholder="请选择或输入接口地址"
                  filterable
                  allow-create
                  @change="handleEndpointChange"
                >
                  <el-option
                    v-if="
                      selectedAIService !== 'custom' &&
                      aiServices[selectedAIService]
                    "
                    :label="aiServices[selectedAIService]?.endpoint"
                    :value="aiServices[selectedAIService]?.endpoint"
                  >
                    <span class="endpoint-option">{{
                      aiServices[selectedAIService]?.endpoint
                    }}</span>
                  </el-option>
                </el-select>
                <div class="form-tip">
                  {{
                    (aiServices[selectedAIService] &&
                      aiServices[selectedAIService].tooltip) ||
                    "请输入完整的接口地址"
                  }}
                </div>
              </el-form-item>

              <el-form-item
                label="API 密钥"
                :rules="[
                  {
                    required: true,
                    message: '请输入 API 密钥',
                    trigger: 'blur',
                  },
                ]"
              >
                <el-input
                  v-model="config[selectedAIService].apiKey"
                  type="password"
                  show-password
                  placeholder="请输入 API 密钥"
                ></el-input>
              </el-form-item>

              <el-form-item
                label="模型"
                :rules="[
                  {
                    required: true,
                    message: '请选择或输入模型',
                    trigger: 'change',
                  },
                ]"
              >
                <el-select
                  v-model="config[selectedAIService].model"
                  placeholder="请选择或输入模型"
                  filterable
                  allow-create
                >
                  <el-option
                    v-for="model in aiServices[selectedAIService]?.models"
                    :key="model.value"
                    :label="model.label"
                    :value="model.value"
                  ></el-option>
                </el-select>
                <div class="form-tip">支持自定义添加，按回车确认</div>
              </el-form-item>
            </template>
          </el-form>
        </el-tab-pane>

        <el-tab-pane name="prompt">
          <span slot="label">
            <i class="fas fa-file-alt"></i>
            Prompt模板
          </span>
          <el-form
            ref="promptForm"
            :model="config"
            label-width="120px"
            class="config-form"
          >
            <el-form-item label="">
              <div class="prompt-editor">
                <div class="editor-header">
                  <div class="header-actions">
                    <el-switch
                      v-model="isPreviewMode"
                      active-text="预览模式"
                      inactive-text="编辑模式"
                      class="mode-switch"
                    ></el-switch>
                    <div class="header-buttons">
                      <el-popover
                        placement="bottom"
                        width="400"
                        trigger="click"
                        popper-class="variable-guide-popover"
                      >
                        <div class="guide-content">
                          <h3>可用的变量</h3>
                          <div class="variable-list">
                            <div
                              v-for="(item, index) in variableTableData"
                              :key="index"
                              class="guide-section"
                            >
                              <div class="variable-header">
                                <code>{{ item.variable }}</code>
                                <el-button
                                  type="text"
                                  icon="el-icon-document-copy"
                                  class="copy-btn"
                                  @click="copyVariable(item.variable)"
                                  >复制</el-button
                                >
                              </div>
                              <p class="variable-desc">
                                {{ item.description }}
                              </p>
                              <p
                                v-if="item.currentValue"
                                class="variable-value"
                              >
                                当前值: {{ item.currentValue }}
                              </p>
                            </div>
                          </div>
                        </div>
                        <el-button
                          slot="reference"
                          type="text"
                          icon="el-icon-info"
                          >查看可用变量</el-button
                        >
                      </el-popover>
                      <el-button
                        type="text"
                        icon="el-icon-refresh-left"
                        @click="resetSystemTemplate"
                        >恢复默认模板</el-button
                      >
                    </div>
                  </div>
                </div>

                <div class="editor-container">
                  <el-input
                    v-show="!isPreviewMode"
                    type="textarea"
                    v-model="config.systemTemplate"
                    :rows="20"
                    :autosize="{ minRows: 10, maxRows: 30 }"
                    placeholder="请输入系统 Prompt 模板"
                    class="custom-textarea"
                  ></el-input>

                  <div
                    v-show="isPreviewMode"
                    class="preview-content custom-scrollbar"
                    v-html="getPreviewContent()"
                  ></div>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane name="json">
          <span slot="label">
            <i class="fas fa-code"></i>
            JSON编辑器
          </span>
          <div class="editor-header">
            <div>
              <el-button type="primary" size="small" @click="loadExampleConfig">
                加载示例配置
              </el-button>

              <el-button type="warning" size="small" @click="syncFormToJson">
                表单同步到JSON
              </el-button>
              <el-button type="success" size="small" @click="syncJsonToForm">
                JSON同步到表单
              </el-button>
            </div>
          </div>
          <el-input
            type="textarea"
            v-model="configContent"
            :rows="20"
            class="config-editor"
          ></el-input>
        </el-tab-pane>
      </el-tabs>

      <div class="form-actions">
        <el-button type="primary" @click="saveConfig"> 保存配置 </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  aiServices,
  devicePresets,
  systemTemplate,
  variableList,
} from "./templates";
import {
  ttsEngines,
  getDefaultEngine,
  addEngine,
  removeEngine,
} from "./ttsEngines";

export default {
  name: "ConfigPage",
  data() {
    return {
      config: {
        bot: {
          name: "",
          profile: "",
        },
        master: {
          name: "",
          profile: "",
        },
        speaker: {
          userId: "",
          password: "",
          did: "",
          ttsCommand: [1, 2, 3, 4, 5],
          wakeUpCommand: [1, 2, 3, 4, 5],
          playingCommand: [],
          callAIKeywords: [],
          wakeUpKeywords: [],
          exitKeywords: [],
          onEnterAI: [],
          onExitAI: [],
          onAIAsking: [],
          onAIReplied: [],
          onAIError: [],
          tts: "xiaoai",
          streamResponse: false,
          exitKeepAliveAfter: 10,
          checkTTSStatusAfter: 3,
          checkInterval: 1000,
          timeout: 10000,
          debug: false,
          enableTrace: false,
          switchSpeakerKeywords: [],
        },
        systemTemplate: systemTemplate,
        openai: { apiKey: "", model: "", endpoint: "" },
        azure: { apiKey: "", model: "", endpoint: "" },
        zhipu: { apiKey: "", model: "", endpoint: "" },
        tongyi: { apiKey: "", model: "", endpoint: "" },
        doubao: { apiKey: "", model: "", endpoint: "" },
        custom: { apiKey: "", model: "", endpoint: "" },
        tts: {
          baseUrl: "",
        },
      },
      configContent: "",
      activeTab: "basic",
      selectedDeviceModel: "",
      selectedAIService: "",
      aiServices,
      devicePresets,
      isPreviewMode: false,
      isStarting: false,
      isStopping: false,
      isRestarting: false,
      serviceStatus: {
        serverRunning: false,
        miGPTRunning: false,
      },
      guideSteps: [
        {
          title: "1. 配置基础信息",
          content:
            '在"基础配置"中设置智能助手名称、用户信息、小米账号和音箱配置等基本参数。',
        },
        {
          title: "2. 配置 AI 服务",
          content:
            '在"AI服务配置"中选择并配置 AI 服务提供商（如 OpenAI、智谱等），填写相关的 API 密钥和接口信息。',
        },
        {
          title: "3. 启动服务",
          content:
            '完成配置后，点击顶部的"启动"按钮运行 MiGPT 服务。服务启动后，状态标签会显示为"运行中"。',
        },
        {
          title: "4. 开始使用",
          content:
            '对着小爱音箱说"小爱同学"，等待回应后说出带有触发词的指令，如"请帮我查询天气"。',
          command: "小爱同学 + 请/你/智能助手 + 问题内容",
        },
        {
          title: "注意事项",
          content:
            "1. 修改配置后需要重启服务才能生效\n2. 确保网络连接稳定\n3. 检查音箱是否正常连接",
        },
      ],
      variableTableData: variableList,
      selectedTTSEngine: "xiaoai",
      ttsEngines,
    };
  },
  computed: {
    allServices() {
      return { ...this.aiServices, custom: this.config.custom };
    },
  },
  methods: {
    goToHome() {
      this.$router.push("/");
    },
    async startService() {
      try {
        this.isStarting = true;
        console.log("[Frontend] 开始启动服务...");
        const response = await fetch("/api/service/start", { method: "POST" });
        const data = await response.json();
        if (data.success) {
          this.$message.success("服务启动成功");
          if (data.status) {
            this.serviceStatus = data.status;
          }
        } else {
          this.$message.error("服务启动失败: " + data.error);
        }
      } catch (error) {
        console.error("启动服务失败:", error);
        this.$message.error("启动服务失败: " + error.message);
      } finally {
        this.isStarting = false;
        await this.checkServiceHealth();
      }
    },
    async stopService() {
      try {
        this.isStopping = true;
        console.log("开始停止服务...");
        const response = await fetch("/api/service/stop", { method: "POST" });
        const data = await response.json();
        if (data.success) {
          this.$message.success("服务停止成功");
          await this.checkServiceHealth();
        } else {
          this.$message.error("服务停止失败: " + data.error);
        }
      } catch (error) {
        console.error("停止服务失败:", error);
        this.$message.error("停止服务失败: " + error.message);
      } finally {
        this.isStopping = false;
      }
    },
    async restartService() {
      try {
        this.isRestarting = true;
        console.log("开始重启服务...");
        const response = await fetch("/api/service/restart", {
          method: "POST",
        });
        const data = await response.json();
        if (data.success) {
          this.$message.success("服务重启完成");
          if (data.status) {
            this.serviceStatus = data.status;
          }
        } else {
          this.$message.error("服务重启失败: " + data.error);
        }
      } catch (error) {
        console.error("重启服务失败:", error);
        this.$message.error("重启服务失败: " + error.message);
      } finally {
        this.isRestarting = false;
        await this.checkServiceHealth();
      }
    },
    copyCommand(command) {
      this.$copyText(command).then(
        () => {
          this.$message.success("命令已复制到剪贴板");
        },
        () => {
          this.$message.error("复制命令失败");
        }
      );
    },
    copyVariable(variable) {
      this.$copyText(variable).then(
        () => {
          this.$message.success("变量已复制到剪贴板");
        },
        () => {
          this.$message.error("复制变量失败");
        }
      );
    },
    resetSystemTemplate() {
      this.config.systemTemplate = systemTemplate;
    },
    getPreviewContent() {
      if (!this.config.systemTemplate) {
        return "";
      }

      let content = this.config.systemTemplate;

      // 定义变量映射
      const variables = {
        "{{botName}}": this.config.bot.name || "未设置",
        "{{botProfile}}": this.config.bot.profile || "未设置",
        "{{masterName}}": this.config.master.name || "未设置",
        "{{masterProfile}}": this.config.master.profile || "未设置",
        "{{currentTime}}": new Date().toLocaleTimeString(),
        "{{currentDate}}": new Date().toLocaleDateString(),
        "{{currentHour}}": new Date().getHours().toString(),
        "{{roomName}}": "默认群组",
        "{{roomIntroduction}}": "这是一个默认群组",
        "{{messages}}": "暂无历史消息",
        "{{shortTermMemory}}": "暂无短期记忆",
        "{{longTermMemory}}": "暂无长期记忆",
      };

      // 替换所有变量
      Object.entries(variables).forEach(([key, value]) => {
        // 使用全局替换
        const regex = new RegExp(
          key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "g"
        );
        content = content.replace(
          regex,
          `<span class="variable-highlight">${value}</span>`
        );
      });

      // 转换换行符为 HTML 换行标签
      content = content.replace(/\n/g, "<br>");

      return content;
    },
    handleDeviceModelChange(model) {
      if (model && this.devicePresets[model]) {
        const preset = this.devicePresets[model];
        this.config.speaker.ttsCommand = [...preset.ttsCommand];
        this.config.speaker.wakeUpCommand = [...preset.wakeUpCommand];
        this.config.speaker.playingCommand = [...preset.playingCommand];
        this.selectedDeviceModel = model;
        this.$set(this.config.speaker, "deviceModel", model);
      } else if (model) {
        this.config.speaker.ttsCommand = [0, 0, 0];
        this.config.speaker.wakeUpCommand = [0, 0, 0];
        this.config.speaker.playingCommand = [0, 0, 0];
        this.selectedDeviceModel = model;
        this.$set(this.config.speaker, "deviceModel", model);

        this.$set(this.devicePresets, model, {
          label: model,
          ttsCommand: this.config.speaker.ttsCommand,
          wakeUpCommand: this.config.speaker.wakeUpCommand,
          playingCommand: this.config.speaker.playingCommand,
        });
      }
    },
    handleAIServiceChange(service) {
      if (service) {
        if (!this.config[service]) {
          this.$set(this.config, service, {
            apiKey: "",
            model: "",
            endpoint: "",
          });
        }
        if (this.aiServices[service]) {
          const serviceConfig = this.aiServices[service];
          this.config[service].endpoint = serviceConfig.endpoint;
          if (!this.config[service].model && serviceConfig.models?.length) {
            this.config[service].model = serviceConfig.models[0].value;
          }
        }
      }
    },
    handleEndpointChange(endpoint) {
      if (
        endpoint &&
        this.selectedAIService &&
        this.aiServices[this.selectedAIService]
      ) {
        const serviceConfig = this.aiServices[this.selectedAIService];
        if (serviceConfig.endpoint !== endpoint) {
          this.config[this.selectedAIService].model = "";
        }
      }
    },
    async loadConfig() {
      try {
        const response = await fetch("/api/config");
        const data = await response.json();
        if (data.config) {
          const configStr = data.config
            .replace(/export\s+default\s+/, "")
            .replace(/;$/, "")
            .trim();
          const parsedConfig = JSON.parse(configStr);

          // 更新整个配置对象
          Object.keys(parsedConfig).forEach((key) => {
            this.$set(this.config, key, parsedConfig[key]);
          });

          // 确保 systemTemplate 存在
          if (!this.config.systemTemplate) {
            this.$set(this.config, "systemTemplate", systemTemplate);
          }

          // 确保 tts 配置存在
          if (!this.config.tts) {
            this.$set(this.config, "tts", { baseUrl: "" });
          }

          // 同步到 JSON 编辑器
          this.syncConfigToJson();

          // 设置 TTS 引擎
          if (this.config.speaker.tts === "xiaoai") {
            this.selectedTTSEngine = "xiaoai";
          } else if (this.config.speaker.tts === "custom") {
            // ... 其他 TTS 相关代码 ...
          }

          // 找到当前使用的 AI 服务
          const activeService = Object.entries(this.config).find(
            ([key, value]) =>
              [
                "openai",
                "azure",
                "zhipu",
                "tongyi",
                "doubao",
                "custom",
              ].includes(key) &&
              value.apiKey &&
              value.model &&
              value.endpoint
          );

          if (activeService) {
            this.selectedAIService = activeService[0];
          }

          // 从配置中加载设备型号
          if (this.config.speaker.deviceModel) {
            this.selectedDeviceModel = this.config.speaker.deviceModel;
          } else {
            // ... 其他设备型号相关代码 ...
          }
        }
      } catch (error) {
        console.error("加载配置失败:", error);
        this.$message.error("加载配置失败: " + error.message);
      }
    },
    async saveConfig() {
      try {
        // 同时验证基础配置表单和 AI 配置表单
        const [basicValid, aiValid] = await Promise.all([
          this.$refs.configForm.validate(),
          this.$refs.aiForm.validate(),
        ]);

        if (!basicValid || !aiValid) {
          this.$message.error("请填写必填项");
          return;
        }

        // 创建配置的副本
        const configToSave = JSON.parse(JSON.stringify(this.config));

        // 处理模板变量替换
        const variables = {
          "{{botName}}": configToSave.bot.name || "未设置",
          "{{botProfile}}": configToSave.bot.profile || "未设置",
          "{{masterName}}": configToSave.master.name || "未设置",
          "{{masterProfile}}": configToSave.master.profile || "未设置",
          "{{currentTime}}": new Date().toLocaleTimeString(),
          "{{currentDate}}": new Date().toLocaleDateString(),
          "{{currentHour}}": new Date().getHours().toString(),
          "{{roomName}}": "默认群组",
          "{{roomIntroduction}}": "这是一个默认群组",
          "{{messages}}": "暂无历史消息",
          "{{shortTermMemory}}": "暂无短期记忆",
          "{{longTermMemory}}": "暂无长期记忆",
        };

        let processedTemplate = configToSave.systemTemplate;

        // 替换所有变量为实际值
        Object.entries(variables).forEach(([key, value]) => {
          const regex = new RegExp(
            key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
            "g"
          );
          processedTemplate = processedTemplate.replace(regex, value);
        });

        // 更新要保存的配置中模板
        configToSave.systemTemplate = processedTemplate;

        const response = await fetch("/api/config", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(configToSave),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "保存失败");
        }

        this.$message.success("配置保存成功");

        // 重新加载配置以确保显示正确的内容
        await this.loadConfig();

        // 同步到 JSON 编辑器
        this.syncConfigToJson();
      } catch (error) {
        console.error("保存配置失败:", error);
        this.$message.error("保存配置失败: " + error.message);
      }
    },
    syncConfigToJson() {
      this.configContent = JSON.stringify(this.config, null, 2);
    },
    syncFormToJson() {
      this.$refs.configForm.validate((valid) => {
        if (valid) {
          this.syncConfigToJson();
          this.$message.success("表单同步到JSON成功");
        } else {
          this.$message.error("表单验证失败，请检查输入");
        }
      });
    },
    syncJsonToForm() {
      try {
        const jsonConfig = JSON.parse(this.configContent);
        this.config = jsonConfig;
        this.$message.success("JSON同步到表单成功");
      } catch (error) {
        console.error("JSON解析失败:", error);
        this.$message.error("JSON解析失败: " + error.message);
      }
    },
    loadExampleConfig() {
      this.config = {
        bot: {
          name: "小智",
          profile:
            "小智是一位友好、乐于助人的智能助手。她的性格开朗、热情，对技术有浓厚的兴趣。能够回答各种问题，解答日常生活中的疑惑，并提供有用的建议。",
        },
        master: {
          name: "主人",
          profile:
            "主人是一位热爱新技术、喜欢尝试新事物的人。他对智能设备和人工智能浓厚的兴趣，并希望小智能够成为他生活中好帮手。",
        },
        speaker: {
          userId: "1234567890",
          password: "password123",
          did: "小爱音箱",
          ttsCommand: [1, 2, 3, 4, 5],
          wakeUpCommand: [1, 2, 3, 4, 5],
          playingCommand: [],
          callAIKeywords: ["请", "你", "智能助手"],
          wakeUpKeywords: ["打开", "进入", "激活"],
          exitKeywords: ["关闭", "退出", "再见"],
          onEnterAI: ["您好，我是您的智能助手"],
          onExitAI: ["再见，期待下次为您服务"],
          onAIAsking: ["让我思考一下"],
          onAIReplied: ["我的回答是"],
          onAIError: ["抱歉，我遇到了一些问题"],
          tts: "xiaoai",
          streamResponse: false,
          exitKeepAliveAfter: 10,
          checkTTSStatusAfter: 3,
          checkInterval: 1000,
          timeout: 10000,
          debug: false,
          enableTrace: false,
          switchSpeakerKeywords: ["把声音换成"],
        },
        systemTemplate: systemTemplate,
        openai: {
          apiKey: "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
          model: "gpt-3.5-turbo",
          endpoint: "https://api.openai.com/v1/chat/completions",
        },
        azure: {
          apiKey: "",
          model: "",
          endpoint: "",
        },
        zhipu: {
          apiKey: "",
          model: "",
          endpoint: "",
        },
        tongyi: {
          apiKey: "",
          model: "",
          endpoint: "",
        },
        doubao: {
          apiKey: "",
          model: "",
          endpoint: "",
        },
        custom: {
          apiKey: "",
          model: "",
          endpoint: "",
        },
      };
      this.syncConfigToJson();
    },
    async checkServiceHealth() {
      try {
        const response = await fetch("/api/service/health");
        const data = await response.json();
        this.serviceStatus = data;
      } catch (error) {
        console.error("服务健康检查失败:", error);
        this.$message.error("服务健康检查失败: " + error.message);
      }
    },
    handleTTSEngineChange(value) {
      if (value === "add_new") {
        this.$prompt("请输入引擎名称", "添加自定义引擎", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /^.+$/,
          inputErrorMessage: "名称不能为空",
        })
          .then(({ value: label }) => {
            const key = `custom_${Date.now()}`;
            addEngine(key, label, "");
            this.selectedTTSEngine = key;
            this.config.speaker.tts = "custom";
            if (!this.config.tts) {
              this.$set(this.config, "tts", { baseUrl: "" });
            } else {
              this.config.tts.baseUrl = "";
            }
            if (!this.config.speaker.switchSpeakerKeywords) {
              this.$set(this.config.speaker, "switchSpeakerKeywords", [
                "把声音换成",
              ]);
            }
          })
          .catch(() => {
            this.selectedTTSEngine = this.config.speaker.tts;
          });
      } else if (value && this.ttsEngines[value]) {
        const engine = this.ttsEngines[value];
        this.config.speaker.tts = engine.value;
        if (engine.value === "custom") {
          if (!this.config.tts) {
            this.$set(this.config, "tts", { baseUrl: engine.baseUrl || "" });
          } else {
            this.config.tts.baseUrl = engine.baseUrl || "";
          }
          if (!this.config.speaker.switchSpeakerKeywords) {
            this.$set(this.config.speaker, "switchSpeakerKeywords", [
              "把声音换成",
            ]);
          }
        } else {
          this.$set(this.config.speaker, "switchSpeakerKeywords", []);
        }
      }
    },
    removeTTSEngine(key) {
      this.$confirm("确定要删除该 TTS 引擎吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          removeEngine(key);
          if (this.selectedTTSEngine === key) {
            const defaultEngine = getDefaultEngine();
            this.selectedTTSEngine = defaultEngine.value;
            this.config.speaker.tts = defaultEngine.value;
            this.config.tts.baseUrl = defaultEngine.baseUrl;
          }
          this.$message.success("删除成功");
        })
        .catch(() => {});
    },
  },
  async created() {
    await this.loadConfig();
    // 初始检查一次服务状态
    await this.checkServiceHealth();

    // 设置定时器前先清除可能存在的旧定时器
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    // 设置新的定时器，每30秒检查一次
    this.healthCheckInterval = setInterval(this.checkServiceHealth, 30000);
  },
  beforeDestroy() {
    // 组件销毁前清除定时器
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  },
};
</script>

<style>
@import "./style.css";
</style>
