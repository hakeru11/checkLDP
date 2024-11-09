// const XLSX = require('xlsx');

// // Hàm lấy tất cả URL từ một cột trong Excel
// function getUrls(filePath, sheetName, columnLetter) {
//   const workbook = XLSX.readFile(filePath);
//   const worksheet = workbook.Sheets[sheetName];
//   // Kiểm tra sheet có tồn tại
//   if (!worksheet) {
//     throw new Error(`Sheet "${sheetName}" not found in Excel file.`);
//   }
//   const urls = [];

//   for (let row = 3; ; row++) { // Bỏ qua tiêu đề ở hàng đầu tiên
//     const cellAddress = `${columnLetter}${row}`;
//     const cell = worksheet[cellAddress];

//     if (!cell || !cell.v) break; // Dừng khi không còn dữ liệu trong ô
//     urls.push(cell.v);
//   }

//   return urls;
// }

// module.exports = getUrls;


import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';
import { authenticate } from '@google-cloud/local-auth';

class getUrls {
  constructor(spreadsheetId, sheetName, columnRange) {
    this.spreadsheetId = spreadsheetId;
    this.sheetName = sheetName;
    this.columnRange = columnRange;
    this.SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
    this.TOKEN_PATH = path.join('token.json');
    this.CREDENTIALS_PATH = path.join('credentials.json');
  }

  async loadSavedCredentialsIfExist() {
    try {
      const content = fs.readFileSync(this.TOKEN_PATH);
      const credentials = JSON.parse(content);
      return google.auth.fromJSON(credentials);
    } catch (err) {
      return null;
    }
  }

  async saveCredentials(client) {
    const content = fs.readFileSync(this.CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    fs.writeFileSync(this.TOKEN_PATH, payload);
  }

  async authorize() {
    let client = await this.loadSavedCredentialsIfExist();
    if (client) {
      return client;
    }
    client = await authenticate({
      scopes: this.SCOPES,
      keyfilePath: this.CREDENTIALS_PATH,
    });
    if (client.credentials) {
      await this.saveCredentials(client);
    }
    return client;
  }

  async getColumnData() {
    try {
      const authClient = await this.authorize();
      const sheets = google.sheets({ version: 'v4', auth: authClient });

      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${this.sheetName}!${this.columnRange}`,
      });

      const values = res.data.values;
      if (values && values.length > 0) {
        return values.map(row => row[0]);
      } else {
        console.log('Không có dữ liệu trong phạm vi cột này');
        return [];
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu từ Google Sheets:', error.message);
      return null;
    }
  }
  async writeRowValues(auth, { spreadsheetId, range, values, responseValueRenderOption = 'UNFORMATTED_VALUE' }) {
    const sheets = google.sheets({ version: 'v4', auth });

    const res = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      responseValueRenderOption,
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });
    return res.data;
  }
}

export default getUrls;  // export mặc định