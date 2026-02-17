/**
 * Test file for Datadog webhook HMAC SHA-256 signature verification
 * This demonstrates how the signature verification works
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

/**
 * Constant-time comparison to prevent timing attacks
 * @param a - First string (hex signature)
 * @param b - Second string (hex signature)
 * @returns boolean indicating if strings are equal
 */
function timingSafeEqual(a: string, b: string): boolean {
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
 * Verify HMAC SHA-256 signature from Datadog webhook
 * @param payload - The raw request body
 * @param signature - The DD-Signature header value (may include "sha256=" prefix)
 * @param secret - The webhook secret key
 * @returns boolean indicating if signature is valid
 */
async function verifyDatadogSignature(
  payload: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  try {
    // Strip "sha256=" prefix if present
    let cleanSignature = signature;
    if (signature.toLowerCase().startsWith("sha256=")) {
      cleanSignature = signature.substring(7);
    }

    // Create HMAC-SHA256 hash of the payload
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(payload);

    // Import the secret key for HMAC
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );

    // Generate the HMAC signature
    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      messageData,
    );

    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(signatureBuffer));
    const computedSignature = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Compare signatures using constant-time comparison to prevent timing attacks
    return timingSafeEqual(
      computedSignature.toLowerCase(),
      cleanSignature.toLowerCase()
    );
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false;
  }
}

// Test cases
async function runTests() {
  console.log("Running Datadog webhook signature verification tests...\n");

  // Test 1: Valid signature
  const testSecret = "my-webhook-secret-key";
  const testPayload = JSON.stringify({
    alert_type: "error",
    title: "Test Alert",
    body: "This is a test alert from Datadog",
    date: Date.now(),
  });

  // Generate a valid signature for testing
  const encoder = new TextEncoder();
  const keyData = encoder.encode(testSecret);
  const messageData = encoder.encode(testPayload);

  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signatureBuffer = await crypto.subtle.sign("HMAC", key, messageData);
  const hashArray = Array.from(new Uint8Array(signatureBuffer));
  const validSignature = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  console.log("Test 1: Valid signature");
  const test1Result = await verifyDatadogSignature(
    testPayload,
    validSignature,
    testSecret,
  );
  console.log(`  Expected: true, Got: ${test1Result}`);
  console.log(`  Result: ${test1Result ? "✓ PASS" : "✗ FAIL"}\n`);

  // Test 2: Invalid signature
  console.log("Test 2: Invalid signature");
  const invalidSignature = "0000000000000000000000000000000000000000000000000000000000000000";
  const test2Result = await verifyDatadogSignature(
    testPayload,
    invalidSignature,
    testSecret,
  );
  console.log(`  Expected: false, Got: ${test2Result}`);
  console.log(`  Result: ${!test2Result ? "✓ PASS" : "✗ FAIL"}\n`);

  // Test 3: Wrong secret
  console.log("Test 3: Wrong secret");
  const wrongSecret = "wrong-secret-key";
  const test3Result = await verifyDatadogSignature(
    testPayload,
    validSignature,
    wrongSecret,
  );
  console.log(`  Expected: false, Got: ${test3Result}`);
  console.log(`  Result: ${!test3Result ? "✓ PASS" : "✗ FAIL"}\n`);

  // Test 4: Case insensitivity
  console.log("Test 4: Case insensitive signature comparison");
  const uppercaseSignature = validSignature.toUpperCase();
  const test4Result = await verifyDatadogSignature(
    testPayload,
    uppercaseSignature,
    testSecret,
  );
  console.log(`  Expected: true, Got: ${test4Result}`);
  console.log(`  Result: ${test4Result ? "✓ PASS" : "✗ FAIL"}\n`);

  // Test 5: Modified payload
  console.log("Test 5: Modified payload (should fail)");
  const modifiedPayload = testPayload + "extra data";
  const test5Result = await verifyDatadogSignature(
    modifiedPayload,
    validSignature,
    testSecret,
  );
  console.log(`  Expected: false, Got: ${test5Result}`);
  console.log(`  Result: ${!test5Result ? "✓ PASS" : "✗ FAIL"}\n`);

  // Test 6: Signature with sha256= prefix
  console.log("Test 6: Signature with sha256= prefix");
  const prefixedSignature = `sha256=${validSignature}`;
  const test6Result = await verifyDatadogSignature(
    testPayload,
    prefixedSignature,
    testSecret,
  );
  console.log(`  Expected: true, Got: ${test6Result}`);
  console.log(`  Result: ${test6Result ? "✓ PASS" : "✗ FAIL"}\n`);

  // Test 7: Uppercase sha256= prefix
  console.log("Test 7: Uppercase SHA256= prefix");
  const uppercasePrefixedSignature = `SHA256=${validSignature}`;
  const test7Result = await verifyDatadogSignature(
    testPayload,
    uppercasePrefixedSignature,
    testSecret,
  );
  console.log(`  Expected: true, Got: ${test7Result}`);
  console.log(`  Result: ${test7Result ? "✓ PASS" : "✗ FAIL"}\n`);

  // Test 8: Timing-safe comparison (different length signatures)
  console.log("Test 8: Timing-safe comparison with different length");
  const shortSignature = validSignature.substring(0, 32);
  const test8Result = await verifyDatadogSignature(
    testPayload,
    shortSignature,
    testSecret,
  );
  console.log(`  Expected: false, Got: ${test8Result}`);
  console.log(`  Result: ${!test8Result ? "✓ PASS" : "✗ FAIL"}\n`);

  console.log("All tests completed!");
  console.log("\nExample signature generation:");
  console.log(`  Secret: ${testSecret}`);
  console.log(`  Payload: ${testPayload.substring(0, 50)}...`);
  console.log(`  Signature: ${validSignature}`);
}

// Run tests if this file is executed directly
if (import.meta.main) {
  await runTests();
}

export { verifyDatadogSignature };
