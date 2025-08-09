const axios = require('axios');

async function testAdminAPI() {
  try {
    // 1. 首先登录获取token
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

    // 2. 测试获取所有盲盒
    console.log('\\n正在测试获取所有盲盒...');
    const blindBoxesResponse = await axios.get('http://localhost:7001/api/admin/blindboxes', {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('获取盲盒结果:', blindBoxesResponse.data);

    // 3. 测试切换盲盒状态（如果有盲盒的话）
    if (blindBoxesResponse.data.success && blindBoxesResponse.data.data.items.length > 0) {
      const firstBox = blindBoxesResponse.data.data.items[0];
      console.log(`\\n正在测试切换盲盒 ${firstBox.id} 的状态...`);
      
      const toggleResponse = await axios.patch(`http://localhost:7001/api/admin/blindboxes/${firstBox.id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('切换状态结果:', toggleResponse.data);
    }

  } catch (error) {
    console.error('测试失败:', error.response?.data || error.message);
  }
}

testAdminAPI();
