let tasks = [];

const navHome = document.getElementById('nav-home');
const navTasks = document.getElementById('nav-tasks');
const navProfile = document.getElementById('nav-profile');
const navReports = document.getElementById('nav-reports');

const pages = {
  home: document.getElementById('home-page'),
  tasks: document.getElementById('tasks-page'),
  profile: document.getElementById('profile-page'),
  reports: document.getElementById('reports-page')
};

const taskForm = document.getElementById('task-form');
const errorMessage = document.getElementById('error-message');

const taskList = document.getElementById('task-list');
const myTasksList = document.getElementById('my-tasks-list');

function showPage(pageKey) {
  Object.values(pages).forEach(p => p.hidden = true);
  pages[pageKey].hidden = false;
}

function createTaskElement(task, index) {
  const li = document.createElement('li');
  li.className = `task-card ${task.priority.toLowerCase()}`;
  if (task.completed) li.classList.add('completed');
  li.setAttribute('data-index', index);


  const deleteBtn = document.createElement('span');
  deleteBtn.className = 'delete-btn-cross';
  deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
  deleteBtn.addEventListener('click', () => deleteTask(index));

  li.appendChild(deleteBtn);


  const title = document.createElement('h3');
  title.className = 'task-title';
  title.textContent = task.title;
  li.appendChild(title);

  if (task.description) {
    const desc = document.createElement('p');
    desc.className = 'task-description';
    desc.textContent = task.description;
    li.appendChild(desc);
  }

  const footer = document.createElement('div');
  footer.className = 'task-actions';

  const dueDate = document.createElement('p');
  dueDate.className = 'task-due-date';
  dueDate.textContent = `Due: ${task.dueDate}`;
  footer.appendChild(dueDate);

  const label = document.createElement('label');
  label.setAttribute('for', `complete-${index}`);
  label.innerHTML = `Mark as done <input type="checkbox" id="complete-${index}" ${task.completed ? 'checked' : ''} aria-label="Mark task ${task.title} as completed">`;

  label.querySelector('input').addEventListener('change', () => {
    toggleTaskCompleted(index);
  });

  footer.appendChild(label);

  li.appendChild(footer);

  return li;
}

function renderTasks() {
  taskList.innerHTML = '';
  myTasksList.innerHTML = '';

  tasks.forEach((task, index) => {
    const taskEl1 = createTaskElement(task, index);
    const taskEl2 = createTaskElement(task, index);
    taskList.appendChild(taskEl1);
    myTasksList.appendChild(taskEl2);
  });
}

function toggleTaskCompleted(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

function validateForm(title, dueDate) {
  if (!title.trim()) {
    showError('Title is required.');
    return false;
  }
  if (!dueDate) {
    showError('Due date is required.');
    return false;
  }
  clearError();
  return true;
}

function showError(msg) {
  errorMessage.textContent = msg;
}

function clearError() {
  errorMessage.textContent = '';
}

navHome.addEventListener('click', (e) => { e.preventDefault(); showPage('home'); });
navTasks.addEventListener('click', (e) => { e.preventDefault(); showPage('tasks'); });
navProfile.addEventListener('click', (e) => { e.preventDefault(); showPage('profile'); });
navReports.addEventListener('click', (e) => { e.preventDefault(); showPage('reports'); });

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = taskForm.title.value;
  const description = taskForm.description.value;
  const dueDate = taskForm['due-date'].value;
  const priority = taskForm.priority.value;

  if (!validateForm(title, dueDate)) return;

  const newTask = {
    title: title.trim(),
    description: description.trim(),
    dueDate,
    priority,
    completed: false,
  };

  tasks.push(newTask);
  renderTasks();
  taskForm.reset();
});

function init() {
  renderTasks();
  showPage('home');
}

init();