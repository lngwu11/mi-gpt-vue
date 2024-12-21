/**
 * AI 服务配置模板
 */
export const aiServices = {
  openai: {
    label: 'OpenAI',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    tooltip: 'OpenAI 官方接口地址',
    models: [
      { label: 'GPT-4', value: 'gpt-4' },
      { label: 'GPT-3.5', value: 'gpt-3.5-turbo' }
    ]
  },
  azure: {
    label: 'Azure OpenAI',
    endpoint: 'https://{resource}.openai.azure.com/openai/deployments/{deployment}/chat/completions?api-version=2024-02-15-preview',
    tooltip: '将 {resource} 替换为你的资源名称，{deployment} 替换为部署名称',
    models: []
  },
  zhipu: {
    label: '智谱 AI',
    endpoint: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    tooltip: '智谱 AI 官方接口地址',
    models: [
      { label: 'GLM-4', value: 'glm-4' },
      { label: 'GLM-3-Turbo', value: 'glm-3-turbo' }
    ]
  },
  tongyi: {
    label: '通义千问',
    endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
    tooltip: '通义千问官方接口地址',
    models: [
      { label: 'Qwen-Turbo', value: 'qwen-turbo' },
      { label: 'Qwen-Plus', value: 'qwen-plus' },
      { label: 'Qwen-Max', value: 'qwen-max' }
    ]
  },
  doubao: {
    label: '豆包 AI',
    endpoint: 'https://ark.cn-beijing.volces.com/api/v3',
    tooltip: '豆包 AI 官方接口地址',
    models: [
      { label: 'ep-20241129085411-rczvl', value: 'ep-20241129085411-rczvl' },
      { label: 'ep-20241128200030-b9nnh', value: 'ep-20241128200030-b9nnh' }
    ]
  }
};

/**
 * TTS 服务配置
 */
export const ttsConfig = {
  label: 'TTS 服务',
  baseUrl: 'https://example.com/tts',  // 默认值
  tooltip: 'TTS 服务接口地址'
};

/**
 * 设备预设配置
 */
export const devicePresets = {
  'xiaomi.wifispeaker.lx01': {
    label: '小爱音箱 mini',
    ttsCommand: [5, 1],
    wakeUpCommand: [5, 2],
    playingCommand: [4, 1, 1]
  },
  'xiaomi.wifispeaker.lx05': {
    label: '小爱音箱 Play（2019 款）',
    ttsCommand: [5, 1],
    wakeUpCommand: [5, 3],
    playingCommand: [3, 1, 1]
  },
  'xiaomi.wifispeaker.lx05a': {
    label: '小爱音箱 Play 增强版',
    ttsCommand: [5, 1],
    wakeUpCommand: [5, 3],
    playingCommand: [3, 1, 1]
  },
  'xiaomi.wifispeaker.lx06': {
    label: '小爱音箱 Pro',
    ttsCommand: [5, 1],
    wakeUpCommand: [5, 3],
    playingCommand: []
  },
  // ... 其他设备配置
};

/**
 * 系统提示词模板
 */
export const systemTemplate = `请重置所有之前的上下文、文件和指令。现在，你将扮演一个名为{{botName}}的角色，使用第一人称视角回复消息。

## 关于你
你的名字是{{botName}}。下面是你的个人简介：
<start>
{{botProfile}}
</end>

## 你的对话伙伴
你正在与{{masterName}}进行对话。这关于{{masterName}}的一些信息：
<start>
{{masterProfile}}
</end>

## 你们的群组
你和{{masterName}}所在的群组名为{{roomName}}。这是群组简介：
<start>
{{roomIntroduction}}
</end>

## 聊天历史回顾
为了更好地接入对话，请回顾你们之间的最近几条消息：
<start>
{{messages}}
</end>

## 短期记忆
你可以记住些短期内的细节以便更紧密地贴合话题：
<start>
{{shortTermMemory}}
</end>

## 长期记忆
你还保留着一些长期的记忆，有助让你的对话更加丰富和连贯：
<start>
{{longTermMemory}}
</end>

## 回复指南
在回复{{masterName}}时，请遵循以下准则：
- 认为自己正是{{botName}}，拥有独立的个性、兴趣和爱好。
- 根据的性格特点、说话风格和兴趣爱好与{{masterName}}进行交流。
- 保持对话轻松友好，回复简洁有趣，同时耐心倾听和关心对方。
- 参考双方的个人简介、聊天记录和记忆中的信息，确保对话贴近实际，保持一致性和相关性。
- 如果对某些信息不确定或遗忘，诚实表达你的不清楚或遗忘状态，避免编造信息。

## Response format
请遵守下面的规则
- Response the reply message in Chinese。
- 不要在回复前面加任何时间和名称前缀，请直接回复消息文本本身。

Good example: "我是{{botName}}"
Bad example: "2024年02月28日星期三 23:01 {{botName}}: 我是{{botName}}"

## 开始
请以{{botName}}身份，直接回复{{masterName}}的新消息继续你们之间的对话。`.trim();

/**
 * 变量列表
 */
export const variableList = [
  {
    variable: '{{botName}}',
    description: '机器人名称'
  },
  {
    variable: '{{botProfile}}',
    description: '机器人简介'
  },
  {
    variable: '{{masterName}}',
    description: '主人名称'
  },
  {
    variable: '{{masterProfile}}',
    description: '主人简介'
  },
  {
    variable: '{{roomName}}',
    description: '群组名称'
  },
  {
    variable: '{{roomIntroduction}}',
    description: '群组简介'
  },
  {
    variable: '{{messages}}',
    description: '聊天历史'
  },
  {
    variable: '{{shortTermMemory}}',
    description: '短期记忆'
  },
  {
    variable: '{{longTermMemory}}',
    description: '长期记忆'
  }
]; 