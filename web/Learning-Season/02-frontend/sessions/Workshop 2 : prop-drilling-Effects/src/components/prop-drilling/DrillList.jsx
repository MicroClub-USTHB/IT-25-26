import { logRender } from '../../performance/logRender';

function DrillList({ tasks, onToggle, onDelete }) {
  logRender('DrillList render');

  return (
    <div className="nested-box drill-list">
      <p className="node-title">List</p>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-row">
            <label className="task-label">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => onToggle(task.id)}
              />
              <span className={task.done ? 'done' : ''}>{task.text}</span>
            </label>
            <button className="delete-btn" type="button" onClick={() => onDelete(task.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DrillList;
