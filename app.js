import config from "./migpt.js";
import { MiGPT } from "./dist/index.cjs";
import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { createServer } from 'net';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

let miGPTInstance = null;

// 解析配置字符串的函数
function parseConfig(configStr) {
  try {
    // 移除 export default 和结尾的分号
    const jsonStr = configStr
      .replace(/export\s+default\s+/, '')
      .replace(/;$/, '')
      .trim();

    // 使用 JSON.parse 而不是 eval
    try {
      return JSON.parse(jsonStr);
    } catch (parseError) {
      // 如果 JSON.parse 失败，尝试使用 eval（不推荐，但作为后备方案）
      const config = eval(`(${jsonStr})`);
      if (typeof config !== 'object') {
        throw new Error('解析结果不是有效的对象');
      }
      return config;
    }
  } catch (error) {
    throw new Error(`配置解析失败: ${error.message}`);
  }
}

// 重载配置的函数
async function reloadMiGPTConfig(newConfig) {
  try {
    if (!miGPTInstance) {
      throw new Error('MiGPT 服务未启动');
    }

    console.log('\n=== 正在更新 MiGPT 配置 ===');

    // 验证新配置
    if (!newConfig.speaker?.userId || !newConfig.speaker?.password) {
      throw new Error('配置验证失败: 缺少必要的配置项');
    }

    // 停止当前实例
    await miGPTInstance.stop();

    // 使用新配置创建新实例
    miGPTInstance = MiGPT.create(newConfig);

    // 启动新实例
    await miGPTInstance.start();

    console.log('配置信息:', {
      botName: newConfig.bot?.name,
      masterName: newConfig.master?.name,
      did: newConfig.speaker?.did
    });

    console.log('配置更新成功');
    console.log('========================\n');

    return true;
  } catch (error) {
    console.error('\n=== 更新配置失败 ===');
    console.error('错误信息:', error.message);
    console.error('========================\n');
    throw error;
  }
}

