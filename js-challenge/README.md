Description

Task Manager Web Site is a web application that allows users to create, edit, delete, and track tasks in different categories. It also includes a progress bar and a dark mode to enhance user experience.

The project is built with HTML, CSS, and JavaScript, without external frameworks, and uses localStorage to save tasks locally.

Screenshots
### Light Mode

![Light Mode Screenshot](img/Screenshot%202026-02-21%20024738.png)

### Dark Mode

![Dark Mode Screenshot](img/Screenshot%202026-02-21%20024643.png)

Replace path-to-your-light-mode-image.png and path-to-your-dark-mode-image.png with the actual paths to your screenshots.

Features

Add a Task

Enter a task name and select a category.

Click the Add button to add it to the list.

Edit a Task

Click Edit to modify the task name or category.

Click Save to save changes.

Delete a Task

Click Delete to remove a task from the list.

Mark Task as Completed

Click the ✔ button to mark a task as "completed".

Click again to return it to "pending".

Filter Tasks

Use the All, Pending, and Completed buttons to filter tasks by status.

Progress Bar

Shows the percentage of tasks completed compared to the total.

Dark Mode

Toggle between light and dark themes using the button at the top right.

The dark mode state is saved in localStorage.

Responsive Design

The interface is centered and adapts to different screen sizes.

Project Structure
/project-root
│
├─ index.html         # Main HTML structure
├─ style.css          # Styles and theme (light/dark)
├─ script.js          # JavaScript logic for tasks and interactions
├─ img/               # Icons for light/dark mode
│   ├─ dark_mode_24dp.svg
│   └─ light_mode_24dp.svg
└─ README.md          # Project documentation
HTML

Main structure:

#main-panel contains all main content.

#header for the title and separator line.

#control contains the add form and filter buttons.

#tasks displays the task list.

#progress displays the progress bar.

Input and select:

<input> for task name.

<select> to choose task category.

Buttons

Add, Edit, Save, Delete, Mark, and filters (All, Pending, Completed).

CSS

CSS variables (:root) for easy theme management (light/dark).

Grid layout used to align tasks and edit panel.

Buttons and input fields styled with border-radius, box-shadow, and dynamic colors.

Dark mode toggled with .darkmode class on body.

Progress bar with #background and #on-top to visualize task completion.

JavaScript

Tasks array: toDolist2 stored in localStorage.

Main functions:

saveTasks() – Saves tasks to localStorage.

renderTodolist() – Renders tasks based on the selected filter.

addList2() – Adds a new task.

Task editing:

editingIndex is used to track the task being edited.

Update task name and category in real-time.

Marking tasks:

Toggle between "pending" and "completed".

Automatically updates the progress bar.

Filtering:

Handles All, Pending, and Completed buttons.

Active filter highlighted with active class.

Dark mode:

State saved in localStorage.

Toggles .darkmode class on body.

Event listeners:

click events for adding, editing, saving, deleting, marking, and filtering tasks.

Dynamic DOM updates for instant feedback.
