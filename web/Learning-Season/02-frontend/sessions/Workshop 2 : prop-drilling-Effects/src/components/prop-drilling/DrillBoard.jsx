import DrillColumn from './DrillColumn';
import { logRender } from '../../performance/logRender';

function DrillBoard({ tasks, onToggle, onDelete }) {
  logRender('DrillBoard render');

  return (
    <div className="nested-box drill-board">
      <p className="node-title">Board</p>
      <DrillColumn tasks={tasks} onToggle={onToggle} onDelete={onDelete} />
    </div>
  );
}

export default DrillBoard;
