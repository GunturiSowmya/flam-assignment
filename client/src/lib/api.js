import { parseResult } from "./parseResult.js";

const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

export async function generateStudyMaterial(prompt) {
  let response;
  try {
    response = await fetch(`${apiBaseUrl}/api/response`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
  } catch {
    throw new Error("Could not connect to the study assistant. Check your connection and try again.");
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error("The server returned an invalid response. Please try again.");
  }

  if (response.status === 504) {
    throw new Error("The AI request took too long. Please try again.");
  }
  if (!response.ok || payload?.success !== true) {
    throw new Error("Something went wrong while generating your study material. Please try again.");
  }
  if (payload.data === "" || payload.data == null) {
    throw new Error("The AI returned an empty response. Please try again.");
  }
  if (typeof payload.data !== "string") throw new Error("The AI returned an invalid response. Please try again.");

  return parseResult(payload.data);
}
