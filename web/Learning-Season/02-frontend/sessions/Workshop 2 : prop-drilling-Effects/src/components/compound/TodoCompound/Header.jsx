import { logRender } from "../../../performance/logRender";

function Header({ tasks = [] }) {
  const doneCount = tasks.filter((task) => task.done).length;
logRender('Header    render');
  return (
    
    <div className="nested-box">
      <strong>Header</strong>
      <p className="small-text">
        Total: {tasks.length} | Done: {doneCount}
      </p>
    </div>
  );
}

export default Header;