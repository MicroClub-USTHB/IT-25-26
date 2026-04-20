# 🛠️ **PRACTICAL SESSION: Workshop 2 - From Prop Drilling to Better Patterns**

## 🎯 **GOALS FOR PRACTICAL SESSION**

By the end, students should have:

1. ✅ Identified prop drilling in a real React tree
2. ✅ Refactored to **Composition Components**
3. ✅ Refactored to **Compound Components** (without Context)
4. ✅ Understood and implemented **useContext + Context API**
5. ✅ Understood and implemented **useEffect** with real use cases and cleanup

---

## 🚀 **PART 1: Start From Prop Drilling Baseline (10 min)**

### **Step 1: Run the starter**

```bash
cd /Users/destockphonedz/Documents/ReactWorkshop/prop-drilling-worst-practice
npm install
npm run dev
```

### **Step 2: Show current architecture**

Current files to open live:

- `src/components/prop-drilling/PropDrillingExample.jsx`
- `src/components/prop-drilling/DrillBoard.jsx`
- `src/components/prop-drilling/DrillColumn.jsx`
- `src/components/prop-drilling/DrillList.jsx`

### **What you say**

```text
"Here, handlers onToggle/onDelete are created at the top,
then passed through Board -> Column -> List.
Board and Column don't need these handlers, but they carry them anyway.
This is the prop drilling problem."
```

### Reflection Questions

1. Which components really use the handlers?
2. Which components only pass them?
3. If we rename one prop, how many files must change?

---


## 📈 **PART 1.5: Demonstrate Performance In VSCode Terminal (10 min)**

## Goal
Prove that prop drilling can trigger unnecessary re-renders.

### **Step 1: Add a tiny render logger helper**

Create `src/performance/logRender.js`:

```jsx
export function logRender(label) {
  console.count(label);
}
```

### **Step 2: Instrument baseline components**

Add to each component body:

```jsx
import { logRender } from '../../performance/logRender'; // adjust path

function AnyComponent() {
  logRender('AnyComponent render');
  // ...
}
```

In your baseline, add this to:
- `PropDrillingExample`
- `DrillBoard`
- `DrillColumn`
- `DrillList`

### **Step 3: Trigger unrelated updates**

In `PropDrillingExample`, add unrelated state:

```jsx
const [searchText, setSearchText] = useState('');
const [unrelatedCounter, setUnrelatedCounter] = useState(0);
```

Render:

```jsx
<input value={searchText} onChange={(e) => setSearchText(e.target.value)} />
<button onClick={() => setUnrelatedCounter((n) => n + 1)}>Unrelated update</button>
```

### **What to show in terminal**

1. Type in the input (unrelated state).
2. Watch terminal counts increase for `DrillBoard`, `DrillColumn`, `DrillList`.
3. Explain: these components re-render even though task data did not change.

### **Same terminal-logging strategy for every pattern**

Use `logRender()` in all versions you build live:

- Composition:
  - `BoardLayout`, `ColumnLayout`, `TaskList`
- Compound (No Context):
  - `Root`, `Header`, `List`
- Context:
  - `ThemeToggleButton`, `ThemedCard`, and parent container

### **Expected classroom result**

- Prop Drilling: many components re-render frequently.
- Composition: fewer middle components need props, better structure.
- Compound: controlled composition, cleaner API.
- Context: no drilling for shared global values (like theme), but consumers still re-render when context value changes.

### Important note for class

In development with `StrictMode`, you may see more logs than expected.
That is normal in dev mode and helps detect side-effect issues.

### ⚠️ Short StrictMode explanation (say this live)

```text
"StrictMode is a development safety tool from React.
It intentionally runs some logic more than once in dev
to help us detect side effects and unsafe code.
It does NOT double-run like this in production build."
```

## 🧱 **PART 2: Refactor to Composition Components (20 min)**

## Goal
Middle components become layout wrappers with `children` only.

### **Step 1: Create new folder**

Create:
- `src/components/composition/BoardLayout.jsx`
- `src/components/composition/ColumnLayout.jsx`
- `src/components/composition/TaskList.jsx`
- `src/components/composition/CompositionExample.jsx`

### **Step 2: Add layout wrappers**

```jsx
// src/components/composition/BoardLayout.jsx
function BoardLayout({ children }) {
  return (
    <div className="nested-box">
      <strong>BoardLayout (children only)</strong>
      {children}
    </div>
  );
}

export default BoardLayout;
```

```jsx
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
```

### **Step 3: Add real list component**

