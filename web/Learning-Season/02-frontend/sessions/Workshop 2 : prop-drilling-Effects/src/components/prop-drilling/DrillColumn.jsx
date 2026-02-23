import DrillList from './DrillList';
import { logRender } from '../../performance/logRender';

function DrillColumn({ tasks, onToggle, onDelete }) {
  logRender('DrillColumn render');

  return (
    <div className="nested-box drill-column">
      <p className="node-title">Column</p>
      <DrillList tasks={tasks} onToggle={onToggle} onDelete={onDelete} />
    </div>
  );
}

export default DrillColumn;
