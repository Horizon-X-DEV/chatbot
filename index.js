
const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const buttonIcon = document.getElementById('button-icon');
const info = document.querySelector('.info');
const chatContainer = document.querySelector('.chat-container');

const API_URL = 'https://chatbot-api-gatha.akunalt2727.workers.dev';

let isLoading = false;

sendButton.addEventListener('click', sendMessage);

userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});

async function sendMessage() {
    const message = userInput.value.trim();

    if (!message || isLoading) return;

    appendMessage('user', message);
    userInput.value = '';

    isLoading = true;
    setLoading(true);

    const loadingMessage = appendTyping();

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

        const rawResponse = await response.text();

        let result;

        try {
            result = JSON.parse(rawResponse);
        } catch {
            throw new Error('Respons bukan JSON: ' + rawResponse);
        }

        if (!response.ok) {
            throw new Error(
                result.error || rawResponse || `HTTP Error: ${response.status}`
            );
        }

        const botMessage = result.result;

        if (typeof botMessage === 'string' && botMessage.trim() !== '') {
            removeTyping(loadingMessage);
            appendMessage('bot', botMessage);
        } else {
            throw new Error('Format jawaban API tidak sesuai');
        }

    } catch (error) {
        console.error('Chatbot Error:', error);

        removeTyping(loadingMessage);

        appendMessage(
            'bot',
            'Maaf, terjadi kesalahan: ' + error.message
        );

    } finally {
        isLoading = false;
        setLoading(false);
        userInput.focus();
    }
}

/* LOADING BUTTON */

function setLoading(loading) {
    sendButton.disabled = loading;

    if (loading) {
        buttonIcon.className = 'fas fa-spinner fa-spin';
    } else {
        buttonIcon.className = 'fa-solid fa-paper-plane';
    }
}

/* APPEND MESSAGE */

function appendMessage(sender, message) {
    info.style.display = 'none';

    const chatElement = document.createElement('div');
    const iconElement = document.createElement('div');
    const messageElement = document.createElement('div');
    const icon = document.createElement('i');

    chatElement.className = 'chat-box';
    iconElement.className = 'icon';
    messageElement.className = sender;

    messageElement.textContent = message;

    if (sender === 'user') {
        icon.className = 'fa-regular fa-user';
        iconElement.id = 'user-icon';
    } else {
        icon.className = 'fa-solid fa-robot';
        iconElement.id = 'bot-icon';
    }

    iconElement.appendChild(icon);
    chatElement.appendChild(iconElement);
    chatElement.appendChild(messageElement);

    chatLog.appendChild(chatElement);

    scrollToBottom();

    return chatElement;
}

/* TYPING ANIMATION */

function appendTyping() {
    info.style.display = 'none';

    const chatElement = document.createElement('div');
    const iconElement = document.createElement('div');
    const typingElement = document.createElement('div');
    const icon = document.createElement('i');

    chatElement.className = 'chat-box';

    iconElement.className = 'icon';
    iconElement.id = 'bot-icon';

    icon.className = 'fa-solid fa-robot';

    typingElement.className = 'bot typing-indicator';

    typingElement.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;

    iconElement.appendChild(icon);
    chatElement.appendChild(iconElement);
    chatElement.appendChild(typingElement);

    chatLog.appendChild(chatElement);

    scrollToBottom();

    return chatElement;
}

/* REMOVE TYPING */

function removeTyping(element) {
    if (element && element.parentNode) {
        element.remove();
    }
}

/* AUTO SCROLL */

function scrollToBottom() {
    requestAnimationFrame(() => {
        chatContainer.scrollTo({
            top: chatContainer.scrollHeight,
            behavior: 'smooth'
        });
    });
}
