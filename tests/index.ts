import { MiGPT } from "../src";
// @ts-ignore
import config from "../migpt.js";

/**
 * 主函数，用于启动MiGPT客户端
 */
async function main() {
  // 创建MiGPT客户端
  const client = MiGPT.create(config);
  // 检查客户端是否成功创建
  if (client) {
    // 启动客户端
    await client.start();
  } else {
    console.error("客户端创建失败");
  }
}

// 调用主函数
main();
