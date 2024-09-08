// Check if we're in production (Vercel) or development (localhost)
// const apiUrl = process.env.NODE_ENV === 'production' 
//   ? process.env.REACT_APP_API_URL  // Vercel 배포 환경
//   : "http://localhost:4006/api/generate";  // 로컬 개발 환경

const apiUrl = process.env.REACT_APP_API_URL

export const generateQuestion = async (type, text) => {
  if (!apiUrl) {
    throw new Error("API URL is not defined. Please check your .env file.");
  }

  console.log("API URL:", apiUrl);  // URL 확인용 로그
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, text }),
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);
    return data.question;
  } catch (error) {
    console.error('Fetch error:', error.message);
    throw error;
  }
};

