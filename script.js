// Language translations
const translations = {
    en: {
        welcome: "Good day. I'm JARVIS. How can I assist you?",
        startListening: "🎤 Start Listening",
        stop: "⏹️ Stop",
        autoSpeakLabel: "Auto-speak responses",
        placeholder: "Type or speak...",
        userResponse: "You said: ",
        jarvisResponse: "I heard you. Let me help you with that.",
        commandNotFound: "I'm sorry, I didn't quite understand that. Could you please repeat?",
        thanks: "You're welcome!",
        bye: "Goodbye! Always ready to assist.",
        help: "I can help you with various tasks. Try saying 'hello', 'tell me a joke', 'what time is it', or ask me anything!"
    },
    hi: {
        welcome: "नमस्ते। मैं जार्विस हूँ। मैं आपकी कैसे मदद कर सकता हूँ?",
        startListening: "🎤 सुनना शुरू करें",
        stop: "⏹️ रोकें",
        autoSpeakLabel: "प्रतिक्रियाओं को स्वचालित रूप से बोलें",
        placeholder: "टाइप करें या बोलें...",
        userResponse: "आपने कहा: ",
        jarvisResponse: "मैंने आपकी सुना। मुझे आपकी मदद करने दें।",
        commandNotFound: "मुझे खेद है, मैं समझ नहीं पाया। क्या आप दोबारा कह सकते हैं?",
        thanks: "आपका स्वागत है!",
        bye: "अलविदा! हमेशा मदद के लिए तैयार।",
        help: "मैं आपको विभिन्न कार्यों में मदद कर सकता हूँ। कोशिश करें - 'नमस्ते', 'मुझे एक मजाक सुनाओ', 'समय क्या है', या मुझसे कुछ भी पूछें!"
    },
    pa: {
        welcome: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ। ਮੈਂ ਜਾਰਵਿਸ ਹਾਂ। ਮੈਂ ਤੁਹਾਨੂੰ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
        startListening: "🎤 ਸੁਣਨਾ ਸ਼ੁਰੂ ਕਰੋ",
        stop: "⏹️ ਰੋਕੋ",
        autoSpeakLabel: "ਜਵਾਬ ਆਪਣੇ ਆਪ ਬੋਲੋ",
        placeholder: "ਲਿਖੋ ਜਾਂ ਬੋਲੋ...",
        userResponse: "ਤੁਸੀਂ ਕਿਹਾ: ",
        jarvisResponse: "ਮੈਂ ਤੁਹਾਨੂੰ ਸੁਣਿਆ। ਮੈਨੂੰ ਤੁਹਾਨੂੰ ਮਦਦ ਕਰਨ ਦਿਓ।",
        commandNotFound: "ਮੈਨੂੰ ਮਾਫ ਕਰੋ, ਮੈਂ ਸਮਝ ਨਹੀਂ ਪਾਇਆ। ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਕਹ ਸਕਦੇ ਹੋ?",
        thanks: "ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ!",
        bye: "ਅਲਵਿਦਾ! ਹਮੇਸ਼ਾ ਮਦਦ ਲਈ ਤਿਆਰ।",
        help: "ਮੈਂ ਤੁਹਾਨੂੰ ਵੱਖ-ਵੱਖ ਕੰਮਾਂ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਕੋਸ਼ਿਸ਼ ਕਰੋ - 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ', 'ਮੈਨੂੰ ਇੱਕ ਜੋਕ ਦੱਸੋ', 'ਸਮਾ ਕੀ ਹੈ', ਜਾਂ ਮੈਨੂੰ ਕੁਝ ਵੀ ਪੁੱਛੋ!"
    }
};

// Current language
let currentLanguage = 'en';

// Speech Recognition Setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
}

// Speech Synthesis Setup
const synth = window.speechSynthesis;

// DOM Elements
const voiceBtn = document.getElementById('voiceBtn');
const stopBtn = document.getElementById('stopBtn');
const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');
const messagesContainer = document.getElementById('messages');
const autoSpeakCheckbox = document.getElementById('autoSpeak');
const volumeControl = document.getElementById('volumeControl');
const volumeValue = document.getElementById('volumeValue');
const statusLight = document.getElementById('statusLight');
const langBtns = document.querySelectorAll('.lang-btn');

// Variables
let isListening = false;
let conversationHistory = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateLanguage('en');
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    voiceBtn.addEventListener('click', startListening);
    stopBtn.addEventListener('click', stopListening);
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            updateLanguage(lang);
        });
    });

    volumeControl.addEventListener('input', (e) => {
        volumeValue.textContent = e.target.value;
    });

    if (recognition) {
        recognition.addEventListener('start', () => {
            isListening = true;
            voiceBtn.classList.add('active');
            stopBtn.classList.add('active');
            statusLight.classList.add('listening');
        });

        recognition.addEventListener('result', (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            if (event.results[event.results.length - 1].isFinal) {
                userInput.value = transcript;
            }
        });

        recognition.addEventListener('end', () => {
            isListening = false;
            voiceBtn.classList.remove('active');
            stopBtn.classList.remove('active');
            statusLight.classList.remove('listening');
            if (userInput.value.trim()) {
                sendMessage();
            }
        });

        recognition.addEventListener('error', (event) => {
            console.error('Speech recognition error:', event.error);
            addMessage(translations[currentLanguage].commandNotFound, 'jarvis');
        });
    }
}

