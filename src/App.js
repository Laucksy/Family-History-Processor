import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import PeopleList from './components/peopleList.js'

function App() {
  return (
    <Router>
      <div id="header" className="align-items-center p-3 bg-dark">
        <h5 className="text-light">Laucks Family History</h5>
      </div>

      <div className="p-4 bg-light text-center">
        <div className="container">
          <h1 className="display-6">Welcome to the Family History Processor!</h1>
          <p className="lead text-muted">This is a tool for creating family trees.</p>
        </div>
      </div>

      <Routes>
        <Route path="/">
          <Route index element={<PeopleList />} />
          {/* <Route path="about" element={<About />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App
