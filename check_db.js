const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('检查数据库表...');
db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, rows) => {
  if (err) {
    console.error('错误:', err);
    return;
  }
  console.log('数据库表：', rows);
  
  // 检查用户表
  db.all("SELECT id, username, role FROM users LIMIT 5", [], (err, users) => {
    if (err) {
      console.error('查询用户错误:', err);
    } else {
      console.log('用户数据：', users);
    }
    db.close();
  });
});
