const axios = require('axios');

async function testDashboardAPI() {
  try {
    // 1. 登录获取token
    console.log('正在登录管理员账户...');
    const loginResponse = await axios.post('http://localhost:7001/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    });

    if (!loginResponse.data.success) {
      console.error('登录失败:', loginResponse.data.message);
      return;
    }

    const token = loginResponse.data.data.token;
    console.log('登录成功，获取到token');

    // 2. 测试获取仪表板统计数据
    console.log('\\n正在测试获取仪表板统计数据...');
    const dashboardResponse = await axios.get('http://localhost:7001/api/admin/dashboard-stats?timeRange=all', {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('仪表板统计数据:', JSON.stringify(dashboardResponse.data, null, 2));

  } catch (error) {
    console.error('测试失败:', error.response?.data || error.message);
  }
}

testDashboardAPI();
