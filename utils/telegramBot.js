const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');



class TelegramBotService {
  constructor(token, chatId) {
    this.token = token;             // Token của bot Telegram
    this.chatId = chatId;           // ID của chat để gửi tin nhắn
    this.bot = new TelegramBot(token, { polling: false }); // Khởi tạo bot
  }

  // Phương thức gửi tin nhắn qua Telegram
  async sendMessage(message) {
    try {
      await this.bot.sendMessage(this.chatId, message);
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error.message);
    }
  }

  // Hàm gửi file qua Telegram Bot
async sendFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error('File does not exist');
    }

    await bot.sendDocument(this.chatId, fs.createReadStream(filePath));
  } catch (error) {
    console.error('Error sending report:', error.message);
  }
}
// Hàm kiểm tra file đã sẵn sàng
async waitForFile(filePath, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const interval = setInterval(() => {
      if (fs.existsSync(filePath) && fs.statSync(filePath).size > 0) {
        clearInterval(interval);
        resolve();
      } else if (Date.now() - startTime > timeout) {
        clearInterval(interval);
        reject(new Error('File not ready within timeout.'));
      }
    }, 1000); // Kiểm tra mỗi giây
  });
}
}

module.exports = TelegramBotService;