import { RandomCredentials } from '../utils/randomdata';
require('dotenv').config();
const TelegramBotService = require('../utils/telegramBot');
const { test, expect } = require('@playwright/test');
const UK88 = require('../pages/UK88');
import getUrls from '../utils/sheet';
const path = require('path');

// Lấy các biến môi trường từ file .env
const spreadsheetId = process.env.SPREADSHEETID;
const columnRange = process.env.COLUMN_RANGE;  // Điều chỉnh tên biến tương ứng với phạm vi cột (ví dụ: 'B3:B')
const TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

const sheetName = path.basename(__filename, '.spec.js');  // Tên của sheet dựa trên tên tệp hiện tại
const dataFetcher = new getUrls(spreadsheetId, sheetName, columnRange);

// Lấy URL từ Google Sheets trước khi chạy các test
let urls = [];

test.beforeAll(async () => {
  urls = await getUrlsFromSheet();
  console.log('URLs lấy từ Google Sheets:', urls);
});

async function getUrlsFromSheet() {
  try {
    const urls = await dataFetcher.getColumnData();
    return urls;
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu từ Google Sheets:', error.message);
    return [];
  }
}

// Kiểm tra các URL
test('Check Register and navigate to game screen for all URLs', async ({page}) => {
  const bot = new TelegramBotService(TOKEN, CHAT_ID);

  for (const url of urls) {
    const uk88 = new UK88(page);

    try {
      console.log(`Đang điều hướng đến: ${url}`);
      await uk88.navigate(url);

      // Tạo username + password random
      const username = RandomCredentials.generateUsername();
      const password = RandomCredentials.generatePassword(10);
      const phone = RandomCredentials.generateRandomPhoneNumber();

      // Thực hiện đăng ký username, password
      await uk88.register(username, password, phone);

      // Verify tài khoản thành công và chuyển sang màn hình game
      await uk88.verifyDangKyThanhCongUK88(url);

      console.log(`✅ Đã đăng ký tài khoản thành công cho URL: ${url}`);
      console.log("username: " + username);
      console.log("password: " + password);
      console.log("========================== \n");
    } catch (error) {
      console.error(`❌ Lỗi khi truy cập ${url}:`, error.message);

      // Thông báo lỗi qua Telegram nếu có lỗi
      await bot.sendMessage(`❌ Lỗi khi truy cập ${url}:` + error.message);

      // Đánh dấu test case là thất bại
      expect(error).toBeNull(); // Buộc test thất bại
    }
  }
});

// In thông báo tổng kết sau khi chạy tất cả test case (nếu cần thiết).
test.afterAll(async () => {
  console.log("🎉 Đã hoàn thành Đăng Ký tài khoản cho tất cả các URL: " + sheetName);
  const bot = new TelegramBotService(TOKEN, CHAT_ID);
  await bot.sendMessage("🎉 Đã Đăng Ký tài khoản Thành Công cho tất cả các URL: " + sheetName);
});