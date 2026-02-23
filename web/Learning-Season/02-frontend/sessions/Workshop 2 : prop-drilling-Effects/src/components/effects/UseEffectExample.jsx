import { useEffect, useState } from 'react';

function UseEffectExample({ tasks }) {
  const [secondsOnline, setSecondsOnline] = useState(0);
  const [lastSavedAt, setLastSavedAt] = useState('never');
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // CASE 1: No dependency array -> runs after every render
  useEffect(() => {
    console.log('Rendered: UseEffectExample');
  });

  // CASE 2: [] -> run once on mount, cleanup on unmount
  useEffect(() => {
    const id = setInterval(() => {
      setSecondsOnline((s) => s + 1);
    }, 1000);

    return () => clearInterval(id);
  }, []);

  // CASE 3: [tasks] -> run when tasks change
  useEffect(() => {
    localStorage.setItem('workshop_tasks', JSON.stringify(tasks));
    setLastSavedAt(new Date().toLocaleTimeString());
  }, [tasks]);

  // CASE 4: Event listener with cleanup
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // CASE 5: Fetch on mount with abort cleanup
  useEffect(() => {
    const controller = new AbortController();

    async function loadUsers() {
      setLoadingUsers(true);
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users?_limit=3', {
          signal: controller.signal,
        });
        const data = await response.json();
        console.log('Fetched users', data);
        setUsers(data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Failed to fetch users', error);
        }
      } finally {
        setLoadingUsers(false);
      }
    }

    loadUsers();
    return () => controller.abort();
  }, [tasks]);

  return (
    <section className="example-card">
      <h2>useEffect Live Demo</h2>
      <p className="small-text">Seconds online: {secondsOnline}</p>
      <p className="small-text">Last auto-save: {lastSavedAt}</p>
      <p className="small-text">Screen width: {screenWidth}px</p>
      <p className="small-text">
        Users loaded: {loadingUsers ? 'loading...' : users.length}
      </p>
    </section>
  );
}

export default UseEffectExample;