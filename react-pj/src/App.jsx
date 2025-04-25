import React, { useState, createContext, useContext, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export const ScoreContext = createContext();

function App() {
  const { score, setScore, total, setTotal } = useContext(ScoreContext);
  const [years, setYears] = useState([]);
  const navigate = useNavigate();

  const contextValue = useMemo(
    () => ({ score, setScore, total, setTotal }),
    [score, setScore, total, setTotal]
  );

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
  }, []);

  const resetScores = () => {
    setScore(0);
    setTotal(0);
  };

  return (
    <ScoreContext.Provider value={contextValue}>
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
            <button className="btn btn-secondary" onClick={resetScores} type="button">
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
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">このサイトについて</h5>
                </div>
                <div className="card-body">
                  このサイトは医療情報技師の勉強をするために作りました。
                  <br />
                  <br />
                  以下のサイトを参考にして作っています。
                  <br />
                  <a href="https://iryoujyouhou.wiki.fc2.com/wiki/トップページ">
                    {' '}
                    https://iryoujyouhou.wiki.fc2.com/wiki/トップページ
                  </a>
                  <br />
                  <br />
                  以下にこのサイトを作るに至った経緯などを記載しています。ご意見やご感想等もコメントでお待ちしています。
                  <br />
                  <a href="https://qiita.com/ryome/items/9f9ae5a644b27fe6106e">
                    {' '}
                    医療情報技師の過去問サイトを爆速で作った話【Python／PHP】
                  </a>
                  <br />
                  <br />
                  <h3>以下、医療情報技師を受験する方は必見です！！！</h3>
                  <br />
                  <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/f25MnDhmHWo"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen
                  />
                  <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/eXPo7fob8po"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen
                  />
                  <br />
                  <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/tdOdW9i7Ggc"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen
                  />
                  <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/jXcqvf85Y2g"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen
                  />
                  <br />
                  <br />
                  徳田 杏さんの「<b>100日後に医療情報技師を受けるSE</b>
                  」もおすすめです。
                  <br />
                  <a href="https://note.com/exitanz9/m/m0339a82cdd8a">
                    100日後に医療情報技師を受けるSE
                  </a>
                </div>
              </div>
              <br />
              {years.map((yearItem) => (
                <div className="card" key={yearItem}>
                  <div className="card-header">
                    <h5 className="card-title">{yearItem}年度 医療情報技師試験対策</h5>
                  </div>
                  <div className="card-body">
                    <Link to={`/Question?year=${yearItem}&kind=ipt`} className="btn btn-primary">
                      情報処理技術系
                    </Link>
                    <Link to={`/Question?year=${yearItem}&kind=mms`} className="btn btn-warning">
                      医学医療系
                    </Link>
                    <Link to={`/Question?year=${yearItem}&kind=mis`} className="btn btn-success">
                      医療情報システム系
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ScoreContext.Provider>
  );
}

export default App;
