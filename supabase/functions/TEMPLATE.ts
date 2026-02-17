import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for web client access
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/**
 * FUNCTION NAME: [Your function name here]
 * 
 * PURPOSE: [Describe what this function does]
 * 
 * AUTHENTICATION: [public | authenticated | admin-only]
 * 
 * INPUTS:
 * {
 *   field1: string,
 *   field2?: number
 * }
 * 
 * ROUTES:
 *   POST /function-name - Main endpoint
 * 
 * ENVIRONMENT VARIABLES:
 *   - SUPABASE_URL (auto-provided)
 *   - SUPABASE_ANON_KEY (auto-provided)
 *   - [Add any custom variables here]
 * 
 * RESPONSE CODES:
 *   - 200: Success
 *   - 400: Bad Request
 *   - 401: Unauthorized
 *   - 403: Forbidden
 *   - 500: Server Error
 */

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ==================== AUTHENTICATION ====================
    // Uncomment if authentication is required
    /*
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.error("Missing or invalid Authorization header");
      return new Response(
        JSON.stringify({ error: "Unauthorized: Missing or invalid token" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Token verification failed:", userError);
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid token" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Authenticated user:", user.id);
    */

    // ==================== AUTHORIZATION ====================
    // Uncomment if admin-only access is required
    /*
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { data: roleData, error: roleError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (roleError && roleError.code !== "PGRST116") {
      console.error("Role check error:", roleError);
    }

    const isAdmin = roleData?.role === "admin";
    if (!isAdmin) {
      console.error("User is not an admin:", user.id);
      return new Response(
        JSON.stringify({
          error: "Forbidden: Admin access required",
        }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Admin access verified for user:", user.id);
    */

    // ==================== INPUT VALIDATION ====================
    const requestData = await req.json();
    
    // Validate required fields
    // Example:
    // if (!requestData.field1) {
    //   return new Response(
    //     JSON.stringify({ error: "Missing required field: field1" }),
    //     {
    //       status: 400,
    //       headers: { ...corsHeaders, "Content-Type": "application/json" },
    //     }
    //   );
    // }

    // ==================== BUSINESS LOGIC ====================
    // TODO: Implement your function logic here
    
    console.log("Processing request:", requestData);

    // Example: Database operation
    // const { data, error } = await supabase
    //   .from('table_name')
    //   .select('*')
    //   .eq('id', requestData.id);

    // Example: External API call
    // const response = await fetch('https://api.example.com/endpoint', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ data: requestData }),
    // });

    // ==================== SUCCESS RESPONSE ====================
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          // Add your response data here
          message: "Operation completed successfully",
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    // ==================== ERROR HANDLING ====================
    console.error("Function error:", error);
    
    // Log error details for debugging
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    // Return user-friendly error response
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
