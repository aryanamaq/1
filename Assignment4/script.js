document.addEventListener('DOMContentLoaded', function () {
  const chatWindow = document.getElementById('chat-window');
  const textarea = document.querySelector('.message-input-area textarea');
  const sendButton = document.querySelector('.message-input-area button');
  const chatTitle = document.getElementById('chat-title');
  const userButtons = document.querySelectorAll('#user-list button');

  let currentUser = null;

  // Mock chat storage
  const chats = {
    Alice: [
      { sender: 'Alice', text: 'Hi there!' },
      { sender: 'You', text: 'Hello Alice!' }
    ],
    Bob: [],
    Charlie: [],
    Diana: []
  };

  function renderChat(user) {
    chatWindow.innerHTML = '';
    chats[user].forEach(({ sender, text }) => addMessage(sender, text));
  }

  function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender === 'You' ? 'outgoing' : 'incoming');

    messageDiv.innerHTML = `
      <div class="message-bubble">
        <p class="text">${text}</p>
      </div>
    `;

    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  function sendMessage() {
    const message = textarea.value.trim();
    if (message !== '' && currentUser) {
      addMessage('You', message);
      chats[currentUser].push({ sender: 'You', text: message });
      textarea.value = '';
      textarea.focus();
    }
  }

  sendButton.addEventListener('click', sendMessage);

  textarea.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  userButtons.forEach(button => {
    button.addEventListener('click', () => {
      const user = button.dataset.user;
      currentUser = user;
      chatTitle.textContent = user;
      renderChat(user);
    });
  });
});
