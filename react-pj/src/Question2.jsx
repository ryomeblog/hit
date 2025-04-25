import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ScoreContext } from './App';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Question2() {
  const navigate = useNavigate();
  const { score, setScore, total, setTotal } = useContext(ScoreContext);
  const query = useQuery();
  const year = query.get('year') || '2022';
  const kind = query.get('kind') || 'ipt';
  const [num, setNum] = useState(query.get('num') || '01');
  const [questionData, setQuestionData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuestionData = async () => {
      try {
        const response = await fetch(`/json/${year}/${kind}-${year}-${num}.json`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setQuestionData(data);
      } catch (error) {
        console.error('Error fetching question data:', error);
      }
    };

    fetchQuestionData();
  }, [year, kind, num]);

  const handleAnswerChange = (event) => {
    const { value } = event.target;
    setSelectedAnswers((prev) =>
      prev.includes(value) ? prev.filter((answer) => answer !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const correctAnswers = questionData.answer.split(',');
      const isCorrect = selectedAnswers.join(',') === correctAnswers.join(',');
      if (isCorrect) {
        setResult({
          text: `正解です<br />正解: ${correctAnswers.join(',')}<br />あなたの解答: ${selectedAnswers.join(',')}`,
          url: questionData.url,
        });
        setScore(score + 1);
      } else {
        setResult({
          text: `不正解です<br />正解: ${correctAnswers.join(',')}<br />あなたの解答: ${selectedAnswers.join(',')}`,
          url: questionData.url,
        });
      }
      setTotal(total + 1);
    } catch (error) {
      console.error('Error submitting answers:', error);
    }
  };

  const formatNum = (fnum) => {
    return fnum.toString().padStart(2, '0');
  };

  if (!questionData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-start mb-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => navigate('/')}
                >
                  ← 戻る
                </button>
              </div>
              <h5 className="card-title">
                医療情報技師試験 {kind === 'ipt' && '情報処理技術系'}
                {kind === 'mis' && '医療情報システム系'}
                {kind === 'mms' && '医学医療系'} 問{num}
              </h5>
              <div className="d-flex justify-content-between mt-3">
                <button type="button" className="btn btn-success">
                  正解数：
                  <span className="badge bg-light text-dark">{score}問</span>
                </button>
                <button type="button" className="btn btn-info">
                  トータル：
                  <span className="badge bg-light text-dark">{total}問</span>
                </button>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={() => {
                    setScore(0);
                    setTotal(0);
                  }}
                >
                  リセット
                </button>
              </div>
            </div>
            <div className="card-body">
              <p>問題：{questionData.question}</p>
              <form onSubmit={handleSubmit}>
                {Object.keys(questionData)
                  .filter((key) => key.startsWith('select'))
                  .map((key) => (
                    <div key={key} className="mb-2">
                      <input
                        type="checkbox"
                        className="btn-check"
                        id={key}
                        value={key.replace('select', '')}
                        onChange={handleAnswerChange}
                        autoComplete="off"
                      />
                      <label className="btn btn-outline-primary w-100 text-start" htmlFor={key}>
                        {questionData[key]}
                      </label>
                    </div>
                  ))}
                <button type="submit" className="btn btn-primary">
                  解答
                </button>
              </form>
              {result && (
                <div>
                  <div
                    className="alert alert-info"
                    role="alert"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: result.text }}
                  />
                  <a href={result.url} target="_blank" rel="noopener noreferrer">
                    解説リンク
                  </a>
                </div>
              )}
              <div className="d-flex justify-content-between mt-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    navigate(
                      `/Question2?year=${year}&kind=${kind}&num=${formatNum(Number(num) - 1)}`
                    )
                  }
                  disabled={num <= 1}
                >
                  前の問題
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setSelectedAnswers([]);
                    setResult(null);
                    setQuestionData(null);
                    setNum(formatNum(Number(num) + 1));
                    navigate(
                      `/Question2?year=${year}&kind=${kind}&num=${formatNum(Number(num) + 1)}`
                    );
                  }}
                >
                  次の問題
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Question2;