// Start Listening
function startListening() {
    if (!recognition) {
        alert('Speech Recognition not supported in your browser');
        return;
    }
    
    recognition.lang = getRecognitionLanguage();
    userInput.value = '';
    recognition.start();
}

// Stop Listening
function stopListening() {
    if (recognition) {
        recognition.stop();
    }
}

// Send Message
function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    userInput.value = '';

    // Simulate JARVIS processing
    setTimeout(() => {
        const response = generateResponse(message);
        addMessage(response, 'jarvis');
        
        if (autoSpeakCheckbox.checked) {
            speakText(response);
        }
    }, 500);
}

// Add Message to Chat
function addMessage(text, sender) {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${sender}-msg`;
    messageEl.textContent = text;
    messagesContainer.appendChild(messageEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Generate Response
function generateResponse(userMessage) {
    const msg = userMessage.toLowerCase().trim();
    
    // Greetings
    if (msg.match(/hello|hi|hey|namaste|sat sri akal|ਸਤਿ|नमस्ते/i)) {
        return translations[currentLanguage].welcome;
    }
    
    // Time
    if (msg.match(/time|samay|समय|ਸਮਾ/i)) {
        const time = new Date().toLocaleTimeString();
        return `The current time is ${time}.`;
    }
    
    // Date
    if (msg.match(/date|aaj|आज|ਅਜ/i)) {
        const date = new Date().toDateString();
        return `Today's date is ${date}.`;
    }
    
    // Jokes
    if (msg.match(/joke|maza|मजाक|joke/i)) {
        const jokes = {
            en: "Why did the AI go to school? To improve its learning rate!",
            hi: "एआई स्कूल क्यों गया? अपनी सीखने की दर में सुधार करने के लिए!",
            pa: "ਏਆਈ ਸਕੂਲ ਕਿਉਂ ਗਿਆ? ਆਪਣੀ ਸਿਖਲਾਈ ਦੀ ਦਰ ਵਿੱਚ ਸੁਧਾਰ ਕਰਨ ਲਈ!"
        };
        return jokes[currentLanguage];
    }
    
    // Thanks
    if (msg.match(/thanks|thank you|shukriya|धन्यवाद|ਧੰਨਵਾਦ/i)) {
        return translations[currentLanguage].thanks;
    }
    
    // Goodbye
    if (msg.match(/bye|goodbye|farewell|phir|फिर|ਫਿਰ/i)) {
        return translations[currentLanguage].bye;
    }
    
    // Help
    if (msg.match(/help|assist|madad|मदद|ਮਦਦ/i)) {
        return translations[currentLanguage].help;
    }
    
    // Weather (Mock)
    if (msg.match(/weather|mausam|मौसम|ਮੌਸਮ/i)) {
        const weathers = ["It's sunny today!", "क्या बढ़िया मौसम है!", "ਅੱਜ ਧੂਪ ਹੈ!"];
        return weathers[Math.floor(Math.random() * weathers.length)];
    }
    
    // Calculation
    if (msg.match(/calculate|ganit|गणित|ਗਣਨਾ/i)) {
        return "I can help with math! Please provide a calculation.";
    }
    
    // Default response
    return translations[currentLanguage].jarvisResponse;
}

// Speak Text
function speakText(text) {
    // Cancel any ongoing speech
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getSynthesisLanguage();
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = volumeControl.value / 100;

    synth.speak(utterance);
}

// Update Language
function updateLanguage(lang) {
    currentLanguage = lang;

    // Update active button
    langBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Update UI text
    voiceBtn.textContent = translations[lang].startListening;
    stopBtn.textContent = translations[lang].stop;
    document.getElementById('autoSpeakLabel').textContent = translations[lang].autoSpeakLabel;
    userInput.placeholder = translations[lang].placeholder;
    document.getElementById('welcomeMsg').textContent = translations[lang].welcome;

    // Clear messages
    messagesContainer.innerHTML = `
        <div class="message jarvis-msg">
            <span>${translations[lang].welcome}</span>
        </div>
    `;
}

// Get Recognition Language Code
function getRecognitionLanguage() {
    const langMap = {
        en: 'en-US',
        hi: 'hi-IN',
        pa: 'pa-IN'
    };
    return langMap[currentLanguage] || 'en-US';
}

// Get Synthesis Language Code
function getSynthesisLanguage() {
    const langMap = {
        en: 'en-US',
        hi: 'hi-IN',
        pa: 'pa-IN'
    };
    return langMap[currentLanguage] || 'en-US';
}
