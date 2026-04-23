const toDolist2 = JSON.parse(localStorage.getItem("tasks")) || [];
let editingIndex = null;
let showmePending;
let thePending;
renderTodolist();
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(toDolist2));
}
function renderTodolist() {
  let todohtml = "";
  let filteredList = toDolist2;

  if (showmePending === "pending") {
    filteredList = toDolist2.filter((todo) => todo.status === "pending");
  } else if (showmePending === "completed") {
    filteredList = toDolist2.filter((todo) => todo.status === "completed");
  }
  filteredList.forEach((todo, index) => {
    const name2 = todo.name;
    const element = todo.cate;
    const isCompleted = todo.status === "completed";
    const buttonClass = isCompleted ? "marked-btn" : "mark-btn";
    const checkMark = isCompleted ? "✔" : "";
    if (editingIndex === index) {
      todohtml += `
      <div class="edit-panel">
        <div><button class="mark-btn"></button></div>
        <div><input class="edit-name" value="${todo.name}"></div>


          <div>
      <select class="edit-cate">
        <option value="no-category" ${todo.cate === "no-category" ? "selected" : ""}>no category</option>
        <option value="Personal" ${todo.cate === "Personal" ? "selected" : ""}>Personal</option>
        <option value="Work" ${todo.cate === "Work" ? "selected" : ""}>Work</option>
        <option value="Study" ${todo.cate === "Study" ? "selected" : ""}>Study</option>
        <option value="Tech" ${todo.cate === "Tech" ? "selected" : ""}>Tech</option>
        <option value="Shopping" ${todo.cate === "Shopping" ? "selected" : ""}>Shopping</option>
      </select>
    </div>
    <div>
        <button class="save-button">Save</button>
         </div>
         <div>
        <button class="red-button">Delete</button>
         </div>
        </div>
      `;
    } else {
      todohtml += `
       <div class ="task-content">
      <div>
  <button class="${todo.status === "completed" ? "marked-btn" : "mark-btn"}">
    ${todo.status === "completed" ? "✔" : ""}
  </button>
</div>
        <div>${todo.name}</div>
        <div>${todo.cate}</div>
        <div><button class="edit-button">Edit</button></div>
       <div> <button class="red-button">Delete</button></div>
       </div>
      `;
    }
  });

  document.querySelector(".task").innerHTML = todohtml;
  document.querySelectorAll(".red-button").forEach((deletebutton, index) => {
    deletebutton.addEventListener("click", () => {
      const todoToDelete = filteredList[index];
      const realIndex = toDolist2.indexOf(todoToDelete);
      toDolist2.splice(realIndex, 1);
      saveTasks();
      renderTodolist();
    });
  });
  document.querySelectorAll(".edit-button").forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const todoEdit = filteredList[index];
      const realIndex = toDolist2.indexOf(todoEdit);
      editingIndex = index;
      console.log("clicked edit", index);
      renderTodolist();
    });
  });
  document.querySelectorAll(".save-button").forEach((save) => {
    save.addEventListener("click", () => {
      const newName = document.querySelector(".edit-name").value;
      const newCate = document.querySelector(".edit-cate").value;

      toDolist2[editingIndex].name = newName;
      toDolist2[editingIndex].cate = newCate;
      saveTasks();

      editingIndex = null;
      renderTodolist();
    });
  });
 document.querySelectorAll(".mark-btn, .marked-btn").forEach((btn, index) => {
  btn.addEventListener("click", () => {
    const todo = filteredList[index];

    
    if (todo.status === "pending") {
      todo.status = "completed";
    } else {
      todo.status = "pending";
    }
    saveTasks();

    
    renderTodolist();
  });
});
  const totalTasks = toDolist2.length;
  const completedTasks = toDolist2.filter(
    (todo) => todo.status === "completed",
  ).length;
  const progressPercent =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  document.getElementById("on-top").style.width = progressPercent + "%";
}

document.querySelector(".add-button").addEventListener("click", () => {
  addList2();
});

function addList2() {
  const inputElement = document.getElementById("todoElement2");
  const name = inputElement.value;

  const categoryInputElement = document.getElementById("category");
  const cate = categoryInputElement.value;

  toDolist2.push({
    name,
    cate,
    status: "pending",
  });
  saveTasks();

  inputElement.value = "";

  renderTodolist();
}
let change = document.querySelector(".add-button");

document.querySelector(".filter-btn").addEventListener("click", () => {
  showmePending = "all";
  renderTodolist();
});

document.querySelector(".Pending-btn").addEventListener("click", () => {
  showmePending = "pending";
  renderTodolist();
});

document.querySelector(".Completed-btn").addEventListener("click", () => {
  showmePending = "completed";
  renderTodolist();
});
const filterButtons = document.querySelectorAll(".filter button");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {

    
    filterButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    if (button.id === "all") {
      showmePending = "all";
    } else if (button.id === "Pending") {
      showmePending = "pending";
    } else if (button.id === "Completed") {
      showmePending = "completed";
    }

    renderTodolist();
  });
});
let darkmode = localStorage.getItem('darkmode')
const themeSwitch = document.getElementById('theme-switch')

const enableDarkmode = () => {
  document.body.classList.add('darkmode')
  localStorage.setItem('darkmode', 'active')
}

const disableDarkmode = () => {
  document.body.classList.remove('darkmode')
  localStorage.setItem('darkmode', null)
}

if(darkmode === "active") enableDarkmode()

themeSwitch.addEventListener("click", () => {
  darkmode = localStorage.getItem('darkmode')
  darkmode !== "active" ? enableDarkmode() : disableDarkmode()
})