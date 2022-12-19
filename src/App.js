import './App.css'

import PeopleList from './components/peopleList.js'

function App() {
  return (
    <div>
      <div id="header" className="align-items-center p-3 bg-dark">
        <h5 className="text-light">Laucks Family History</h5>
      </div>

      <div className="p-5 bg-light text-center">
        <div className="container">
          <h1 className="display-4">Welcome to the Family History Processor!</h1>
          <p className="lead text-muted">This is a tool for documenting family members and creating family trees.</p>
        </div>
      </div>

      <PeopleList />
    </div>
  );
}

export default App
