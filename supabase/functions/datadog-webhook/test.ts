import { assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";

/**
 * Test utility to generate HMAC SHA-256 signature for testing
 */
async function generateSignature(
  body: string,
  secret: string,
): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(body),
  );

  const hexSignature = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `sha256=${hexSignature}`;
}

/**
 * Test: Valid signature verification
 */
Deno.test("Datadog Webhook - Valid signature", async () => {
  const secret = "test_secret_key_12345";
  const payload = JSON.stringify({
    title: "Test Alert",
    body: "This is a test alert",
    alert_type: "info",
    priority: "normal",
  });

  const signature = await generateSignature(payload, secret);
  
  console.log("Generated signature:", signature);
  console.log("Payload:", payload);
  
  // Verify the signature format
  assertEquals(signature.startsWith("sha256="), true);
  assertEquals(signature.length, 71); // "sha256=" (7 chars) + 64 hex chars
});

/**
 * Test: Different payloads produce different signatures
 */
Deno.test("Datadog Webhook - Different payloads have different signatures", async () => {
  const secret = "test_secret_key_12345";
  const payload1 = JSON.stringify({ title: "Alert 1" });
  const payload2 = JSON.stringify({ title: "Alert 2" });

  const signature1 = await generateSignature(payload1, secret);
  const signature2 = await generateSignature(payload2, secret);

  assertEquals(signature1 === signature2, false);
});

/**
 * Test: Same payload and secret produce same signature
 */
Deno.test("Datadog Webhook - Deterministic signatures", async () => {
  const secret = "test_secret_key_12345";
  const payload = JSON.stringify({ title: "Test" });

  const signature1 = await generateSignature(payload, secret);
  const signature2 = await generateSignature(payload, secret);

  assertEquals(signature1, signature2);
});

/**
 * Test: Different secrets produce different signatures
 */
Deno.test("Datadog Webhook - Different secrets produce different signatures", async () => {
  const secret1 = "secret_one";
  const secret2 = "secret_two";
  const payload = JSON.stringify({ title: "Test" });

  const signature1 = await generateSignature(payload, secret1);
  const signature2 = await generateSignature(payload, secret2);

  assertEquals(signature1 === signature2, false);
});

/**
 * Example test payload generation for manual testing
 */
Deno.test("Datadog Webhook - Generate example test payload", async () => {
  const secret = "your_secret_key_here"; // Replace with actual secret for testing
  const examplePayload = {
    title: "[Triggered] CPU usage is high on production server",
    body: "The CPU usage on production-server-1 has exceeded 90% for the last 5 minutes.",
    alert_type: "error",
    priority: "normal",
    date_happened: Date.now() / 1000,
    tags: ["env:production", "service:web", "host:production-server-1"],
    aggregation_key: "cpu_high_production",
    alert_transition: "Triggered",
    org: {
      id: 12345,
      name: "Asper Beauty Shop",
    },
  };

  const payload = JSON.stringify(examplePayload);
  const signature = await generateSignature(payload, secret);

  console.log("\n=== Example Test Payload ===");
  console.log("Payload:", payload);
  console.log("\nDD-Signature header:", signature);
  console.log("\nCurl command:");
  console.log(
    `curl -X POST https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/datadog-webhook \\`,
  );
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -H "DD-Signature: ${signature}" \\`);
  console.log(`  -d '${payload}'`);
});
