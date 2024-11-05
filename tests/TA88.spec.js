import { RandomCredentials } from '../utils/randomdata';
require('dotenv').config();
const TelegramBotService = require('../utils/telegramBot');
const { test } = require('@playwright/test');
const TA88 = require('../pages/TA88');
const getUrls = require('../utils/sheet');
const path = require('path');



// Lấy các biến môi trường từ file .env
const filePath = process.env.EXCEL_FILE_PATH;
const columnLetter = process.env.COLUMN_LETTER;
const TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

const sheetName = path.basename(__filename, '.spec.js');
const urls = getUrls(filePath, sheetName, columnLetter);
const bot = new TelegramBotService(TOKEN, CHAT_ID);

// Tạo test case riêng biệt cho từng URL
for (const url of urls) {
    test(`Check Register and navigate to game screen for URL: ${url}`, async ({ page }) => {
        const ta88 = new TA88(page);
        try {
            console.log(`Đang điều hướng đến: ${url}`);
            
            await ta88.navigate(url);
            // tạo username + password random
            const username = RandomCredentials.generateUsername();
            const password = RandomCredentials.generatePassword(10);
            const phone = RandomCredentials.generateRandomPhoneNumber();
            // thực hiện đăng ký username, password
            await ta88.register(username, password, phone);
            
            // verify tạo account thành công và chuyển sang màn hình gameScreen
            await ta88.verifyDangKyThanhCongTA88(url);

            console.log(`✅ Đã đăng ký tài khoản thành công cho URL: ${url}`);
            console.log("username: " + username);
            console.log("password: " + password);
            console.log("========================== \n");
        } catch (error) {
            console.error(`❌ Lỗi khi truy cập ${url}:`, error.message);

            // thông báo lỗi qua telegram nếu truy cập trang hoặc đăng ký lỗi
            await bot.sendMessage(`❌ Lỗi khi truy cập ${url}:` + error.message);

            // Đánh dấu test case là thất bại
            expect(error).toBeNull(); // Buộc test thất bại với thông báo lỗi
        }
    });
}

// In thông báo tổng kết sau khi chạy tất cả test case (nếu cần thiết).
test.afterAll(async () => {
    console.log("🎉 Đã hoàn thành Đăng Ký tài khoản cho tất cả các URL: " + sheetName);

    // thông báo hoàn thành đăng ký cho tất cả các Url qua bot telegram
    await bot.sendMessage("🎉 Đã Đăng Ký tài khoản Thành Công cho tất cả các URL: " + sheetName);
});