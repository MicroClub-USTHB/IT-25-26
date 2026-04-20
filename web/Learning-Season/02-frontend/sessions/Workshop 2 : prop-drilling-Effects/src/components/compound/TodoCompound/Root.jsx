import { Children, cloneElement, isValidElement } from 'react';
import { logRender } from '../../../performance/logRender';

function Root({ tasks, onToggle, onDelete, children }) {
    logRender('Root render');
  return (
    <div className="nested-box">
      <strong>Root</strong>
      {Children.map(children, (child) => {
        if (!isValidElement(child)) return child;
        return cloneElement(child, { tasks, onToggle, onDelete });
      })}
    </div>
  );
}

export default Root;