// 初始化 MiGPT 实例
async function initMiGPT() {
  try {
    console.log('正在初始化 MiGPT 服务...');
    console.log('当前实例状态:', miGPTInstance ? '存在' : '不存在');

    // 1. 如果存在旧实例，先完全清理
    if (miGPTInstance) {
      console.log('清理旧实例...');
      try {
        await miGPTInstance.stop();
        console.log('实例已停止');
      } catch (error) {
        console.error('清理旧实例时出错:', error);
      }
      miGPTInstance = null;
      console.log('等待资源释放...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // 2. 读取最新配置
    console.log('读取配置...');
    const configFile = fs.readFileSync('./migpt.js', 'utf8');
    const configModule = await import(`data:text/javascript,${encodeURIComponent(configFile)}`);
    const freshConfig = configModule.default;

    // 3. 检查配置
    if (!freshConfig.speaker?.userId || !freshConfig.speaker?.password) {
      console.log('\n=== 等待配置 ===');
      console.log('请通过Web界面完成配置');
      console.log('================\n');
      return null;
    }

    // 4. 创建新实例
    console.log('创建新实例...');
    try {
      const instance = MiGPT.create(freshConfig);

      if (!instance) {
        throw new Error('MiGPT.create() 返回 null');
      }

      // 验证实例
      if (!instance.speaker) {
        throw new Error('实例缺少 speaker 组件');
      }

      // 5. 赋值给全局变量
      miGPTInstance = instance;
      console.log('新实例创建成功');
    } catch (error) {
      console.error('实例创建失败:', error);
      console.error('错误堆栈:', error.stack);
      throw error;
    }

    // 6. 启动服务
    console.log('启动服务...');
    try {
      // 启动运行循环
      if (miGPTInstance.speaker) {
        console.log('启动消息监听...');
        // 初始化服务
        await miGPTInstance.speaker.initMiServices();

        if (!miGPTInstance.speaker.MiNA) {
          throw new Error('MiNA 服务初始化失败');
        }

        // 启动服务（不等待完成）
        miGPTInstance.start().catch(error => {
          console.error('消息监听循环出错:', error);
        });

        // 等待一小段时间确保服务正常启动
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 检查服务状态
        if (miGPTInstance.speaker.status !== 'running') {
          throw new Error('服务启动异常');
        }

        console.log('消息监听已启动');
      } else {
        throw new Error('Speaker 组件未初始化');
      }

    } catch (error) {
      console.error('启动服务时出错:', error);
      // 清理未完全初始化的实例
      if (miGPTInstance) {
        try {
          await miGPTInstance.stop();
        } catch (stopError) {
          console.error('清理失败的实例时出错:', stopError);
        }
        miGPTInstance = null;
      }
      throw new Error('启动服务失败: ' + error.message);
    }
    console.log('服务启动成功');

    console.log('MiGPT 服务初始化完成');
    return miGPTInstance;
  } catch (error) {
    console.error('初始化失败:', error);
    console.error('错误堆栈:', error.stack);
    miGPTInstance = null;
    throw error;
  }
}

// 配置相路由
app.post('/api/config', async (req, res) => {
  try {
    const config = req.body;
    // 将配置格式化为 JavaScript 块格式
    const configContent = `export default ${JSON.stringify(config, null, 2)};`;

    // 写入到 migpt.js 配置文件
    await fs.promises.writeFile('./migpt.js', configContent, 'utf8');
    await fs.promises.writeFile('./.migpt.example.js', configContent, 'utf8');

    // 获取当前选中的 AI 服务配置
    const selectedService = Object.keys(config).find(key =>
      ['openai', 'azure', 'zhipu', 'tongyi', 'doubao', 'custom'].includes(key) &&
      config[key]?.apiKey &&
      config[key]?.model &&
      config[key]?.endpoint
    );

    // 构建 .env 内容
    const envLines = [];

    // 如果有选中的 AI 服务配置，添加到 .env 文件
    if (selectedService) {
      const serviceConfig = config[selectedService];
      envLines.push(
        `OPENAI_API_KEY=${serviceConfig.apiKey}`,
        `OPENAI_MODEL=${serviceConfig.model}`,
        `OPENAI_BASE_URL=${serviceConfig.endpoint.replace('/chat/completions', '')}`
      );
    }

    // 如果使用自定义 TTS，添加 TTS 配置到 .env 文件
    if (config.speaker?.tts === 'custom' && config.tts?.baseUrl) {
      envLines.push(`TTS_BASE_URL=${config.tts.baseUrl}`);
    }

    // 确保有内容才写入文件
    if (envLines.length > 0) {
      const envContent = envLines.join('\n');
      await fs.promises.writeFile('.env', envContent, 'utf8');
      //console.log('.env 文件已更新');
    }

    // 如果服务正在运行，需要重启才能生效
    const needRestart = miGPTInstance !== null;

    res.setHeader('Content-Type', 'application/json');
    res.json({
      success: true,
      message: '配置已保存',
      needRestart
    });
  } catch (error) {
    console.error('保存配置失败:', error);
    res.status(500).json({
      error: '保存配置失败: ' + error.message
    });
  }
});

app.get('/api/config', async (req, res) => {
  try {
    // 检查配置文件是否存在
    if (!fs.existsSync('./migpt.js')) {
      // 如果不存在，尝试复制示例配置
      const exampleConfig = await fs.promises.readFile('.migpt.example.js', 'utf8');
      await fs.promises.writeFile('./migpt.js', exampleConfig, 'utf8');
      //console.log('已创建默认配置文件');
    }

    // 读取配置文件
    const config = await fs.promises.readFile('./migpt.js', 'utf8');

    if (!config) {
      throw new Error('配文件为空');
    }

    // console.log('读取到的配置:', config); // 添加调试日志

    res.setHeader('Content-Type', 'application/json');
    res.json({ config });
  } catch (error) {
    //console.error('读配置失败:', error);
    // 返回更详细的错误信息
    res.status(500).json({
      error: '读取配置失败',
      details: error.message,
      stack: error.stack
    });
  }
});

app.get('/api/config/example', async (req, res) => {
  try {
    // 检查示例配置文件是否存在
    if (!fs.existsSync('.migpt.example.js')) {
      throw new Error('示例配置文件不存在');
    }

    // 读取示例配置文件
    const config = await fs.promises.readFile('.migpt.example.js', 'utf8');

    if (!config) {
      throw new Error('示例配置文件为空');
    }

    //console.log('读取的示例配置:', config); // 添加调试日志

    res.setHeader('Content-Type', 'application/json');
    res.json({ config });
  } catch (error) {
    console.error('读取示例配置失败:', error);
    res.status(500).json({
      error: '读取示例配置失败',
      details: error.message,
      stack: error.stack
    });
  }
});

app.get('/api/service/health', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  // 添加更多的安全检查
  const status = {
    serverRunning: true,
    miGPTRunning: false,
    config: null,
    needConfig: true
  };

  try {
    if (miGPTInstance) {
      status.miGPTRunning = true;

      // 检查配置是否存在且有
      if (miGPTInstance.config &&
        miGPTInstance.config.bot &&
        miGPTInstance.config.master) {
        status.config = {
          botName: miGPTInstance.config.bot.name || '',
          masterName: miGPTInstance.config.master.name || ''
        };
        status.needConfig = false;
      }
    }

    res.json(status);
  } catch (error) {
    console.error('健康检查失败:', error);
    res.json({
      serverRunning: true,
      miGPTRunning: false,
      config: null,
      needConfig: true,
      error: error.message
    });
  }
});

app.post('/api/service/start', async (req, res) => {
  try {
    console.log('\n=== 启动 MiGPT 服务 ===');

    // 初始化实例
    const instance = await initMiGPT();

    if (!instance || !instance.speaker) {
      throw new Error('服务初始化失败');
    }

    // 检查服务状态
    if (instance.speaker.status !== 'running') {
      throw new Error('服务启动异常');
    }

    console.log('MiGPT 服务启动成功');
    console.log('=====================\n');

    res.json({
      success: true,
      status: {
        serverRunning: true,
        miGPTRunning: true,
        config: {
          botName: instance.config?.bot?.name || '',
          masterName: instance.config?.master?.name || ''
        }
      }
    });

  } catch (error) {
    console.error('启动服务失败:', error);
    if (miGPTInstance) {
      await miGPTInstance.stop();
    }
    miGPTInstance = null;
    res.status(500).json({ error: '启动服务失败: ' + error.message });
  }
});

app.post('/api/service/stop', async (req, res) => {
  try {
    if (!miGPTInstance) {
      res.setHeader('Content-Type', 'application/json');
      res.status(400).json({ error: '服务未运行' });
      return;
    }

    console.log('\n=== 正在停止 MiGPT 服务 ===');

    try {
      // 使用 stop() 方法停止服务
      await miGPTInstance.stop();
      console.log('服务已停止');
    } catch (stopError) {
      console.error('停止服务时出错:', stopError);
    }

    // 确保完全清理实例
    miGPTInstance = null;

    // 等待资源释放
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('MiGPT 服务已停止');
    console.log('========================\n');

    res.json({ success: true });
  } catch (error) {
    console.error('停止服务失败:', error);
    miGPTInstance = null;
    res.status(500).json({ error: '停止服务失败: ' + error.message });
  }
});

app.post('/api/service/restart', async (req, res) => {
  try {
    console.log('\n=== 正在重启 MiGPT 服务 ===');

    // 1. 停止当前服务
    if (miGPTInstance) {
      console.log('停止当前服务...');
      try {
        await miGPTInstance.stop();
        console.log('服务已停止');
      } catch (stopError) {
        console.error('停止服务时出错:', stopError);
      }
      miGPTInstance = null;
    }

    // 2. 等待资源释放
    console.log('等待资源释放...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 3. 创建新实例
    console.log('创建新实例...');
    const configFile = fs.readFileSync('./migpt.js', 'utf8');
    const configModule = await import(`data:text/javascript,${encodeURIComponent(configFile)}`);
    const freshConfig = configModule.default;

    // 检查配置
    if (!freshConfig.speaker?.userId || !freshConfig.speaker?.password) {
      throw new Error('缺少必要参配置');
    }

    // 创建实例
    const instance = MiGPT.create(freshConfig);
    if (!instance || !instance.speaker) {
      throw new Error('实例创建失败');
    }

    // 4. 初始化服务
    console.log('初始化服务...');
    await instance.speaker.initMiServices();

    if (!instance.speaker.MiNA) {
      throw new Error('MiNA 服务初始化失败');
    }

    // 5. 保存为全局实例
    miGPTInstance = instance;

    // 6. 启动消息监听（不等待完成）
    instance.start().catch(error => {
      console.error('服务运行出错:', error);
      miGPTInstance = null;
    });

    // 7. 等待服务就绪
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 8. 检查服务状态
    if (instance.speaker.status !== 'running') {
      throw new Error('服务启动异常');
    }

    console.log('MiGPT 服务重启完成');
    console.log('========================\n');

    // 9. 立即返回状态
    res.json({
      success: true,
      message: 'MiGPT 服务已重启',
      status: {
        serverRunning: true,
        miGPTRunning: true,
        config: {
          botName: instance.config?.bot?.name || '',
          masterName: instance.config?.master?.name || ''
        }
      }
    });
  } catch (error) {
    console.error('重启服务失败:', error);
    miGPTInstance = null;
    res.status(500).json({
      success: false,
      error: '重启服务失败: ' + error.message
    });
  }
});

// 提供 Vue 应用的静态文件
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// 所有其他请求都重定向到 Vue 应用
app.get('*', (req, res) => {
  // 查文件是否存在
  const indexPath = path.join(__dirname, 'frontend/dist', 'index.html');
  if (!fs.existsSync(indexPath)) {
    return res.status(404).send('请先构建前端项目：cd frontend && npm run build');
  }
  res.sendFile(indexPath);
});

// 修改检查端口是否可用的函数
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = createServer();

    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false);
      }
    });

    server.once('listening', () => {
      server.close();
      resolve(true);
    });

    server.listen(port);
  });
}

