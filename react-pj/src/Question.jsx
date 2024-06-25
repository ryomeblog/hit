import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ScoreContext } from './App';

function Question() {
  const navigate = useNavigate();
  const { score, setScore, total, setTotal } = useContext(ScoreContext);
  const [year, setYear] = useState('2023');
  const [kind, setKind] = useState('ipt');
  const [years, setYears] = useState([]);
  const [files, setFiles] = useState([]);

  const fetchFiles = async (currentYear, currentKind) => {
    try {
      const response = await fetch('/json/q.json');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const yearData = data.find((item) => item.year === currentYear);
      if (yearData) {
        const filteredFiles = yearData.files
          .filter((file) => file.startsWith(`${currentKind}-${currentYear}`))
          .sort((a, b) => {
            const aNum = parseInt(a.split('-')[2].split('.')[0], 10);
            const bNum = parseInt(b.split('-')[2].split('.')[0], 10);
            return aNum - bNum;
          });
        setFiles(filteredFiles);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    }
    return [];
  };

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await fetch('/json/years.json');
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
    fetchFiles(queryYear, queryKind);
  }, []);

  useEffect(() => {
    fetchFiles(year, kind);
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
            onClick={() => navigate('/')}
          >
            医療情報技師試験対策サイト
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleScoreReset}
            type="button"
          >
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
      <div className="container">
        <div className="row">
          <div className="col">
            <form>
              <label htmlFor="year-select">
                年度:
                <select
                  id="year-select"
                  value={year}
                  onChange={handleYearChange}
                >
                  {years.map((yearItem) => (
                    <option key={yearItem} value={yearItem}>
                      {yearItem}
                    </option>
                  ))}
                </select>
              </label>
              <label htmlFor="kind-select">
                種類:
                <select
                  id="kind-select"
                  value={kind}
                  onChange={handleKindChange}
                >
                  <option value="ipt">情報処理技術系</option>
                  <option value="mis">医療情報システム系</option>
                  <option value="mms">医学医療系</option>
                </select>
              </label>
            </form>

            {files.map((fileItem) => (
              <div className="card" key={fileItem}>
                <div className="card-header">
                  <h5 className="card-title">
                    医療情報技師試験
                    {kind === 'ipt' && '情報処理技術系'}
                    {kind === 'mis' && '医療情報システム系'}
                    {kind === 'mms' && '医学医療系'}問
                    {fileItem.match(/-(\d+)-(\d+)\.json$/)[2]}
                  </h5>
                </div>
                <div className="card-body">
                  <Link
                    to={`/Question2?year=${year}&kind=${kind}&num=${fileItem.match(/-(\d+)-(\d+)\.json$/)[2]}`}
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
