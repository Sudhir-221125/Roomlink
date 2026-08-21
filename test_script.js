const baseUrl = 'http://localhost:3000/api';

async function request(endpoint, method = 'GET', body = null, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(`${baseUrl}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });
  const data = await response.json();
  if (!response.ok) {
    return { error: true, status: response.status, data };
  }
  return { error: false, status: response.status, data };
}

async function runTests() {
  console.log('--- Starting Backend Tests ---');
  
  // 1. Register a new user
  const email = `testuser_${Date.now()}@example.com`;
  console.log(`Registering user: ${email}`);
  const regRes = await request('/auth/register', 'POST', {
    name: 'Test User',
    email,
    password: 'password123'
  });
  
  if (regRes.error) {
    console.error('Registration failed:', regRes.data);
    return;
  }
  
  const token = regRes.data.data.token;
  console.log('Registration successful. Token acquired.');

  // 2. Create a space
  console.log('Creating a Space...');
  const spaceRes = await request('/spaces', 'POST', {
    name: 'Test Apartment',
    type: 'apartment',
    address: '123 Main St'
  }, token);
  
  if (spaceRes.error) {
    console.error('Space creation failed:', spaceRes.data);
    return;
  }
  
  const spaceId = spaceRes.data.data.space._id;
  console.log(`Space created. ID: ${spaceId}`);

  // 3. Create a bill
  console.log('Creating a Bill...');
  const billRes = await request(`/spaces/${spaceId}/bills`, 'POST', {
    title: 'Electricity',
    amount: 100,
    due_date: new Date().toISOString()
  }, token);

  if (billRes.error) {
    console.error('Bill creation failed:', billRes.data);
    return;
  }

  const billId = billRes.data.data.bill._id;
  console.log(`Bill created. ID: ${billId}, Status: ${billRes.data.data.bill.status}`);

  // 4. Create an invalid payment (invalid UPI length)
  console.log('Testing invalid UPI payment (3 digits)...');
  const invalidPaymentRes = await request(`/spaces/${spaceId}/bills/${billId}/payments`, 'POST', {
    amount: 50,
    method: 'upi',
    transaction_id: '123'
  }, token);

  if (invalidPaymentRes.error) {
    console.log('Invalid UPI rejected as expected:', invalidPaymentRes.data.message);
  } else {
    console.error('Invalid UPI was unexpectedly accepted!');
  }

  // 5. Create a valid payment (12 digits)
  console.log('Testing valid UPI payment (12 digits)...');
  const validPaymentRes = await request(`/spaces/${spaceId}/bills/${billId}/payments`, 'POST', {
    amount: 50,
    method: 'upi',
    transaction_id: '123456789012'
  }, token);

  if (validPaymentRes.error) {
    console.error('Valid UPI payment failed:', validPaymentRes.data);
    return;
  }
  
  const paymentId = validPaymentRes.data.data.payment._id;
  console.log(`Payment created. Status: ${validPaymentRes.data.data.payment.status}`);

  // 6. Verify Bill Status is still unpaid
  const checkBillRes1 = await request(`/spaces/${spaceId}/bills/${billId}`, 'GET', null, token);
  console.log(`Bill status after pending payment: ${checkBillRes1.data.data.bill.status}`);

  // 7. Verify the payment
  console.log('Verifying the payment...');
  const verifyRes = await request(`/spaces/${spaceId}/bills/${billId}/payments/${paymentId}`, 'PATCH', {
    status: 'verified'
  }, token);

  if (verifyRes.error) {
    console.error('Verification failed:', verifyRes.data);
    return;
  }
  
  console.log('Payment verified successfully.');

  // 8. Verify Bill Status is now partial
  const checkBillRes2 = await request(`/spaces/${spaceId}/bills/${billId}`, 'GET', null, token);
  console.log(`Bill status after verified partial payment: ${checkBillRes2.data.data.bill.status}`);

  // 9. Overpayment attempt
  console.log('Testing overpayment...');
  const overpayRes = await request(`/spaces/${spaceId}/bills/${billId}/payments`, 'POST', {
    amount: 60,
    method: 'cash'
  }, token);
  
  if (overpayRes.error) {
    console.log('Overpayment rejected during creation as expected:', overpayRes.data.message);
  } else {
    console.log('Overpayment payment created, attempting to verify...');
    const overpayId = overpayRes.data.data.payment._id;
    const verifyOverpayRes = await request(`/spaces/${spaceId}/bills/${billId}/payments/${overpayId}`, 'PATCH', {
      status: 'verified'
    }, token);
    if (verifyOverpayRes.error) {
      console.log('Overpayment verification rejected as expected:', verifyOverpayRes.data.message);
    } else {
      console.error('Overpayment unexpectedly verified!');
    }
  }

  // 10. Pay the rest
  console.log('Testing final payment to fully pay bill...');
  const finalPaymentRes = await request(`/spaces/${spaceId}/bills/${billId}/payments`, 'POST', {
    amount: 50,
    method: 'cash'
  }, token);
  
  const finalPayId = finalPaymentRes.data.data.payment._id;
  await request(`/spaces/${spaceId}/bills/${billId}/payments/${finalPayId}`, 'PATCH', {
    status: 'verified'
  }, token);

  const checkBillRes3 = await request(`/spaces/${spaceId}/bills/${billId}`, 'GET', null, token);
  console.log(`Bill status after final payment: ${checkBillRes3.data.data.bill.status}`);
  
  console.log('--- Tests completed successfully! ---');
}

runTests().catch(console.error);
