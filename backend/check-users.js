const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('database.sqlite');

// 查询所有用户
db.all('SELECT id, username, role FROM users', (err, rows) => {
  if (err) {
    console.error('查询失败:', err);
  } else {
    console.log('数据库中的用户:');
    rows.forEach(row => {
      console.log(`ID: ${row.id}, 用户名: ${row.username}, 角色: ${row.role || '未设置'}`);
    });
    
    // 检查是否有admin用户需要更新
    const adminUser = rows.find(row => row.username === 'admin');
    if (adminUser) {
      if (adminUser.role !== 'admin') {
        // 更新admin用户的角色
        db.run('UPDATE users SET role = ? WHERE username = ?', ['admin', 'admin'], function(err) {
          if (err) {
            console.error('更新失败:', err);
          } else {
            console.log('✅ Admin用户角色已更新为admin');
          }
          db.close();
        });
      } else {
        console.log('✅ Admin用户角色已经是admin');
        db.close();
      }
    } else {
      console.log('❌ 未找到admin用户');
      db.close();
    }
  }
});
