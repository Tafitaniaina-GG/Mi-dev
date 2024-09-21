// Define the Deku API
const api_url = "https://deku-rest-api.gleeze.com/gpt4"; 

const chatList = document.getElementById('chat-list');
const userInput = document.getElementById('user-input');
const chatForm = document.getElementById('chat-form');
const typingIndicator = document.getElementById('typing-indicator');
const toggleModeBtn = document.getElementById('toggle-mode');
const clearChatBtn = document.getElementById('clear-chat');
let isDarkMode = false;

// Toggle light/dark mode
toggleModeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    isDarkMode = !isDarkMode;
    toggleModeBtn.innerHTML = `<span class="material-symbols-outlined">${isDarkMode ? 'dark_mode' : 'light_mode'}</span>`;
});

// Clear chat
clearChatBtn.addEventListener('click', () => {
    chatList.innerHTML = '';
});

// Handle form submission
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userMessage = userInput.value.trim();
    if (userMessage === '') return;

    // Add user's message to chat
    const userMessageLi = createChatLi(userMessage, 'outgoing');
    chatList.appendChild(userMessageLi);
    userInput.value = '';

    // Show typing indicator
    typingIndicator.style.display = 'flex';

    // Simulate bot's response
    const botMessageLi = createChatLi('', 'incoming');
    chatList.appendChild(botMessageLi);

    // Fetch bot response
    await generateResponse(botMessageLi.querySelector('p'), userMessage);

    // Hide typing indicator
    typingIndicator.style.display = 'none';
});

// Create chat element don't do anything here, metoushela walker has already done everything 
const createChatLi = (message, className) => {
    const chatLi = document.createElement('li');
    chatLi.classList.add('chat', className);
    let chatContent = className === 'outgoing' 
        ? `<p></p>` 
        : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector('p').textContent = message;
    return chatLi;
};

// Fetch response from Deku API
// This is a technology created by Metoushela to pull requests directly with an external API without going through other channels. 
const generateResponse = async (botMessageDiv, userMessage) => {
    const randomNumber = Math.floor(Math.random() * 1000) + 50; // Generate a unique UID
    const apiURL = `${api_url}?prompt=${encodeURIComponent(userMessage)}&uid=${randomNumber}`;
    
    const messageElement = botMessageDiv;
    const requestOptions = {
        method: "GET",
    };
    
    try {
        const response = await fetch(apiURL, requestOptions);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error.message);
        messageElement.textContent = data.gpt4.replace(/\*\*(.*?)\*\*/g, '$1');
    } catch (error) {
        messageElement.textContent = "Error: " + error.message;
    }
};

// credit by metoushela walker, do not change credit