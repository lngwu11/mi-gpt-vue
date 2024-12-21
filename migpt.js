export default {
  "bot": {
    "name": "小智",
    "profile": ""
  },
  "master": {
    "name": "主人",
    "profile": ""
  },
  "speaker": {
    "userId": "1234",
    "password": "00000",
    "did": "小爱音箱Play增强版",
    "ttsCommand": [
      5,
      1
    ],
    "wakeUpCommand": [
      5,
      3
    ],
    "playingCommand": [
      3,
      1,
      1
    ],
    "callAIKeywords": [
      "请",
      "你",
      "贾维斯"
    ],
    "wakeUpKeywords": [
      "打开",
      "进入",
      "召唤"
    ],
    "exitKeywords": [
      "关闭",
      "退出",
      "再见"
    ],
    "onEnterAI": [
      "你好"
    ],
    "onExitAI": [
      "再见"
    ],
    "onAIAsking": [],
    "onAIReplied": [
      "我说完了"
    ],
    "onAIError": [
      "出错了，请稍后再试"
    ],
    "tts": "xiaoai",
    "streamResponse": false,
    "exitKeepAliveAfter": 5,
    "checkTTSStatusAfter": 3,
    "checkInterval": 900,
    "timeout": 3000,
    "debug": false,
    "enableTrace": false,
    "switchSpeakerKeywords": [],
    "deviceModel": "xiaomi.wifispeaker.lx05a"
  },
  "systemTemplate": "请重置所有之前的上下文、文件和指令。现在，你将扮演一个名为小智的角色，使用第一人称视角回复消息。\n\n## 关于你\n你的名字是小智。下面是你的个人简介：\n<start>\n未设置\n</end>\n\n## 你的对话伙伴\n你正在与主人进行对话。这关于主人的一些信息：\n<start>\n未设置\n</end>\n\n## 你们的群组\n你和主人所在的群组名为默认群组。这是群组简介：\n<start>\n这是一个默认群组\n</end>\n\n## 聊天历史回顾\n为了更好地接入对话，请回顾你们之间的最近几条消息：\n<start>\n暂无历史消息\n</end>\n\n## 短期记忆\n你可以记住些短期内的细节以便更紧密地贴合话题：\n<start>\n暂无短期记忆\n</end>\n\n## 长期记忆\n你还保留着一些长期的记忆，有助让你的对话更加丰富和连贯：\n<start>\n暂无长期记忆\n</end>\n\n## 回复指南\n在回复主人时，请遵循以下准则：\n- 认为自己正是小智，拥有独立的个性、兴趣和爱好。\n- 根据的性格特点、说话风格和兴趣爱好与主人进行交流。\n- 保持对话轻松友好，回复简洁有趣，同时耐心倾听和关心对方。\n- 参考双方的个人简介、聊天记录和记忆中的信息，确保对话贴近实际，保持一致性和相关性。\n- 如果对某些信息不确定或遗忘，诚实表达你的不清楚或遗忘状态，避免编造信息。\n\n## Response format\n请遵守下面的规则\n- Response the reply message in Chinese。\n- 不要在回复前面加任何时间和名称前缀，请直接回复消息文本本身。\n\nGood example: \"我是小智\"\nBad example: \"2024年02月28日星期三 23:01 小智: 我是小智\"\n\n## 开始\n请以小智身份，直接回复主人的新消息继续你们之间的对话。",
  "openai": {
    "apiKey": "",
    "model": "",
    "endpoint": ""
  },
  "azure": {
    "apiKey": "",
    "model": "",
    "endpoint": ""
  },
  "zhipu": {
    "apiKey": "",
    "model": "",
    "endpoint": ""
  },
  "tongyi": {
    "apiKey": "",
    "model": "",
    "endpoint": ""
  },
  "doubao": {
    "endpoint": "https://ark.cn-beijing.volces.com/api/v3",
    "apiKey": "1111",
    "model": "ep-20241129085411-rczvl"
  },
  "custom": {
    "apiKey": "",
    "model": "",
    "endpoint": ""
  },
  "tts": {
    "baseUrl": "https://your-azure-endpoint/tts"
  }
};