const { expect } = require("@playwright/test");

class UK88 {
    constructor(page) {
      this.page = page;
      this.uTenDangNhap_DK_Txt = page.locator("//div[@id='register']//input[@name='username']");
      this.MatKhau_DK_Txt = page.locator("//div[@id='register']//input[@name='password']");
      this.Phone_Txt = page.locator("//div[@id='register']//input[@name='phone']");
      this.DangKy_DK_Btn = page.locator("//*[@id='registerForm']//button[@type='submit']");
      this.Header_user = page.locator("//*[@id='header']//div[@class='user-login']");
    }


    // delay
    async delay() {
        await this.page.waitForTimeout(1000); // Chờ 3 giây
    }


    // goto URL
    async navigate(url) {
        try {
            await this.page.goto(url, { waitUntil: 'networkidle', timeout: 20000 }); // Tăng thời gian chờ lên 60 giây
        } catch (error) {
            console.error('Lỗi khi điều hướng:', error.message);
            // Bạn có thể ném lỗi ra ngoài nếu muốn
            throw error;
        }
    }


    // Đăng ký
    async register(username, password, phonenumber) {
        try {
            await this.uTenDangNhap_DK_Txt.fill(username);
            await this.delay();
            await this.MatKhau_DK_Txt.fill(password);
            await this.delay();
            await this.Phone_Txt.fill(phonenumber);
            await this.delay();
            await this.DangKy_DK_Btn.click({ force: true });
            await this.page.waitForTimeout(6000);
        } catch (error) {
            console.error('Lỗi khi đăng ký:', error.message);
            throw error; // Ném lại lỗi để xử lý ở nơi khác nếu cần
        }
    }


    // Verify đăng ký thành công
    async verifyDangKyThanhCongUK88(domain){
        try{
            await this.delay();
            await expect(this.Header_user).toBeVisible();
            await this.delay();

        }catch(error){
            throw error; // Ném lại lỗi để xử lý ở nơi khác nếu cần
        }
    }
  }
  
  module.exports = UK88;