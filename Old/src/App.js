import React, { useState } from 'react';
import './App.css';
import { generateQuestion } from './api';

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
      const question = await generateQuestion(selectedTypeEng, text);
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
          <p>{generatedQuestion}</p>
        </div>
      )}
    </div>
  );
}

export default App;