```jsx
// src/components/composition/TaskList.jsx
function TaskList({ tasks, onToggle, onDelete }) {
  return (
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
  );
}

export default TaskList;
```

### **Step 4: Compose everything**

```jsx
// src/components/composition/CompositionExample.jsx
import { useState } from 'react';
import { initialTasks } from '../../data/tasks';
import BoardLayout from './BoardLayout';
import ColumnLayout from './ColumnLayout';
import TaskList from './TaskList';

function CompositionExample() {
  const [tasks, setTasks] = useState(initialTasks);

  const handleToggle = (id) => {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
    );
  };

  const handleDelete = (id) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  };

  return (
    <section className="example-card">
      <h2>Composition Components</h2>
      <BoardLayout>
        <ColumnLayout>
          <TaskList tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} />
        </ColumnLayout>
      </BoardLayout>
    </section>
  );
}

export default CompositionExample;
```

### **Step 5: Show it in App.jsx**

Temporarily replace prop drilling component:

```jsx
import CompositionExample from './components/composition/CompositionExample';

function App() {
  return <CompositionExample />;
}
```

### What changed

- Wrappers no longer receive business props
- Handlers stay closer to where they are used

---

## 🧩 **PART 3: Refactor to Compound Components (No Context) (20 min)**

## Goal
Use direct components: `<Root />`, `<Header />`, `<List />`.

Important rule for this workshop:
- ❌ No Context in compound section
- ✅ Direct components only

### **Step 1: Create files**

- `src/components/compound/TodoCompound/Root.jsx`
- `src/components/compound/TodoCompound/Header.jsx`
- `src/components/compound/TodoCompound/List.jsx`
- `src/components/compound/CompoundExample.jsx`

### **Step 2: Root component (inject props to children)**

```jsx
// src/components/compound/TodoCompound/Root.jsx
import { Children, cloneElement, isValidElement } from 'react';

function Root({ tasks, onToggle, onDelete, children }) {
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
```

### **Step 3: Header component**

```jsx
// src/components/compound/TodoCompound/Header.jsx
function Header({ tasks = [] }) {
  const doneCount = tasks.filter((task) => task.done).length;

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
```

### **Step 4: List component**

```jsx
// src/components/compound/TodoCompound/List.jsx
function List({ tasks = [], onToggle, onDelete }) {
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
```

### **Step 5: Use direct components**

```jsx
// src/components/compound/CompoundExample.jsx
import { useState } from 'react';
import { initialTasks } from '../../data/tasks';
import Root from './TodoCompound/Root';
import Header from './TodoCompound/Header';
import List from './TodoCompound/List';

function CompoundExample() {
  const [tasks, setTasks] = useState(initialTasks);

  const handleToggle = (id) => {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
    );
  };

  const handleDelete = (id) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  };

  return (
    <section className="example-card">
      <h2>Compound Components (No Context)</h2>
      <Root tasks={tasks} onToggle={handleToggle} onDelete={handleDelete}>
        <Header />
        <List />
      </Root>
    </section>
  );
}

export default CompoundExample;
```

---

## 🌐 **PART 4: useContext + Context API (25 min)**

## Goal
Use a very simple global state with Context: **Dark Mode**.

### **Step 1: Create context file**

Create `src/context/ThemeContext.jsx`:

```jsx
import { createContext, useContext, useMemo, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark((current) => !current);
  const value = useMemo(() => ({ isDark, toggleTheme }), [isDark]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return value;
}
```

### **Step 2: Wrap App**

```jsx
// src/main.jsx
import { ThemeProvider } from './context/ThemeContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
```

### **Step 3: Add a simple toggle button**

Create `src/components/context/ThemeToggleButton.jsx`:

```jsx
import { useTheme } from '../../context/ThemeContext';

function ThemeToggleButton() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button type="button" onClick={toggleTheme}>
      Switch to {isDark ? 'Light' : 'Dark'} mode
    </button>
  );
}

export default ThemeToggleButton;
```

### **Step 4: Read theme in a second component**

Create `src/components/context/ThemedCard.jsx`:

```jsx
import { useTheme } from '../../context/ThemeContext';

function ThemedCard() {
  const { isDark } = useTheme();

  return (
    <section className={isDark ? 'theme-card dark' : 'theme-card light'}>
      <h3>Context Demo</h3>
      <p>Current theme: {isDark ? 'Dark' : 'Light'}</p>
    </section>
  );
}
```

### **Step 5: Use both in App.jsx**

