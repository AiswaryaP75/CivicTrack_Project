/**
 * decodeJwt
 * Decodes the payload of a JWT for DISPLAY purposes only (e.g. showing
 * the role or expiry in the UI). This does NOT verify the signature —
 * the backend is always the source of truth for whether a token is valid.
 * Real authorization checks happen server-side in `middleware/auth.js`.
 */
export function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}
