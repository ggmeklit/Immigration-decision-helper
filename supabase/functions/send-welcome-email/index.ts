// Send email using Mailersend inside a Supabase Edge Function

// 1. Read your Mailersend API key from environment variables
const MAILERSEND_API_KEY = Deno.env.get("MAILERSEND_API_KEY");

// 2. This function will run whenever your frontend calls it
Deno.serve(async (req) => {
  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Build the Mailersend request payload
    const payload = {
      from: {
        email: "no-reply@trial-mailersend.com", // replace with your verified sender
        name: "ThriveBridge"
      },
      to: [
        {
          email: email
        }
      ],
      subject: "Welcome to ThriveBridge Community!",
      text: "Thank you for joining our community.",
      html: "<p>Thank you for joining our ThriveBridge Community!</p>"
    };

    // 4. Send email through Mailersend API
    const response = await fetch("https://xzqmodnlcjfkzcfsgywy.supabase.co/functions/v1/send-welcome-email", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MAILERSEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({ error: "Mailersend error", details: errorText }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Unexpected error", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