```jsx
import ThemeToggleButton from './components/context/ThemeToggleButton';
import ThemedCard from './components/context/ThemedCard';

function App() {
  return (
    <>
      <PropDrillingExample />
      <ThemeToggleButton />
      <ThemedCard />
    </>
  );
}
```

### **Step 6: Add tiny CSS**

```css
.theme-card {
  margin-top: 12px;
  padding: 12px;
  border-radius: 10px;
}

.theme-card.light {
  background: #ffffff;
  color: #132238;
  border: 1px solid #d6e0ef;
}

.theme-card.dark {
  background: #162033;
  color: #f2f6ff;
  border: 1px solid #304568;
}
```

### Reflection Questions

1. Why is Dark Mode a good first Context example?
2. Which components now read the same value without prop drilling?
3. When is Context better than passing props?

---

## 🔄 **PART 5: useEffect (Separate Lesson) (35 min)**

## ⚡ `useEffect` - The Power Hook

`useEffect` means: **do something after render**.

Use it for side effects:
- API requests
- Timers
- Event listeners
- Local storage sync
- External integrations

### Basic syntax

```jsx
useEffect(() => {
  // effect logic (setup)

  return () => {
    // cleanup logic (optional)
  };
}, [dependencies]);
```

---

## 🧠 The 3 Main Ways to Use `useEffect`

### 1) No dependency array -> runs after **every render**

```jsx
useEffect(() => {
  console.log('Component rendered');
});
```

Runs:
- After first render
- After every re-render

Warning:
- Do not update state unconditionally here or you can create infinite loops.

Bad example:

```jsx
useEffect(() => {
  setCount((c) => c + 1); // infinite loop risk
});
```

---

### 2) Empty dependency array `[]` -> runs once on mount

```jsx
useEffect(() => {
  console.log('Mounted once');
}, []);
```

Runs:
- Once after initial render

Good for:
- Initial fetch
- Setting listeners
- Starting timers

---

### 3) With dependencies `[x, y]` -> runs when those values change

```jsx
useEffect(() => {
  console.log('searchTerm changed:', searchTerm);
}, [searchTerm]);
```

Runs:
- After first render
- Again when any dependency value changes

Good for:
- Syncing localStorage when data changes
- Fetching on filter/search change
- Updating `document.title`

Multiple dependencies example:

```jsx
useEffect(() => {
  fetchData(userId, postId);
}, [userId, postId]);
```

---

## 🧹 Cleanup Function (Very Important)

```jsx
useEffect(() => {
  const id = setInterval(() => {
    console.log('tick');
  }, 1000);

  return () => {
    clearInterval(id);
    console.log('cleanup');
  };
}, []);
```

Cleanup runs:
- Before the effect runs again (if dependencies changed)
- On component unmount

Use cleanup for:
- Intervals/timeouts
- Event listeners
- Canceling fetch with `AbortController`
- WebSocket/subscription teardown

---

## 📋 Common `useEffect` Patterns

### Pattern A: Fetch data on mount

```jsx
useEffect(() => {
  const controller = new AbortController();

  async function loadUsers() {
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/users', {
        signal: controller.signal,
      });
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      if (error.name !== 'AbortError') setError('Failed to load users');
    }
  }

  loadUsers();
  return () => controller.abort();
}, []);
```

### Pattern B: Sync state to localStorage

```jsx
useEffect(() => {
  localStorage.setItem('workshop_tasks', JSON.stringify(tasks));
}, [tasks]);
```

### Pattern C: Window listener with cleanup

```jsx
useEffect(() => {
  function handleResize() {
    setWidth(window.innerWidth);
  }

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

---

## ✅ Full Real Demo To Add Live

Create `src/components/effects/UseEffectExample.jsx`:

```jsx
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
  }, []);

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
```

Use it in your screen:

```jsx
import UseEffectExample from './components/effects/UseEffectExample';

// inside your component render
<UseEffectExample tasks={tasks} />
```

### Important note for class

In development with `StrictMode`, React may run mount effects twice to detect side-effect bugs.  
This is expected in development and does not happen in production build.

---

## 📸 **SHOWCASE TIME (5 min)**

What you say:

```text
"Today we started from prop drilling and gradually moved to better architecture:
Composition -> Compound -> Context.
Then we added useEffect with a real feature (auto-save + timer cleanup).
This is exactly how real React code evolves in teams."
```

---

## 🏠 **HOMEWORK CHALLENGE**

1. ⭐ EASY: Add filter buttons (All / Done / Pending)
2. ⭐⭐ MEDIUM: Add task count summary in every pattern
3. ⭐⭐⭐ HARD: Add API fetch for tasks and handle loading/error with useEffect
