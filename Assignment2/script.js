let events = [];
let editingIndex = -1;

const eventForm = document.getElementById('eventForm');
const eventTableBody = document.getElementById('eventTableBody');
const eventNameInput = document.getElementById('eventName');
const eventDescriptionInput = document.getElementById('eventDescription');
const eventDateTimeInput = document.getElementById('eventDateTime');

// Nav buttons
const navHome = document.getElementById('nav-home');
const navAbout = document.getElementById('nav-about');
const navContact = document.getElementById('nav-contact');

// Page sections
const pages = {
    home: document.getElementById('home-page'),
    about: document.getElementById('about-page'),
    contacts: document.getElementById('contact-page')
};

function showPage(pageKey) {
    Object.values(pages).forEach(p => p.hidden = true);
    pages[pageKey].hidden = false;
}

document.addEventListener('DOMContentLoaded', function () {
    loadEventsFromStorage();
    displayEvents();
    showPage('home'); 
});

// Navigation event listeners
navHome.addEventListener('click', (e) => {
    e.preventDefault();
    showPage('home');
});
navAbout.addEventListener('click', (e) => {
    e.preventDefault();
    showPage('about');
});
navContact.addEventListener('click', (e) => {
    e.preventDefault();
    showPage('contacts');
});

// Form submit handler
eventForm.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateForm()) return;

    const eventData = {
        name: eventNameInput.value.trim(),
        description: eventDescriptionInput.value.trim(),
        dateTime: eventDateTimeInput.value
    };

    if (editingIndex === -1) {
        addEvent(eventData);
    } else {
        updateEvent(editingIndex, eventData);
        editingIndex = -1;
    }

    resetForm();
    displayEvents();
    saveEventsToStorage();
});

function validateForm() {
    const name = eventNameInput.value.trim();
    const description = eventDescriptionInput.value.trim();
    const dateTime = eventDateTimeInput.value;

    if (!name || !description || !dateTime) {
        alert('Please fill in all fields');
        return false;
    }
    return true;
}

function addEvent(eventData) {
    events.push(eventData);
}

function updateEvent(index, eventData) {
    events[index] = eventData;
}

function deleteEvent(index) {
    if (confirm('Are you sure you want to delete this event?')) {
        events.splice(index, 1);
        displayEvents();
        saveEventsToStorage();
    }
}

function editEvent(index) {
    const event = events[index];
    eventNameInput.value = event.name;
    eventDescriptionInput.value = event.description;
    eventDateTimeInput.value = event.dateTime;
    editingIndex = index;

    eventForm.scrollIntoView({ behavior: 'smooth' });
}

function displayEvents() {
    eventTableBody.innerHTML = '';

    if (events.length === 0) {
        eventTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #666;">No events added yet</td></tr>';
        return;
    }

    events.forEach((event, index) => {
        const row = document.createElement('tr');

        const dateTime = new Date(event.dateTime);
        const formattedDateTime = dateTime.toLocaleString();

        row.innerHTML = `
            <td>${event.name}</td>
            <td>${event.description}</td>
            <td>${formattedDateTime}</td>
            <td>
                <button class="edit-btn" onclick="editEvent(${index})">
                    <i class="fas fa-pen-to-square" style="color: #f39c12;"></i>
                </button>
                <button class="delete-btn" onclick="deleteEvent(${index})">
                    <i class="fas fa-trash" style="color: #e74c3c;"></i>
                </button>
            </td>
        `;

        eventTableBody.appendChild(row);
    });
}

function resetForm() {
    eventForm.reset();
    editingIndex = -1;
}

function saveEventsToStorage() {
    localStorage.setItem('events', JSON.stringify(events));
}

function loadEventsFromStorage() {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
        events = JSON.parse(storedEvents);
    }
}
