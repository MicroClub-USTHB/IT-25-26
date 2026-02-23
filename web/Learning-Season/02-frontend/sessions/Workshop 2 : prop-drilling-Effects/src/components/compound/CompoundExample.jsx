// src/components/compound/CompoundExample.jsx
import { useState } from 'react';
import { initialTasks } from '../../data/tasks';
import Root from './TodoCompound/Root';
import Header from './TodoCompound/Header';
import List from './TodoCompound/List';

function CompoundExample() {
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
      <h2>Compound Components (No Context)</h2>
      <Root tasks={tasks} onToggle={handleToggle} onDelete={handleDelete}>
        <Header />
        <List />
      </Root>
    </section>
  );
}

export default CompoundExample;