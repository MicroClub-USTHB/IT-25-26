

export default function Test() {
  const containerRef = useRef(null);


  return (
    <div ref={containerRef}>
      <div className="card h-screen bg-red-300">Card 1</div>
      <div className="card h-screen bg-blue-300">Card 2</div>
      <div className="card h-screen bg-green-300">Card 3</div>
    </div>
  );
}