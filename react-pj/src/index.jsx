import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App, { ScoreContext } from './App';
import Question from './Question';
import Question2 from './Question2';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

function Main() {
  const [score, setScore] = React.useState(0);
  const [total, setTotal] = React.useState(0);

  const contextValue = React.useMemo(
    () => ({ score, setScore, total, setTotal }),
    [score, total],
  );

  return (
    <React.StrictMode>
      <ScoreContext.Provider value={contextValue}>
        <Router>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/Question" element={<Question />} />
            <Route path="/Question2" element={<Question2 />} />
          </Routes>
        </Router>
      </ScoreContext.Provider>
    </React.StrictMode>
  );
}

root.render(<Main />);

reportWebVitals();
