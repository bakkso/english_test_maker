// client/src/api.js
// const apiUrl = process.env.REACT_APP_API_URL || 'https://kaileyenglish.vercel.app/api/generate';

export const generateQuestion = async (type, text) => {
  const apiUrl = process.env.REACT_APP_API_URL || 'https://kaileyenglish.vercel.app/api/generate';
  console.log("API URL:", apiUrl);
  console.log("Request payload:", { type, text });

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, text }),
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log("Response body:", responseText);

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse response as JSON:", e);
      throw new Error("Invalid JSON response from server");
    }

    console.log("Parsed response data:", data);
    return data.question;
  } catch (error) {
    console.error('Fetch error:', error.message);
    throw error;
  }
};
