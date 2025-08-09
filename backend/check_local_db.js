const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.sqlite');

console.log('检查数据库表...');
db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, rows) => {
  if (err) {
    console.error('错误:', err);
    return;
  }
  console.log('数据库表：', rows);
  
  if (rows.length > 0) {
    // 检查用户表
    db.all("SELECT id, username, role FROM users LIMIT 5", [], (err, users) => {
      if (err) {
        console.error('查询用户错误:', err);
      } else {
        console.log('用户数据：', users);
      }
      
      // 检查管理员用户
      db.all("SELECT id, username, role FROM users WHERE role='admin'", [], (err, admins) => {
        if (err) {
          console.error('查询管理员错误:', err);
        } else {
          console.log('管理员用户：', admins);
        }
        db.close();
      });
    });
  } else {
    console.log('数据库中没有表');
    db.close();
  }
});
