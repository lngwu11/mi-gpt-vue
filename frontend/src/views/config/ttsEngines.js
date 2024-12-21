/**
 * TTS 引擎配置
 */
export const ttsEngines = {
  // 默认引擎（不可删除）
  xiaoai: {
    label: '小爱同学',
    value: 'xiaoai',
    isDefault: true,
    baseUrl: '',  // 使用系统默认
    tooltip: '使用小爱同学内置 TTS 引擎',
    speakers: []  // 小爱同学不需要切换音色
  },
  // 自定义引擎示例（可删除）
  azure: {
    label: 'Azure TTS',
    value: 'custom',
    isDefault: false,
    baseUrl: 'https://your-azure-endpoint/tts',
    tooltip: 'Azure TTS 服务',
    speakers: [
      { label: 'xiaoxiao', value: 'zh-CN-XiaoxiaoNeural' },
      { label: 'xiaoyi', value: 'zh-CN-XiaoyiNeural' },
      { label: 'xiaozhen', value: 'zh-CN-XiaoZhenNeural' }
    ]
  },
  aliyun: {
    label: '阿里云 TTS',
    value: 'custom',
    isDefault: false,
    baseUrl: 'https://your-aliyun-endpoint/tts',
    tooltip: '阿里云 TTS 服务',
    speakers: [
      { label: 'xiaoyun', value: 'xiaoyun' },
      { label: 'xiaogang', value: 'xiaogang' },
      { label: 'xiaomei', value: 'xiaomei' }
    ]
  }
};

/**
 * 获取默认 TTS 引擎
 */
export function getDefaultEngine() {
  return Object.values(ttsEngines).find(engine => engine.isDefault);
}

/**
 * 添加新的 TTS 引擎
 * @param {string} key - 引擎标识
 * @param {string} label - 显示名称
 * @param {string} baseUrl - 服务地址
 */
export function addEngine(key, label, baseUrl) {
  ttsEngines[key] = {
    label,
    value: 'custom',
    isDefault: false,
    baseUrl,
    tooltip: '自定义 TTS 服务',
    speakers: []  // 可以后续添加音色
  };
}

/**
 * 删除 TTS 引擎
 * @param {string} key - 引擎标识
 */
export function removeEngine(key) {
  if (ttsEngines[key] && !ttsEngines[key].isDefault) {
    delete ttsEngines[key];
  }
} 