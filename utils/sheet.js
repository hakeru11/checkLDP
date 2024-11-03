const XLSX = require('xlsx');

// Hàm lấy tất cả URL từ một cột trong Excel
function getUrls(filePath, sheetName, columnLetter) {
  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets[sheetName];
  // Kiểm tra sheet có tồn tại
  if (!worksheet) {
    throw new Error(`Sheet "${sheetName}" not found in Excel file.`);
  }
  const urls = [];

  for (let row = 3; ; row++) { // Bỏ qua tiêu đề ở hàng đầu tiên
    const cellAddress = `${columnLetter}${row}`;
    const cell = worksheet[cellAddress];

    if (!cell) break; // Dừng khi không còn dữ liệu trong ô
    urls.push(cell.v);
  }

  return urls;
}

module.exports = getUrls;
