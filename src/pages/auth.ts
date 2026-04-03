import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = ({ locals }) => {
  const clientId = locals.runtime?.env?.GITHUB_CLIENT_ID;

  if (!clientId) {
    return new Response("Missing GITHUB_CLIENT_ID", { status: 500 });
  }

  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("scope", "repo,user");

  return Response.redirect(url.toString(), 302);
};
