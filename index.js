const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const buttonIcon = document.getElementById('button-icon');
const info = document.querySelector('.info');

const API_URL = 'https://chatbot-api-gatha.akunalt2727.workers.dev';

let isLoading = false;

sendButton.addEventListener('click', sendMessage);

userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const message = userInput.value.trim();

    if (message === '' || isLoading) return;

    if (message === 'developer') {
        userInput.value = '';
        appendMessage('user', message);
        appendMessage(
            'bot',
            'This Source Coded By Reza Mehdikhanlou\nYoutube : @AsmrProg'
        );
        return;
    }

    appendMessage('user', message);
    userInput.value = '';

    isLoading = true;
    setLoading(true);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'user',
                        content: message
                    }
                ]
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.error || `HTTP Error: ${response.status}`
            );
        }

        // Mengambil jawaban dari format respons RapidAPI
        const botMessage = result.result;

        if (!botMessage) {
            throw new Error(
                'API tidak memberikan jawaban. Periksa respons API.'
            );
        }

        appendMessage('bot', botMessage);

    } catch (error) {
        console.error('Chatbot Error:', error);

        appendMessage(
            'bot',
            'Maaf, terjadi kesalahan: ' + error.message
        );

    } finally {
        isLoading = false;
        setLoading(false);
    }
}

function setLoading(loading) {
    if (loading) {
        buttonIcon.classList.remove('fa-solid', 'fa-paper-plane');
        buttonIcon.classList.add('fas', 'fa-spinner', 'fa-pulse');
    } else {
        buttonIcon.classList.add('fa-solid', 'fa-paper-plane');
        buttonIcon.classList.remove('fas', 'fa-spinner', 'fa-pulse');
    }
}

function appendMessage(sender, message) {
    info.style.display = 'none';

    const messageElement = document.createElement('div');
    const iconElement = document.createElement('div');
    const chatElement = document.createElement('div');
    const icon = document.createElement('i');

    chatElement.classList.add('chat-box');
    iconElement.classList.add('icon');
    messageElement.classList.add(sender);

    messageElement.innerText = message;

    if (sender === 'user') {
        icon.classList.add('fa-regular', 'fa-user');
        iconElement.setAttribute('id', 'user-icon');
    } else {
        icon.classList.add('fa-solid', 'fa-robot');
        iconElement.setAttribute('id', 'bot-icon');
    }

    iconElement.appendChild(icon);
    chatElement.appendChild(iconElement);
    chatElement.appendChild(messageElement);

    chatLog.appendChild(chatElement);
    chatLog.scrollTop = chatLog.scrollHeight;
}
