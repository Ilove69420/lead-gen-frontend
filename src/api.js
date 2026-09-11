// src/api.js
import { auth } from "./firebase";

// Set this once you've deployed the backend to Vercel.
export const BACKEND_URL = "https://lead-gen-backend-pi.vercel.app";

async function call(path, body, method = "POST") {
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in");
  const idToken = await user.getIdToken();

  const res = await fetch(`${BACKEND_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    ...(method !== "GET" ? { body: JSON.stringify(body || {}) } : {}),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  listMyLeads: () => call("/api/leads/list", null, "GET"),
  listMainSheet: () => call("/api/leads/mainSheet", null, "GET"),
  updateLead: (payload) => call("/api/leads/update", payload),
  shareLead: (leadId) => call("/api/leads/share", { leadId }),
  deleteOwnLead: (leadId) => call("/api/leads/delete", { leadId, target: "own" }),
  deleteMainSheetLead: (leadId) =>
    call("/api/leads/delete", { leadId, target: "mainSheet" }),
  clearMainSheet: () =>
    call("/api/leads/delete", { target: "mainSheet", clearAll: true }),
  createUser: (payload) => call("/api/users/create", payload),
};
