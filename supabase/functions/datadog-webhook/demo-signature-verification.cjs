#!/usr/bin/env node

/**
 * Demonstration script for Datadog Webhook HMAC SHA-256 Signature Verification
 * 
 * This script shows how Datadog signs webhooks and how the signature can be verified.
 * 
 * Usage:
 *   node demo-signature-verification.js
 */

const crypto = require('crypto');

// Configuration
const WEBHOOK_SECRET = 'your_secret_key_12345';

// Example Datadog webhook payload
const webhookPayload = {
  title: "[Triggered] High CPU Usage Alert",
  body: "CPU usage on production-server-1 has exceeded 90% for 5 minutes",
  alert_type: "error",
  priority: "normal",
  date_happened: Math.floor(Date.now() / 1000),
  tags: ["env:production", "service:web", "host:production-server-1"],
  aggregation_key: "cpu_high_production",
  alert_transition: "Triggered",
  org: {
    id: 12345,
    name: "Asper Beauty Shop"
  }
};

console.log('='.repeat(80));
console.log('Datadog Webhook HMAC SHA-256 Signature Demonstration');
console.log('='.repeat(80));
console.log();

// Step 1: Convert payload to JSON string (this is what Datadog sends)
const payloadString = JSON.stringify(webhookPayload);
console.log('Step 1: Webhook Payload');
console.log('-'.repeat(80));
console.log(payloadString);
console.log();

// Step 2: Generate HMAC SHA-256 signature
console.log('Step 2: Generate HMAC SHA-256 Signature');
console.log('-'.repeat(80));
console.log(`Secret: ${WEBHOOK_SECRET}`);

const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
hmac.update(payloadString);
const signature = hmac.digest('hex');
const ddSignature = `sha256=${signature}`;

console.log(`Computed Signature: ${signature}`);
console.log(`DD-Signature Header: ${ddSignature}`);
console.log();

// Step 3: Show how to verify the signature (what our webhook handler does)
console.log('Step 3: Signature Verification Process');
console.log('-'.repeat(80));

function verifySignature(receivedSignature, body, secret) {
  if (!receivedSignature.startsWith('sha256=')) {
    return false;
  }
  
  const receivedHash = receivedSignature.replace('sha256=', '');
  
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(body);
  const computedHash = hmac.digest('hex');
  
  // Timing-safe comparison
  if (receivedHash.length !== computedHash.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < receivedHash.length; i++) {
    result |= receivedHash.charCodeAt(i) ^ computedHash.charCodeAt(i);
  }
  
  return result === 0;
}

const isValid = verifySignature(ddSignature, payloadString, WEBHOOK_SECRET);
console.log(`Signature Valid: ${isValid ? '✓ YES' : '✗ NO'}`);
console.log();

// Step 4: Show curl command for testing
console.log('Step 4: Testing with curl');
console.log('-'.repeat(80));
console.log('Copy and paste this command to test the webhook:');
console.log();
console.log(`curl -X POST \\`);
console.log(`  https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/datadog-webhook \\`);
console.log(`  -H "Content-Type: application/json" \\`);
console.log(`  -H "DD-Signature: ${ddSignature}" \\`);
console.log(`  -d '${payloadString}'`);
console.log();

// Step 5: Test with invalid signature
console.log('Step 5: Testing Invalid Signature');
console.log('-'.repeat(80));
const invalidSignature = 'sha256=0000000000000000000000000000000000000000000000000000000000000000';
const isInvalid = verifySignature(invalidSignature, payloadString, WEBHOOK_SECRET);
console.log(`Invalid Signature Test: ${isInvalid ? '✗ FAILED (should be false)' : '✓ PASSED (correctly rejected)'}`);
console.log();

// Step 6: Test with wrong secret
console.log('Step 6: Testing Wrong Secret');
console.log('-'.repeat(80));
const wrongSecret = 'wrong_secret_key';
const isWrongSecret = verifySignature(ddSignature, payloadString, wrongSecret);
console.log(`Wrong Secret Test: ${isWrongSecret ? '✗ FAILED (should be false)' : '✓ PASSED (correctly rejected)'}`);
console.log();

console.log('='.repeat(80));
console.log('Summary');
console.log('='.repeat(80));
console.log('✓ Webhook payload created');
console.log('✓ HMAC SHA-256 signature generated');
console.log('✓ Signature verification works correctly');
console.log('✓ Invalid signatures are rejected');
console.log('✓ Wrong secrets are rejected');
console.log();
console.log('The Datadog webhook handler is ready to use!');
console.log('Configure DATADOG_WEBHOOK_SECRET in Supabase and deploy the function.');
console.log('='.repeat(80));
