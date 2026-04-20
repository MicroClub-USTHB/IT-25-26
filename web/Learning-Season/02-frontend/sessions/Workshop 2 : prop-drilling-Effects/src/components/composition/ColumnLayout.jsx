// src/components/composition/ColumnLayout.jsx
function ColumnLayout({ children }) {
  return (
    <div className="nested-box">
      <strong>ColumnLayout (children only)</strong>
      {children}
    </div>
  );
}

export default ColumnLayout;