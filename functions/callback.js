export async function onRequestGet(context) {
  const requestUrl = new URL(context.request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectUri = `${requestUrl.origin}/callback`;
  const clientId = context.env.GITHUB_CLIENT_ID;
  const clientSecret = context.env.GITHUB_CLIENT_SECRET;

  if (!code) {
    return new Response("Missing code", { status: 400 });
  }

  if (!clientId || !clientSecret) {
    return new Response("Missing GitHub OAuth env vars", { status: 500 });
  }

  const tokenResponse = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    },
  );

  if (!tokenResponse.ok) {
    return new Response(
      `GitHub token exchange failed: ${tokenResponse.status}`,
      { status: 502 },
    );
  }

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  if (!accessToken) {
    const error = tokenData.error || "unknown";
    const description = tokenData.error_description || "no description";
    return new Response(
      `GitHub token exchange error: ${error} — ${description}`,
      { status: 502 },
    );
  }

  const html = `<!doctype html>
<html>
  <body>
    <script>
      const receiveMessage = (e) => {
        window.opener.postMessage(
          'authorization:github:success:{"token":"${accessToken}"}',
          e.origin
        );
        window.removeEventListener("message", receiveMessage);
      };
      window.addEventListener("message", receiveMessage);
      window.opener.postMessage("authorizing:github", "*");
    </script>
  </body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=UTF-8" },
  });
}
