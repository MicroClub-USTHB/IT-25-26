// src/components/composition/TaskList.jsx
function TaskList({ tasks, onToggle, onDelete }) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className="task-row">
          <label>
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => onToggle(task.id)}
            />
            <span className={task.done ? 'done' : ''}>{task.text}</span>
          </label>
          <button type="button" onClick={() => onDelete(task.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;