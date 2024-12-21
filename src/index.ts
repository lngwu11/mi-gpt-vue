import { AISpeaker, AISpeakerConfig } from "./services/speaker/ai";
import { MyBot, MyBotConfig } from "./services/bot";
import { getDBInfo, initDB, runWithDB } from "./services/db";
import { kBannerASCII, kBannerEnd } from "./utils/string";
import { Logger } from "./utils/log";
import { deleteFile } from "./utils/io";

export type MiGPTConfig = Omit<MyBotConfig, "speaker"> & {
  speaker: Omit<AISpeakerConfig, "name">;
};

export class MiGPT {
  static instance: MiGPT | null;
  static logger = Logger.create({ tag: "MiGPT" });

  static create(config: MiGPTConfig) {
    try {
      console.log("开始创建 MiGPT 实例...");

      // 检查必要的配置
      if (!config?.speaker?.userId || !config?.speaker?.password) {
        throw new Error("缺少必要的配置: userId 或 password");
      }

      // 检查是否已有实例
      if (MiGPT.instance) {
        console.log("注意：正在重用现有实例");
        return MiGPT.instance;
      }

      // 创建新实例
      const instance = new MiGPT({ ...config, fromCreate: true });

      // 验证实例
      if (!instance.speaker) {
        throw new Error("Speaker 初始化失败");
      }

      // 保存为单例
      MiGPT.instance = instance;

      console.log("MiGPT 实例创建成功");
      return instance;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("MiGPT 实例创建失败:", error);
        console.error("错误堆栈:", error.stack);
      } else {
        console.error("MiGPT 实例创建失败:", String(error));
      }
      return null;
    }
  }

  static async reset() {
    if (MiGPT.instance) {
      try {
        await MiGPT.instance.stop();
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("停止实例时出错:", error);
        } else {
          console.error("停止实例时出错:", String(error));
        }
      }
    }
    MiGPT.instance = null;
    const { dbPath } = getDBInfo();
    await deleteFile(dbPath);
    await deleteFile(".mi.json");
    await deleteFile(".bot.json");
    MiGPT.logger.log("MiGPT 已重置");
  }

  ai: MyBot;
  speaker: AISpeaker;
  config: MiGPTConfig;

  constructor(config: MiGPTConfig & { fromCreate?: boolean }) {
    MiGPT.logger.assert(
      config.fromCreate,
      "请使用 MiGPT.create() 获取客户端实例！"
    );
    this.config = config;
    const { speaker, ...myBotConfig } = config;
    this.speaker = new AISpeaker(speaker);
    this.ai = new MyBot({
      ...myBotConfig,
      speaker: this.speaker,
    });
  }

  async start() {
    await initDB(this.speaker.debug);
    const main = () => {
      console.log(kBannerASCII);
      return this.ai.run();
    };
    return runWithDB(main);
  }

  async stop() {
    console.log(kBannerEnd);
    return this.ai.stop();
  }
}
