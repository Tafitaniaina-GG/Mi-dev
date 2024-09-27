// Éléments HTML existants
const chatbox = document.getElementById('chatbox');
const inputBox = document.getElementById('inputBox');
const sendButton = document.getElementById('sendButton');
const darkModeToggle = document.getElementById('darkModeToggle');
const voiceButton = document.getElementById('voiceButton');

// Éléments HTML pour l'OCR
const imageInput = document.getElementById('image-input');
const imagePreview = document.getElementById('image-preview');
const extractTextButton = document.getElementById('extract-text-btn');
const textOutput = document.getElementById('text-output');
const loadingText = document.getElementById('loading');

// Ajout du bouton de suppression d'image
const deleteImageButton = document.createElement('button');
deleteImageButton.id = 'delete-image-btn';
deleteImageButton.textContent = 'X';
deleteImageButton.style.display = 'none'; // Le bouton est caché par défaut
document.body.appendChild(deleteImageButton); // Ajoute le bouton au DOM

// Variables
let isDarkMode = true;

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    updateDarkMode();
});

// Changement de mode sombre
darkModeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    updateDarkMode();
});

function updateDarkMode() {
    const body = document.body;
    const chatContainer = document.getElementById('chat-container');

    if (isDarkMode) {
        body.classList.add('dark-mode');
        chatContainer.classList.add('dark-mode');
        inputBox.classList.add('dark-mode');
        sendButton.classList.add('dark-mode');
        darkModeToggle.textContent = '🇲🇬';
    } else {
        body.classList.remove('dark-mode');
        chatContainer.classList.remove('dark-mode');
        inputBox.classList.remove('dark-mode');
        sendButton.classList.remove('dark-mode');
        darkModeToggle.textContent = '🇲🇬';
    }
}

// Ajout d'un message à la boîte de discussion
function addMessage(message, isUser = false) {
    const messageContainer = document.createElement('div');
    messageContainer.className = isUser ? 'user-message message' : 'bot-message message';

    // Texte du message
    const messageText = document.createElement('span');
    messageText.textContent = message;
    messageContainer.appendChild(messageText);

    // Ajouter le bouton "Écouter" pour les messages du bot
    if (!isUser) {
        const listenButton = document.createElement('button');
        listenButton.textContent = "Écouter";
        listenButton.className = 'listen-button';
        listenButton.onclick = () => textToSpeech(message);
        messageContainer.appendChild(listenButton);
    }

    chatbox.appendChild(messageContainer);
    chatbox.scrollTop = chatbox.scrollHeight;
}

// Fonction pour interroger l'API du chatbot
async function fetchAnswerFromAPI(question) {
    try {
        const proxyUrl = 'https://deku-rest-api.gleeze.com';
        const apiUrl = `${proxyUrl}/gpt4?prompt=${encodeURIComponent(question)}&uid=100`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        const answer = data.gpt4;
        addMessage(answer);
    } catch (error) {
        addMessage("Oops! Une erreur est survenue lors de la récupération de la réponse.");
    }
}

// Envoi d'un message
sendButton.addEventListener('click', () => {
    const userMessage = inputBox.value;
    if (userMessage.trim() !== '') {
        addMessage(userMessage, true);
        fetchAnswerFromAPI(userMessage);
        inputBox.value = '';
    }
});

inputBox.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        event.preventDefault();
        const userMessage = inputBox.value;
        if (userMessage.trim() !== '') {
            addMessage(userMessage, true);
            fetchAnswerFromAPI(userMessage);
            inputBox.value = '';
        }
    }
});

// Text-to-Speech
function textToSpeech(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    synth.speak(utterance);
}

// Speech-to-Text
voiceButton.addEventListener('click', () => {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Votre navigateur ne supporte pas la reconnaissance vocale.");
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        inputBox.value = transcript;
        addMessage(transcript, true);
        fetchAnswerFromAPI(transcript);
    };

    recognition.onerror = function(event) {
        alert("Une erreur est survenue lors de la reconnaissance vocale : " + event.error);
    };
});

// Affichage de l'image téléchargée
imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            imagePreview.src = reader.result;
            imagePreview.style.display = 'block';
            deleteImageButton.style.display = 'block'; // Affiche le bouton "X"
        };
        reader.readAsDataURL(file);
    }
});

// Suppression de l'image après clic sur le bouton "X"
deleteImageButton.addEventListener('click', () => {
    imagePreview.src = ''; // Vider la source de l'image
    imagePreview.style.display = 'none'; // Cacher l'aperçu de l'image
    deleteImageButton.style.display = 'none'; // Cacher le bouton "X"
    imageInput.value = ''; // Réinitialiser l'input fichier
});

// Extraction du texte de l'image
extractTextButton.addEventListener('click', () => {
    if (!imageInput.files.length) {
        alert('Veuillez sélectionner une image d\'abord.');
        return;
    }

    loadingText.style.display = 'block'; // Affiche le texte de chargement

    Tesseract.recognize(
        imageInput.files[0],
        'fra', // Langue française
        {
            logger: m => console.log(m)
        }
    ).then(({ data: { text } }) => {
        loadingText.style.display = 'none'; // Cache le texte de chargement
        textOutput.textContent = text; // Affiche le texte extrait
        addMessage(text, true); // Ajoute le texte extrait à la conversation
        fetchAnswerFromAPI(text); // Envoie le texte extrait au chatbot
    }).catch(err => {
        loadingText.style.display = 'none';
        alert('Erreur lors de l\'extraction du texte : ' + err);
    });
});
