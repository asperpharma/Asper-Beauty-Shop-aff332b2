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
 * Constant-time comparison to prevent timing attacks
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {boolean} True if strings are equal
 */
function timingSafeEqual(a, b) {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}

/**
 * Verify HMAC SHA-256 signature
 * @param {string} payload - The raw request body
 * @param {string} signature - The DD-Signature header value (may include "sha256=" prefix)
 * @param {string} secret - The webhook secret key
 * @returns {boolean} True if signature is valid
 */
function verifySignature(payload, signature, secret) {
  // Strip "sha256=" prefix if present
  let cleanSignature = signature;
  if (signature.toLowerCase().startsWith('sha256=')) {
    cleanSignature = signature.substring(7);
  }
  
  const computedSignature = generateHmacSignature(payload, secret);
  return timingSafeEqual(
    computedSignature.toLowerCase(),
    cleanSignature.toLowerCase()
  );
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

// Test 6: Signature with sha256= prefix
console.log('Test 6: Accept signature with sha256= prefix');
const prefixedSignature = `sha256=${validSignature}`;
const test6Result = verifySignature(testPayload, prefixedSignature, testSecret);
console.log(`  Prefixed signature: ${prefixedSignature.substring(0, 50)}...`);
console.log(`  Verification result: ${test6Result}`);
console.log(`  Status: ${test6Result ? '✓ PASS' : '✗ FAIL'}\n`);

// Test 7: Uppercase sha256= prefix
console.log('Test 7: Accept uppercase SHA256= prefix');
const uppercasePrefixedSignature = `SHA256=${validSignature}`;
const test7Result = verifySignature(testPayload, uppercasePrefixedSignature, testSecret);
console.log(`  Uppercase prefixed signature: ${uppercasePrefixedSignature.substring(0, 50)}...`);
console.log(`  Verification result: ${test7Result}`);
console.log(`  Status: ${test7Result ? '✓ PASS' : '✗ FAIL'}\n`);

// Test 8: Timing-safe comparison with different length
console.log('Test 8: Timing-safe comparison with different length');
const shortSignature = validSignature.substring(0, 32);
const test8Result = verifySignature(testPayload, shortSignature, testSecret);
console.log(`  Short signature: ${shortSignature}`);
console.log(`  Verification result: ${test8Result}`);
console.log(`  Status: ${!test8Result ? '✓ PASS' : '✗ FAIL'}\n`);

// Summary
const allPassed = test1Result && !test2Result && !test3Result && test4Result && !test5Result && test6Result && test7Result && !test8Result;
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
