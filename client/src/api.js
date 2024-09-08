console.log("API URL:", "http://localhost:4006/api/generate"); // Verify the hardcoded URL

export const generateQuestion = async (type, text) => {
  const apiUrl = "http://localhost:4006/api/generate";

  if (!apiUrl) {
    throw new Error("API URL is not defined. Please check your .env file.");
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ type, text })
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  console.log(data);
  return data.question;
};


// export const generateQuestion = async (type, text) => {
//   const apiUrl = process.env.REACT_APP_API_URL;

//   if (!apiUrl) {
//     throw new Error("API URL is not defined. Please check your .env file.");
//   }

//   const response = await fetch(apiUrl, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ type, text })
//   });

//   if (!response.ok) {
//     throw new Error('Network response was not ok');
//   }

//   const data = await response.json();
//   return data.question;
// };
