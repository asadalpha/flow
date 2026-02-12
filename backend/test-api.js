// Simple script to test the backend API
// Run with: node test-api.js

async function testAPI() {
  const BASE_URL = 'http://localhost:5000/api/v1';
  let token = '';

  console.log('🚀 Starting API Tests...\n');

  // 1. Test Health/Root (should fail 404 but show server is up, or use a known endpoint)
  // We'll test Auth Signup directly
  try {
    console.log('1️⃣  Testing Signup...');
    const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123'
      })
    });
    
    const signupData = await signupRes.json();
    if (signupRes.ok) {
        console.log('✅ Signup Successful');
        token = signupData.token;
    } else {
        console.log('❌ Signup Failed:', signupData.message);
    }
  } catch (err) {
    console.log('❌ Signup Error:', err.message);
  }

  if (!token) return;

  // 2. Test Get Jobs (Protected Route)
  try {
    console.log('\n2️⃣  Testing Get Jobs (Protected)...');
    const jobsRes = await fetch(`${BASE_URL}/jobs`, {
      headers: { 
        'Authorization': `Bearer ${token}` 
      }
    });
    
    const jobsData = await jobsRes.json();
    if (jobsRes.ok) {
        console.log('✅ Get Jobs Successful. Count:', jobsData.results);
    } else {
        console.log('❌ Get Jobs Failed:', jobsData.message);
    }
  } catch (err) {
    console.log('❌ Get Jobs Error:', err.message);
  }

  // 3. Test Create Job
  try {
    console.log('\n3️⃣  Testing Create Job...');
    const createRes = await fetch(`${BASE_URL}/jobs`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        company: 'Tech Corp',
        role: 'Senior Engineer',
        status: 'Applied',
        applicationLink: 'https://example.com/apply'
      })
    });
    
    const createData = await createRes.json();
    if (createRes.ok) {
        console.log('✅ Create Job Successful:', createData.data.job.company);
    } else {
        console.log('❌ Create Job Failed:', createData.message);
    }
  } catch (err) {
    console.log('❌ Create Job Error:', err.message);
  }

  console.log('\n✨ Tests Completed');
}

testAPI();
