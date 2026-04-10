// ========== ДОСТУПНЫЕ ПЕРЕМЕННЫЕ (из HTML) ==========
const formElement = document.querySelector('#to-do__form');
const inputElement = document.querySelector('#to-do__form-input');
const listElement = document.querySelector('#to-do__list');
const template = document.querySelector('#to-do__item-template');

// ========== ПРЕДУСТАНОВЛЕННЫЕ ЗАДАЧИ ==========
const defaultTasks = [
  'Покормить кота',
  'Сделать домашнее задание',
  'Позвонить маме',
  'Купить продукты',
  'Выучить JavaScript',
  'Сходить в спортзал'
];

// ========== ФУНКЦИЯ ЗАГРУЗКИ ЗАДАЧ ИЗ LOCALSTORAGE ==========
function loadTasks() {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    return JSON.parse(savedTasks);
  }
  return [...defaultTasks];
}

// ========== ФУНКЦИЯ СОХРАНЕНИЯ ЗАДАЧ В LOCALSTORAGE ==========
function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ========== ФУНКЦИЯ СБОРА ЗАДАЧ ИЗ DOM ==========
function getTasksFromDOM() {
  const itemsNamesElements = document.querySelectorAll('.to-do__item-text');
  const tasks = [];
  itemsNamesElements.forEach(element => {
    tasks.push(element.textContent);
  });
  return tasks;
}

// ========== ФУНКЦИЯ СОЗДАНИЯ ЭЛЕМЕНТА ЗАДАЧИ ==========
function createItem(itemText) {
  const clone = template.content.cloneNode(true);
  const textElement = clone.querySelector('.to-do__item-text');
  const deleteButton = clone.querySelector('.to-do__item-button_type_delete');
  const duplicateButton = clone.querySelector('.to-do__item-button_type_duplicate');
  const editButton = clone.querySelector('.to-do__item-button_type_edit');

  textElement.textContent = itemText;

  // Удаление задачи
  deleteButton.addEventListener('click', () => {
    const liElement = deleteButton.closest('.to-do__item');
    liElement.remove();
    const items = getTasksFromDOM();
    saveTasks(items);
  });

  // Копирование задачи
  duplicateButton.addEventListener('click', () => {
    const itemName = textElement.textContent;
    const newItem = createItem(itemName);
    listElement.prepend(newItem);
    const items = getTasksFromDOM();
    saveTasks(items);
  });

  // Редактирование задачи
  editButton.addEventListener('click', () => {
    textElement.setAttribute('contenteditable', 'true');
    textElement.focus();
  });

  textElement.addEventListener('blur', () => {
    textElement.setAttribute('contenteditable', 'false');
    const items = getTasksFromDOM();
    saveTasks(items);
  });

  return clone;
}

// ========== ОБРАБОТЧИК ФОРМЫ ==========
formElement.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const taskText = inputElement.value.trim();
  if (taskText === '') return;
  
  const newTask = createItem(taskText);
  listElement.prepend(newTask);
  
  inputElement.value = '';
  
  const items = getTasksFromDOM();
  saveTasks(items);
});

// ========== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ==========
let items = loadTasks();

items.forEach(item => {
  const taskElement = createItem(item);
  listElement.append(taskElement);
});
