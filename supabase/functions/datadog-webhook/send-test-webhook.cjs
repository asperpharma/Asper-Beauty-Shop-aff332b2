#!/usr/bin/env node

/**
 * Example script demonstrating how to send a test webhook to the Datadog webhook handler
 * This simulates what Datadog would send to the endpoint
 */

const crypto = require('crypto');

// Configuration (update these values)
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'http://localhost:54321/functions/v1/datadog-webhook';
const WEBHOOK_SECRET = process.env.DATADOG_WEBHOOK_SECRET || 'my-webhook-secret-key';

// Sample Datadog webhook payload
const payload = {
  alert_type: 'error',
  title: 'High Memory Usage Alert',
  body: 'Memory usage has exceeded 90% on production server',
  date: Math.floor(Date.now() / 1000),
  priority: 'normal',
  tags: ['env:production', 'service:web-server'],
  aggregation_key: 'memory-usage-alert',
  alert_transition: 'triggered',
  org: {
    id: 'org-123',
    name: 'Asper Beauty Shop'
  },
  alert_id: 12345,
  event_type: 'monitor_alert'
};

// Generate HMAC SHA-256 signature
function generateSignature(payloadString, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(payloadString, 'utf8')
    .digest('hex');
}

// Send test webhook
async function sendTestWebhook() {
  console.log('=== Datadog Webhook Test Sender ===\n');
  console.log('Configuration:');
  console.log(`  Webhook URL: ${WEBHOOK_URL}`);
  console.log(`  Secret configured: ${WEBHOOK_SECRET ? 'Yes' : 'No'}\n`);

  const payloadString = JSON.stringify(payload);
  const signature = generateSignature(payloadString, WEBHOOK_SECRET);

  console.log('Payload:');
  console.log(JSON.stringify(payload, null, 2));
  console.log(`\nGenerated Signature: ${signature}\n`);

  try {
    console.log('Sending webhook request...');
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'DD-Signature': signature,
      },
      body: payloadString,
    });

    console.log(`Response Status: ${response.status} ${response.statusText}`);
    
    const responseText = await response.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log('Response Body:');
      console.log(JSON.stringify(responseData, null, 2));
    } catch {
      console.log('Response Body (raw):');
      console.log(responseText);
    }

    if (response.ok) {
      console.log('\n✓ Webhook successfully received and verified!');
      return true;
    } else {
      console.log('\n✗ Webhook failed verification or processing');
      return false;
    }
  } catch (error) {
    console.error('\n✗ Error sending webhook:');
    console.error(error.message);
    if (error.cause) {
      console.error('Cause:', error.cause);
    }
    return false;
  }
}

// Test invalid signature
async function testInvalidSignature() {
  console.log('\n\n=== Testing Invalid Signature ===\n');
  const payloadString = JSON.stringify(payload);
  const invalidSignature = '0'.repeat(64);

  console.log('Sending webhook with INVALID signature...');
  console.log(`Invalid Signature: ${invalidSignature}\n`);

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'DD-Signature': invalidSignature,
      },
      body: payloadString,
    });

    console.log(`Response Status: ${response.status} ${response.statusText}`);
    const responseData = await response.json();
    console.log('Response Body:');
    console.log(JSON.stringify(responseData, null, 2));

    if (response.status === 401) {
      console.log('\n✓ Invalid signature correctly rejected!');
      return true;
    } else {
      console.log('\n✗ Invalid signature was NOT rejected (unexpected)');
      return false;
    }
  } catch (error) {
    console.error('\n✗ Error:', error.message);
    return false;
  }
}

// Main execution
async function main() {
  const validTest = await sendTestWebhook();
  const invalidTest = await testInvalidSignature();

  console.log('\n\n=== Test Results ===');
  console.log(`Valid signature test: ${validTest ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`Invalid signature test: ${invalidTest ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nOverall: ${validTest && invalidTest ? 'ALL TESTS PASSED ✓' : 'SOME TESTS FAILED ✗'}`);

  process.exit(validTest && invalidTest ? 0 : 1);
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { generateSignature, sendTestWebhook };
