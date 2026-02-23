import { logRender } from "../../../performance/logRender";

// src/components/compound/TodoCompound/List.jsx
function List({ tasks = [], onToggle, onDelete }) {
    logRender('List render');
  return (
    <div className="nested-box">
      <strong>List</strong>
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
    </div>
  );
}

export default List;