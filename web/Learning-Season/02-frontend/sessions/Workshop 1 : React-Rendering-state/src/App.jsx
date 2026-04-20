// src/App.jsx
import './App.css';
import StudentCard from './components/StudentCard';
import { students } from './constants/Student';
import React,{ useState } from 'react';

function App() {

  const totalStudents = students.length;
  const frontendCount = students.filter(s => s.track === 'Frontend').length;
  const backendCount = students.filter(s => s.track === 'Backend').length;
  const fullstackCount = students.filter(s => s.track === 'Fullstack').length;

  const [object, setObject] = useState({
    '1': 1,
    '2': 2,
  });

  return (
    <div className="app-container">
      <h1 className="page-title">
        🎓 React Workshop - Student Dashboard
      </h1>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setObject({...object, [Object.keys(object).length + 1]: 4})}>
          Add Number
        </button>
        <div>
          {Object.keys(object).map(key => (
            <p key={key}>{object[key]}</p>
          ))}
        </div>
      </div>
      {/* Stats Section */}
      <div className="stats-container">
        <div className="stat-card total">
          <h3>Total Students</h3>
          <p>{totalStudents}</p>
        </div>

        <div className="stat-card frontend">
          <h3>Frontend</h3>
          <p>{frontendCount}</p>
        </div>

        <div className="stat-card backend">
          <h3>Backend</h3>
          <p>{backendCount}</p>
        </div>

        <div className="stat-card fullstack">
          <h3>Fullstack</h3>
          <p>{fullstackCount}</p>
        </div>
      </div>

      {/* Students Grid */}
      <div className="students-grid">
        {students.map(student => (
          <StudentCard
            key={student.id}
            name={student.name}
            age={student.age}
            track={student.track}
          />
        ))}
      </div>
      {students.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">😢</div>
          <h2>No students yet!</h2>
          <p>Add some students to get started!</p>
        </div>
      ) : null}
    </div>
  );
}

export default App;