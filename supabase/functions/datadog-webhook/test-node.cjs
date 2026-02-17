#!/usr/bin/env node

/**
 * Simple test script to verify HMAC SHA-256 signature generation
 * This is a Node.js equivalent of the Deno test to validate the logic
 */

const crypto = require('crypto');

/**
 * Generate HMAC SHA-256 signature
 * @param {string} payload - The raw request body
 * @param {string} secret - The webhook secret key
 * @returns {string} The hex-encoded HMAC signature
 */
function generateHmacSignature(payload, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');
}

/**
 * Verify HMAC SHA-256 signature
 * @param {string} payload - The raw request body
 * @param {string} signature - The DD-Signature header value
 * @param {string} secret - The webhook secret key
 * @returns {boolean} True if signature is valid
 */
function verifySignature(payload, signature, secret) {
  const computedSignature = generateHmacSignature(payload, secret);
  return computedSignature.toLowerCase() === signature.toLowerCase();
}

// Run tests
console.log('=== Datadog Webhook HMAC SHA-256 Signature Verification Tests ===\n');

const testSecret = 'my-webhook-secret-key';
const testPayload = JSON.stringify({
  alert_type: 'error',
  title: 'Test Alert',
  body: 'This is a test alert from Datadog',
  date: Date.now(),
});

// Test 1: Generate and verify valid signature
console.log('Test 1: Generate and verify valid signature');
const validSignature = generateHmacSignature(testPayload, testSecret);
const test1Result = verifySignature(testPayload, validSignature, testSecret);
console.log(`  Generated signature: ${validSignature}`);
console.log(`  Verification result: ${test1Result}`);
console.log(`  Status: ${test1Result ? '✓ PASS' : '✗ FAIL'}\n`);

// Test 2: Verify invalid signature
console.log('Test 2: Reject invalid signature');
const invalidSignature = '0'.repeat(64);
const test2Result = verifySignature(testPayload, invalidSignature, testSecret);
console.log(`  Invalid signature: ${invalidSignature}`);
console.log(`  Verification result: ${test2Result}`);
console.log(`  Status: ${!test2Result ? '✓ PASS' : '✗ FAIL'}\n`);

// Test 3: Verify wrong secret
console.log('Test 3: Reject signature with wrong secret');
const wrongSecret = 'wrong-secret-key';
const test3Result = verifySignature(testPayload, validSignature, wrongSecret);
console.log(`  Wrong secret: ${wrongSecret}`);
console.log(`  Verification result: ${test3Result}`);
console.log(`  Status: ${!test3Result ? '✓ PASS' : '✗ FAIL'}\n`);

// Test 4: Case insensitive comparison
console.log('Test 4: Case-insensitive signature comparison');
const uppercaseSignature = validSignature.toUpperCase();
const test4Result = verifySignature(testPayload, uppercaseSignature, testSecret);
console.log(`  Uppercase signature: ${uppercaseSignature}`);
console.log(`  Verification result: ${test4Result}`);
console.log(`  Status: ${test4Result ? '✓ PASS' : '✗ FAIL'}\n`);

// Test 5: Modified payload
console.log('Test 5: Reject modified payload');
const modifiedPayload = testPayload + 'extra data';
const test5Result = verifySignature(modifiedPayload, validSignature, testSecret);
console.log(`  Modified payload: ${modifiedPayload.substring(0, 50)}...`);
console.log(`  Verification result: ${test5Result}`);
console.log(`  Status: ${!test5Result ? '✓ PASS' : '✗ FAIL'}\n`);

// Summary
const allPassed = test1Result && !test2Result && !test3Result && test4Result && !test5Result;
console.log('=== Test Summary ===');
console.log(`All tests ${allPassed ? 'PASSED ✓' : 'FAILED ✗'}`);

// Example usage
console.log('\n=== Example Usage ===');
console.log('To verify a Datadog webhook:');
console.log('1. Read the DD-Signature header from the request');
console.log('2. Read the raw request body');
console.log('3. Verify: verifySignature(body, signature, secret)');
console.log('\nExample:');
console.log(`  Secret: "${testSecret}"`);
console.log(`  Payload: ${testPayload.substring(0, 60)}...`);
console.log(`  Valid Signature: ${validSignature}`);

process.exit(allPassed ? 0 : 1);
