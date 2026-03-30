export function getBaseUrl() {
  if (window.location.hostname.includes("localhost") && false) {
    return "http://localhost:3000/";
  }
  // TODO: Add deployed backend URL
  return "https://webbshop-2026-be.vercel.app//";
}
