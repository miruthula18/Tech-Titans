// Comprehensive API & CORS integration test suite
async function runTests() {
  console.log('====================================================');
  console.log(' RUNNING DISASTER REUNITE FULL INTEGRATION TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}:`, err.message);
    }
  }

  // 1. Health & CORS Origin test
  await test('1. Health check & CORS Origin Header for http://localhost:5173', async () => {
    const res = await fetch('http://localhost:5000/api/health', {
      headers: { 'Origin': 'http://localhost:5173' }
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (data.status !== 'ONLINE') throw new Error(`Expected ONLINE, got ${data.status}`);
    const allowOrigin = res.headers.get('access-control-allow-origin');
    if (allowOrigin !== 'http://localhost:5173') {
      throw new Error(`Expected access-control-allow-origin http://localhost:5173, got ${allowOrigin}`);
    }
  });

  // 2. Preflight OPTIONS request CORS test
  await test('2. Preflight OPTIONS CORS check for http://localhost:5173', async () => {
    const res = await fetch('http://localhost:5000/api/persons', {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:5173',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, Authorization, X-Demo-Role'
      }
    });
    const allowOrigin = res.headers.get('access-control-allow-origin');
    if (allowOrigin !== 'http://localhost:5173') {
      throw new Error(`CORS origin missing in OPTIONS response: ${allowOrigin}`);
    }
  });

  // 3. Auth Login
  let authToken = null;
  await test('3. Auth Login for Rescue Personnel', async () => {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Origin': 'http://localhost:5173' },
      body: JSON.stringify({ email: 'rescue@disasterreunite.org', password: 'rescue123' })
    });
    const data = await res.json();
    if (!data.success || !data.token) throw new Error('Login failed: ' + JSON.stringify(data));
    authToken = data.token;
  });

  // 4. Active Disaster Context
  await test('4. Fetch active disaster context', async () => {
    const res = await fetch('http://localhost:5000/api/disasters/active', {
      headers: { 'Origin': 'http://localhost:5173' }
    });
    const data = await res.json();
    if (!data.success || !data.data.name.includes('Coastal Flood')) {
      throw new Error('Active disaster context missing or invalid');
    }
  });

  // 5. Search State 1: Verified Found (Priya Kumar)
  await test('5. Search State 1: Verified Found for Priya Kumar', async () => {
    const res = await fetch('http://localhost:5000/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Origin': 'http://localhost:5173' },
      body: JSON.stringify({ name: 'Priya Kumar' })
    });
    const data = await res.json();
    if (!data.success || data.state !== 'STATE_1_VERIFIED_FOUND' || data.verifiedFound.length === 0) {
      throw new Error(`Expected STATE_1_VERIFIED_FOUND, got ${data.state}`);
    }
  });

  // 6. Search State 2: Possible Match (Arjun Kumar)
  await test('6. Search State 2: Possible Match for Arjun Kumar', async () => {
    const res = await fetch('http://localhost:5000/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Origin': 'http://localhost:5173' },
      body: JSON.stringify({ name: 'Arjun Kumar' })
    });
    const data = await res.json();
    if (!data.success || data.state !== 'STATE_2_POSSIBLE_MATCH' || data.possibleMatches.length === 0) {
      throw new Error(`Expected STATE_2_POSSIBLE_MATCH, got ${data.state}`);
    }
  });

  // 7. Search State 3: Not Found (Unregistered person)
  await test('7. Search State 3: Not Found for Nonexistent person', async () => {
    const res = await fetch('http://localhost:5000/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Origin': 'http://localhost:5173' },
      body: JSON.stringify({ name: 'Completely Unregistered Person 999' })
    });
    const data = await res.json();
    if (!data.success || data.state !== 'STATE_3_NOT_FOUND') {
      throw new Error(`Expected STATE_3_NOT_FOUND, got ${data.state}`);
    }
  });

  // 8. Register rescued person
  let newPersonId = null;
  await test('8. Rescued person registration (Data submitted reaches backend)', async () => {
    const res = await fetch('http://localhost:5000/api/persons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'Origin': 'http://localhost:5173'
      },
      body: JSON.stringify({
        name: 'Tanya Roy',
        age: 26,
        gender: 'Female',
        currentLocation: 'Government Relief Camp — Zone 2',
        rescuedLocation: 'North River Embankment',
        status: 'Safe',
        rescueTeam: 'NDRF Unit Bravo',
        additionalNotes: 'Intake test registration'
      })
    });
    const data = await res.json();
    if (!data.success || !data.data || !data.data.caseId) {
      throw new Error('Registration failed: ' + JSON.stringify(data));
    }
    newPersonId = data.data.id;
  });

  // 9. Verify candidate match workflow
  await test('9. Verify candidate match workflow (CONFIRM action)', async () => {
    const res = await fetch('http://localhost:5000/api/matches/match-1/verify', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'Origin': 'http://localhost:5173'
      },
      body: JSON.stringify({
        action: 'CONFIRM',
        verifiedBy: 'Capt. Sarah Jenkins (NDRF)',
        notes: 'Integration verified'
      })
    });
    const data = await res.json();
    if (!data.success || data.data.status !== 'Verified') {
      throw new Error('Verification workflow failed: ' + JSON.stringify(data));
    }
  });

  // 10. Mark person as reunited
  await test('10. Mark person as reunited', async () => {
    const res = await fetch(`http://localhost:5000/api/persons/${newPersonId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'Origin': 'http://localhost:5173'
      },
      body: JSON.stringify({
        status: 'Reunited',
        reunitedNotes: 'Reunited with family members.'
      })
    });
    const data = await res.json();
    if (!data.success || data.data.status !== 'Reunited') {
      throw new Error('Status update to Reunited failed');
    }
  });

  // 11. Family Reunification Group summary
  await test('11. Family Reunification Dashboard Group summary', async () => {
    const res = await fetch('http://localhost:5000/api/family-reports/group-summary?group=Kumar%20Family%20Group', {
      headers: { 'Origin': 'http://localhost:5173' }
    });
    const data = await res.json();
    if (!data.success || !data.summaryText || !data.members) {
      throw new Error('Group summary invalid: ' + JSON.stringify(data));
    }
  });

  // 12. Locations / Shelters
  await test('12. Facilities & Shelters listing', async () => {
    const res = await fetch('http://localhost:5000/api/locations', {
      headers: { 'Origin': 'http://localhost:5173' }
    });
    const data = await res.json();
    if (!data.success || data.data.length === 0) {
      throw new Error('Locations empty or failed');
    }
  });

  // 13. Notifications Feed
  await test('13. Notifications Activity Stream', async () => {
    const res = await fetch('http://localhost:5000/api/notifications', {
      headers: { 'Origin': 'http://localhost:5173' }
    });
    const data = await res.json();
    if (!data.success || data.data.length === 0) {
      throw new Error('Notifications stream empty');
    }
  });

  // 14. Reset Demo Data
  await test('14. Reset Demo Data to initial seed state', async () => {
    const res = await fetch('http://localhost:5000/api/stats/reset', {
      method: 'POST',
      headers: { 'Origin': 'http://localhost:5173' }
    });
    const data = await res.json();
    if (!data.success) throw new Error('Demo reset failed');
  });

  console.log('\n====================================================');
  console.log(` RESULTS: ${passed}/${total} TESTS PASSED`);
  console.log('====================================================');

  if (passed === total) {
    console.log(' ALL ENDPOINTS, CORS, AND DATA WORKFLOWS VERIFIED!');
  } else {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