// 查找可用端口的函数
async function findAvailablePort(startPort) {
  let port = startPort;
  while (!(await isPortAvailable(port))) {
    port++;
    if (port > startPort + 100) { // 多尝试100个端口
      throw new Error('无法找到可用端口');
    }
  }
  return port;
}

// 修改启动服务器的代码
const startServer = async () => {
  try {
    const preferredPort = process.env.PORT || 3000;
    const port = await findAvailablePort(preferredPort);

    app.listen(port, async () => {
      console.log('\n=== 服务器启动信息 ===');
      console.log(`Web 服务运行: http://localhost:${port}`);
      if (port !== preferredPort) {
        console.log(`注意: 端口 ${preferredPort} 已被用，动切换到端口 ${port}`);
      }
      console.log('请通过 Web 界面启动 MiGPT 服务');
      console.log('=====================\n');
    });
  } catch (error) {
    console.error('\n=== 服务器启动失败 ===');
    console.error('错误信息:', error.message);
    console.error('=====================\n');
    process.exit(1);
  }
};

// 启动服务器
startServer();

// 优雅退出
process.on('SIGINT', async () => {
  if (miGPTInstance) {
    console.log('\n=== 正在停止服务 ===');
    console.log('正在关闭 MiGPT 服务...');
    await miGPTInstance.stop();
    miGPTInstance = null;
    console.log('MiGPT 服务已停止');
    console.log('===================\n');
  }
  process.exit(0);
});

