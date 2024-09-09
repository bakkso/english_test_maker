import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedType, setSelectedType] = useState('');
  const [text, setText] = useState('');
  const [generatedQuestion, setGeneratedQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const problemTypes = [
    { kor: "주제문제", eng: "Topic Question" },
    { kor: "제목문제", eng: "Title Question" },
    { kor: "의미추론문제", eng: "Inference Question" },
    { kor: "내용일치문제", eng: "Detail Match Question" },
    { kor: "내용불일치문제", eng: "Detail Mismatch Question" },
    { kor: "어휘문제", eng: "Vocabulary Question" },
    { kor: "빈칸문제", eng: "Fill-in-the-Blank Question" },
    { kor: "순서문제", eng: "Sequence Question" },
    { kor: "문장삽입문제", eng: "Sentence Insertion Question" },
    { kor: "요약문 빈칸문제", eng: "Summary Fill-in-the-Blank Question" },
    { kor: "동의어 반의어", eng: "Synonyms and Antonyms" },
    { kor: "내용구조화", eng: "Content Organization" }
  ];

  const generateQuestion = async (type, text) => {
    const timeout = 60000; // 60초
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
  
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, text }),
        signal: controller.signal
      });
      
      clearTimeout(id);
      
      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Server responded with an error:', response.status, errorBody);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.question;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('Request timed out');
        throw new Error('Request timed out');
      }
      console.error('Fetch error:', error);
      throw error;
    }
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleGenerate = async () => {
    if (!selectedType || !text) {
      alert('문제 유형과 텍스트를 모두 입력해주세요.');
      return;
    }
  
    setIsLoading(true);
    try {
      const selectedTypeEng = problemTypes.find(type => type.kor === selectedType).eng;
      console.log('Selected Type (English):', selectedTypeEng); // 디버깅용 로그
      const question = await generateQuestion(selectedTypeEng, text);
      
      // 디버깅 용 로그
      console.log('Generated Question:', question);
  
      setGeneratedQuestion(question);
    } catch (error) {
      console.error('Error generating question:', error);
      alert('문제 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Kailey English</h1>
      
      <div className="problem-types">
        <h2>문제 유형</h2>
        {problemTypes.map((type, index) => (
          <label key={index}>
            <input
              type="radio"
              value={type.kor}
              checked={selectedType === type.kor}
              onChange={handleTypeChange}
              name="problemType"
            />
            {type.kor}
          </label>
        ))}
      </div>
  
      <div className="text-input">
        <h2>텍스트 입력</h2>
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="지문을 입력하세요"
          rows={10}
        />
      </div>
  
      <button onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? '생성 중...' : '생성'}
      </button>
  
      {generatedQuestion && (
        <div className="generated-question">
          <h2>생성된 문제:</h2>
          {Array.isArray(generatedQuestion) && generatedQuestion.length > 0 ? (
            <pre>{generatedQuestion[0].text}</pre>
          ) : (
            <pre>{typeof generatedQuestion === 'string' ? generatedQuestion : JSON.stringify(generatedQuestion, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
}

export default App;