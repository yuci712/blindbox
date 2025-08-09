// 测试前端管理员功能
const testAdminLogin = async () => {
  try {
    const response = await fetch('http://localhost:7001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });

    const result = await response.json();
    console.log('登录结果:', result);

    if (result.success) {
      // 保存到localStorage以模拟前端登录
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.user));
      
      console.log('已保存用户信息到localStorage');
      console.log('用户信息:', result.data.user);
      console.log('现在可以访问管理员页面了');
    }
  } catch (error) {
    console.error('登录测试失败:', error);
  }
};

// 在浏览器控制台中运行
testAdminLogin();
