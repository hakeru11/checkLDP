// RandomCredentials.js
export class RandomCredentials {
    // Tạo tên người dùng ngẫu nhiên với định dạng "testxxx"
    static generateUsername() {
        const randomNumber = Math.floor(Math.random() * 100000); // Số ngẫu nhiên từ 0 đến 99999
        return `test${randomNumber.toString().padStart(8, '0')}`; // Đảm bảo luôn có 5 chữ số
    }

    // Tạo mật khẩu ngẫu nhiên với độ dài tùy ý (mặc định là 8 ký tự)
    static generatePassword(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }
}