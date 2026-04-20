// src/components/composition/CompositionExample.jsx
import { useState } from 'react';
import { initialTasks } from '../../data/tasks';
import BoardLayout from './BoardLayout';
import ColumnLayout from './ColumnLayout';
import TaskList from './TaskList';

 function CompositionExample() {
  const [tasks, setTasks] = useState(initialTasks);

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
      <h2>Composition Components</h2>
      <BoardLayout>
        <ColumnLayout>
          <TaskList tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} />
        </ColumnLayout>
      </BoardLayout>
    </section>
  );
}

export default CompositionExample;