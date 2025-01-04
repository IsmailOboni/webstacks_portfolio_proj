/* jshint esversion: 6 */

// Tab Navigation
const tabs = document.querySelectorAll('.tab'); // Select all tab buttons
const tabContents = document.querySelectorAll('.tab-content'); // Select all tab sections

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        tabs.forEach(t => t.classList.remove('active'));
        // Add active class to the clicked tab
        tab.classList.add('active');

        // Hide all tab contents
        tabContents.forEach(content => content.classList.add('hidden'));
        // Show the clicked tab's content
        const target = tab.getAttribute('data-tab');
        document.getElementById(target).classList.remove('hidden');
    });
});

// Notebook Functionality
const saveNoteButton = document.getElementById('saveNote');
const noteArea = document.getElementById('noteArea');
const notesList = document.getElementById('notesList');
const searchNotes = document.getElementById('searchNotes');
const noteCategory = document.getElementById('noteCategory');

// Load and Filter Notes
function loadNotes() {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    notesList.innerHTML = ''; // Clear the list
    savedNotes.forEach(note => addNoteToDOM(note));
}

// Add a Note to the DOM
function addNoteToDOM(note) {
    const listItem = document.createElement('li');
    listItem.textContent = `${note.text} [${note.category}]`;
    listItem.dataset.category = note.category;

    // Add a delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.style.marginLeft = '10px';
    deleteButton.addEventListener('click', () => {
        deleteNoteFromStorage(note);
        loadNotes();
    });

    listItem.appendChild(deleteButton);
    notesList.appendChild(listItem);
}

// Save a Note
function saveNoteToStorage(note) {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    savedNotes.push(note);
    localStorage.setItem('notes', JSON.stringify(savedNotes));
}

// Delete a Note from Storage
function deleteNoteFromStorage(note) {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    const updatedNotes = savedNotes.filter(savedNote => savedNote.text !== note.text);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
}

// Save Button Logic
saveNoteButton.addEventListener('click', () => {
    const noteText = noteArea.value.trim();
    const category = noteCategory.value;
    if (noteText) {
        const note = { text: noteText, category };
        saveNoteToStorage(note);
        loadNotes();
        noteArea.value = '';
    } else {
        alert('Please write something before saving!');
    }
});

// Filter Notes by Search
searchNotes.addEventListener('input', (e) => {
    const filter = e.target.value.toLowerCase();
    const notes = notesList.querySelectorAll('li');
    notes.forEach(note => {
        if (note.textContent.toLowerCase().includes(filter)) {
            note.style.display = '';
        } else {
            note.style.display = 'none';
        }
    });
});

// Load Notes on Page Load
loadNotes();

// To-Do List Functionality
const addTaskButton = document.getElementById('addTask');
const taskInput = document.getElementById('taskInput');
const taskDate = document.getElementById('taskDate');
const taskPriority = document.getElementById('taskPriority');
const taskList = document.getElementById('taskList');

// Add Task to the List
function addTaskToDOM(task) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        ${task.text} - <strong>${task.date || 'No Date'}</strong> [${task.priority}]
    `;
    listItem.style.color = getColorByPriority(task.priority);

    // Add a delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.style.marginLeft = '10px';
    deleteButton.addEventListener('click', () => {
        deleteTaskFromStorage(task);
        loadTasks();
    });

    listItem.appendChild(deleteButton);
    taskList.appendChild(listItem);
}

// Save a Task to Storage
function saveTaskToStorage(task) {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(savedTasks));
}

// Delete a Task from Storage
function deleteTaskFromStorage(task) {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = savedTasks.filter(savedTask => savedTask.text !== task.text);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

// Load Tasks from Storage
function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    taskList.innerHTML = ''; // Clear the list
    savedTasks.forEach(task => addTaskToDOM(task));
}

// Get Color by Priority
function getColorByPriority(priority) {
    if (priority === 'high') return 'red';
    if (priority === 'medium') return 'orange';
    return 'green';
}

// Add Button Logic
addTaskButton.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    const date = taskDate.value;
    const priority = taskPriority.value;
    if (taskText) {
        const task = { text: taskText, date, priority };
        saveTaskToStorage(task);
        loadTasks();
        taskInput.value = '';
        taskDate.value = '';
    } else {
        alert('Please enter a task before adding!');
    }
});

// Load Tasks on Page Load
loadTasks();

// Calculator Functionality
const calcInput = document.getElementById('calcInput');
const calcButtons = document.querySelectorAll('#calcButtons button');
const calcHistory = document.getElementById('calcHistory');

// Add Calculation to History
function addCalculationToHistory(expression, result) {
    const listItem = document.createElement('li');
    listItem.textContent = `${expression} = ${result}`;
    calcHistory.appendChild(listItem);
}

// Calculator Button Logic
calcButtons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;
        if (value === 'C') {
            calcInput.value = '';
        } else if (value === '=') {
            try {
                const result = eval(calcInput.value);
                addCalculationToHistory(calcInput.value, result);
                calcInput.value = result;
            } catch {
                alert('Invalid calculation!');
                calcInput.value = '';
            }
        } else if (value === '√') {
            calcInput.value = Math.sqrt(parseFloat(calcInput.value) || 0);
        } else if (value === '^') {
            calcInput.value += '**';
        } else if (['sin', 'cos', 'tan'].includes(value)) {
            calcInput.value = Math[value](parseFloat(calcInput.value) || 0).toFixed(2);
        } else {
            calcInput.value += value;
        }
    });
});