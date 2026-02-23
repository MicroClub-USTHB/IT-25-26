function BoardLayout({ children }) {
  return (
    <div className="nested-box">
      <strong>BoardLayout (children only)</strong>
      {children}
    </div>
  );
}

export default BoardLayout;