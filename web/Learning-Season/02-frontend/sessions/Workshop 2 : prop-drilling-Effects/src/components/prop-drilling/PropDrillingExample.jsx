import { useState } from 'react';
import { initialTasks } from '../../data/tasks';
import DrillBoard from './DrillBoard';
import { logRender } from '../../performance/logRender';

function PropDrillingExample() {
  logRender('PropDrillingExample render');

  const [tasks, setTasks] = useState(initialTasks);
  const [searchText, setSearchText] = useState('');
  const [unrelatedCounter, setUnrelatedCounter] = useState(0);

  const handleToggle = (id) => {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
    );
  };

  const handleDelete = (id) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  };

  return (
    <section className="example-card">
      <div className="example-head">
        <h2>1) Prop Drilling (baseline)</h2>
        <span className="status-pill">Live Starter</span>
      </div>
      <p className="example-note">
        The delete/toggle handlers travel through components that do not use them.
      </p>
      <p className="path-line">Path: App -&gt; Board -&gt; Column -&gt; List</p>

      <div className="debug-controls">
        <input
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Type here (unrelated state)"
        />
        <button type="button" onClick={() => setUnrelatedCounter((n) => n + 1)}>
          Unrelated update: {unrelatedCounter}
        </button>
      </div>

      <DrillBoard tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} />
    </section>
  );
}

export default PropDrillingExample;
