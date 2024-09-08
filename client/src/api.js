// Check if we're in production (Vercel) or development (localhost)
const apiUrl = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL  // Vercel 배포 환경
  : "http://localhost:4006/api/generate";  // 로컬 개발 환경

export const generateQuestion = async (type, text) => {
  if (!apiUrl) {
    throw new Error("API URL is not defined. Please check your .env file.");
  }

  console.log("API URL:", apiUrl);  // URL을 확인하는 로그 추가
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type, text }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  console.log(data);
  return data.question;
};

