export async function handler(event) {
  const backend = import.meta.env.VITE_BASE_URL;

  const path = event.path.replace("/.netlify/functions/proxy", "");
  const targetUrl = backend + path;

  try {
    const response = await fetch(targetUrl, {
      method: event.httpMethod,
      headers: event.headers,
      body: event.body,
    });

    return {
      statusCode: response.status,
      body: await response.text(),
      headers: {
        "Content-Type": response.headers.get("content-type") || "application/json",
      }
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
}