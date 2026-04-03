/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="vite-plugin-svgr/client" />

interface CloudflareRuntimeEnv {
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
}

declare namespace App {
  interface Locals {
    runtime?: {
      env?: CloudflareRuntimeEnv;
    };
  }
}
