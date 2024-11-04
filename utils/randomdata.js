// RandomCredentials.js
export class RandomCredentials {
    // Tạo tên người dùng ngẫu nhiên với định dạng "testxxx"
    static generateUsername() {
        const randomNumber = Math.floor(Math.random() * 100000); // Số ngẫu nhiên từ 0 đến 99999
        return `test${randomNumber.toString().padStart(8, '0')}`; // Đảm bảo luôn có 5 chữ số
    }

    // Tạo mật khẩu ngẫu nhiên với độ dài tùy ý (mặc định là 8 ký tự)
    static generatePassword(length) {
        const lowercase = "abcdefghijklmnopqrstuvwxyz";
        const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numbers = "0123456789";
    
        // Mỗi nhóm ký tự ít nhất 1 ký tự để đảm bảo đủ yêu cầu
        let password = [
            lowercase[Math.floor(Math.random() * lowercase.length)],
            uppercase[Math.floor(Math.random() * uppercase.length)],
            numbers[Math.floor(Math.random() * numbers.length)]
        ];
    
        // Tạo phần còn lại của mật khẩu
        const allChars = lowercase + uppercase + numbers;
        for (let i = password.length; i < length; i++) {
            password.push(allChars[Math.floor(Math.random() * allChars.length)]);
        }
    
        // Trộn ngẫu nhiên vị trí các ký tự trong mảng password
        return password.sort(() => Math.random() - 0.5).join('');
    }
    static generateRandomPhoneNumber() {
        // Mã quốc gia +84 cho Việt Nam
        const countryCode = "0";
        // Một số đầu số phổ biến của các nhà mạng
        const areaCodes = ["91", "94", "97", "98", "96", "32", "33", "34", "35", "36", "37", "38", "39", "86", "88", "89"];
        
        // Chọn ngẫu nhiên một đầu số từ danh sách areaCodes
        const areaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)];
        
        // Tạo 7 chữ số ngẫu nhiên còn lại
        let randomDigits = '';
        for (let i = 0; i < 8; i++) {
            randomDigits += Math.floor(Math.random() * 10);
        }
    
        // Ghép thành số điện thoại hoàn chỉnh
        return `${countryCode}${areaCode}${randomDigits}`;
    }
}