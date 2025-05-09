import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ScoreContext } from './App';

function Question() {
  const navigate = useNavigate();
  const { score, setScore, total, setTotal } = useContext(ScoreContext);
  const [year, setYear] = useState('2024');
  const [kind, setKind] = useState('ipt');
  const [years, setYears] = useState([]);
  const [files, setFiles] = useState([]);

  const fetchQuestions = async (currentYear, currentKind) => {
    try {
      const response = await fetch('/hit/json/merged_output.json');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const filteredQuestions = data
        .filter((q) => q.year.toString() === currentYear && q.category === currentKind)
        .sort((a, b) => a.problem_number - b.problem_number);
      setFiles(filteredQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await fetch('/hit/json/years.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setYears(data);
      } catch (error) {
        console.error('Error fetching years:', error);
      }
    };

    fetchYears();
    const query = new URLSearchParams(window.location.search);
    const queryYear = query.get('year');
    const queryKind = query.get('kind');

    if (queryYear) {
      setYear(queryYear);
    }
    if (queryKind) {
      setKind(queryKind);
    }
    fetchQuestions(queryYear || '2024', queryKind || 'ipt');
  }, []);

  useEffect(() => {
    fetchQuestions(year, kind);
  }, [year, kind]);

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleKindChange = (event) => {
    setKind(event.target.value);
  };

  const handleScoreReset = () => {
    setScore(0);
    setTotal(0);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <button
            className="navbar-brand btn btn-link"
            type="button"
            onClick={() => navigate('/hit')}
          >
            医療情報技師試験対策サイト
          </button>
          <button className="btn btn-secondary" onClick={handleScoreReset} type="button">
            リセット
          </button>
          <ul className="navbar-nav">
            <li className="nav-item">
              <button type="button" className="btn btn-success">
                正解数： <span className="badge bg-secondary">{score}問</span>
              </button>
              <button type="button" className="btn btn-info">
                トータル： <span className="badge bg-secondary">{total}問</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <div className="container mt-4">
        <div className="row">
          <div className="col">
            <div className="d-flex justify-content-start mb-4">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate('/hit')}
              >
                ← 戻る
              </button>
            </div>
            <div className="card mb-4">
              <div className="card-body">
                <form className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="year-select" className="form-label">
                      年度
                    </label>
                    <select
                      id="year-select"
                      className="form-select"
                      value={year}
                      onChange={handleYearChange}
                    >
                      {years.map((yearItem) => (
                        <option key={yearItem} value={yearItem}>
                          {yearItem}年
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="kind-select" className="form-label">
                      種類
                    </label>
                    <select
                      id="kind-select"
                      className="form-select"
                      value={kind}
                      onChange={handleKindChange}
                    >
                      <option value="ipt">情報処理技術系</option>
                      <option value="mis">医療情報システム系</option>
                      <option value="mms">医学医療系</option>
                    </select>
                  </div>
                </form>
              </div>
            </div>

            {files.map((question) => (
              <div className="card" key={question.problem_number}>
                <div className="card-header">
                  <h5 className="card-title">
                    医療情報技師試験
                    {kind === 'ipt' && '情報処理技術系'}
                    {kind === 'mis' && '医療情報システム系'}
                    {kind === 'mms' && '医学医療系'}問{question.problem_number}
                  </h5>
                </div>
                <div className="card-body">
                  <Link
                    to={`/hit/Question2?year=${year}&kind=${kind}&num=${String(question.problem_number).padStart(2, '0')}`}
                    className="btn btn-primary"
                  >
                    問題へ
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Question;