// 添加统一的错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    error: err.message || '服务器内部错误'
  });
});

// 读取 .env 文件
app.get('/api/config/env', async (req, res) => {
  try {
    const envPath = path.join(__dirname, '.env');

    // 检查文件是否存在
    if (!fs.existsSync(envPath)) {
      // 如果文件不存在，返回空配置而不是错误
      return res.json({
        OPENAI_API_KEY: '',
        OPENAI_MODEL: '',
        OPENAI_BASE_URL: '',
        TTS_BASE_URL: '',
        TTS_SWITCH_KEYWORDS: ''
      });
    }

    const envContent = await fs.promises.readFile(envPath, 'utf8');
    const envConfig = {};

    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        envConfig[key.trim()] = value.trim();
      }
    });

    // 返回所有必需的字段
    res.json({
      OPENAI_API_KEY: envConfig.OPENAI_API_KEY || '',
      OPENAI_MODEL: envConfig.OPENAI_MODEL || '',
      OPENAI_BASE_URL: envConfig.OPENAI_BASE_URL || '',
      TTS_BASE_URL: envConfig.TTS_BASE_URL || '',
      TTS_SWITCH_KEYWORDS: envConfig.TTS_SWITCH_KEYWORDS || ''
    });
  } catch (error) {
    console.error('读取 .env 文件失败:', error);
    // 发生错误时返回空配置而不是错误状态
    res.json({
      OPENAI_API_KEY: '',
      OPENAI_MODEL: '',
      OPENAI_BASE_URL: '',
      TTS_BASE_URL: '',
      TTS_SWITCH_KEYWORDS: ''
    });
  }
});

// 更新 .env 文件
app.post('/api/config/env', async (req, res) => {
  try {
    const { OPENAI_API_KEY, OPENAI_MODEL, OPENAI_BASE_URL, TTS_BASE_URL, TTS_SWITCH_KEYWORDS } = req.body;

    // 验证必需的字段
    if (!OPENAI_API_KEY || !OPENAI_MODEL || !OPENAI_BASE_URL) {
      return res.status(400).json({
        success: false,
        error: '缺少必需的配置字段'
      });
    }

    const envContent = `OPENAI_API_KEY=${OPENAI_API_KEY}
OPENAI_MODEL=${OPENAI_MODEL}
OPENAI_BASE_URL=${OPENAI_BASE_URL}
TTS_BASE_URL=${TTS_BASE_URL || ''}
TTS_SWITCH_KEYWORDS=${TTS_SWITCH_KEYWORDS || ''}`;

    const envPath = path.join(__dirname, '.env');
    await fs.promises.writeFile(envPath, envContent, 'utf8');

    res.json({
      success: true,
      message: '.env 文件已更新'
    });
  } catch (error) {
    console.error('更新 .env 文件失败:', error);
    res.status(500).json({
      success: false,
      error: '更新 .env 文件失败: ' + error.message
    });
  }
});
