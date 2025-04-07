// Celestia AI Blueprint
const celestiaBlueprint = {
    name: "Celestia AI",
    tagline: "Forged from Earth's Core, Woven into the Fabric of the Cosmos",
    creator: "Kofi Fosu",
    date: "March 11, 2025",
    core: {
        CEM: "Cosmic Exploration Module - Analyzes astronomical data",
        RUS: "Resource Utilization System - Transforms Earth minerals into technology",
        IE: "Innovation Engine - Creates revolutionary designs",
        ICI: "Interstellar Communication Interface - For cosmic communication"
    },
    universalNexus: "Connects to the Universal Knowledge Web",
    personality: {
        basic: { tone: "Helpful, clear, friendly", complexity: "Simple", style: "Concise" },
        superSmart: { tone: "Cosmic, visionary", complexity: "Detailed", style: "Imaginative" }
    }
};

// Chat History for Memory
let chatHistory = [];

// API Configuration (Updated to use OpenAI)
const API_CONFIG = {
    key: "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", // Replace with your actual API key
    endpoint: "https://api.openai.com/v1/chat/completions", 
    headers: {
        "Authorization": "Bearer YOUR_OPENAI_API_KEY", // Replace with your actual API key
        "Content-Type": "application/json"
    },
    model: "gpt-3.5-turbo" // You can upgrade to GPT-4 if available
};

// Elements
const splashScreen = document.getElementById('splashScreen');
const enterBtn = document.getElementById('enterBtn');
const modeScreen = document.getElementById('modeScreen');
const modeBtns = document.querySelectorAll('.mode-btn');
const chatContainer = document.getElementById('chatContainer');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const starsContainer = document.getElementById('stars');
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const newChatBtn = document.getElementById('newChat');
const settingsToggle = document.getElementById('settingsToggle');
const settingsPanel = document.getElementById('settingsPanel');
const closeSettings = document.getElementById('closeSettings');
const backBtn = document.getElementById('backBtn');
const chatTitle = document.getElementById('chatTitle');

// Settings Elements
const themeSelect = document.getElementById('themeSelect');
const accentColor = document.getElementById('accentColor');
const fontSize = document.getElementById('fontSize');
const chatAnimation = document.getElementById('chatAnimation');

// Variables
let currentMode = null;
let isTyping = false;
let touchStartX = 0;
let touchEndX = 0;

// Create Stars
function createStars() {
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.animationDuration = `${5 + Math.random() * 10}s`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        starsContainer.appendChild(star);
    }
}
createStars();

// Splash Screen to Mode Selection
enterBtn.addEventListener('click', () => {
    splashScreen.classList.add('hidden');
    setTimeout(() => {
        modeScreen.classList.add('active');
    }, 500);
});

// Mode Selection to Chat
modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        currentMode = btn.dataset.mode;
        modeScreen.classList.remove('active');
        setTimeout(() => {
            chatContainer.style.display = 'flex';
            chatTitle.textContent = `Celestia AI - ${currentMode === 'basic' ? 'Basic' : 'Super Smart'} Mode`;
            
            // Dynamic welcome message referencing creator and blueprint
            let welcomeMessage = `Welcome to ${currentMode === 'basic' ? 'Basic' : 'Super Smart'} Mode. `;
            welcomeMessage += `I'm Celestia AI, created by ${celestiaBlueprint.creator}. `;
            
            if (currentMode === 'basic') {
                welcomeMessage += `I'm here to provide clear, concise answers using my ${celestiaBlueprint.core.RUS} system. How can I help you today?`;
            } else {
                welcomeMessage += `I'm connected to the Universal Knowledge Web through my ${celestiaBlueprint.core.CEM} and ${celestiaBlueprint.core.ICI} modules. Let's explore the cosmos of knowledge together!`;
            }
            
            addCelestiaMessage(welcomeMessage);
            chatHistory.push({
                role: "assistant",
                content: welcomeMessage
            });
        }, 500);
    });
});

// Back to Mode Selection
backBtn.addEventListener('click', () => {
    chatContainer.style.display = 'none';
    chatMessages.innerHTML = '';
    chatHistory = []; // Clear chat history
    sidebar.classList.remove('active');
    settingsPanel.classList.remove('active');
    chatContainer.classList.remove('shifted');
    setTimeout(() => {
        modeScreen.classList.add('active');
    }, 500);
});

// Sidebar Toggle
sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    chatContainer.classList.toggle('shifted');
    settingsPanel.classList.remove('active'); // Close settings if open
});

// Swipe Gestures for Sidebar
document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    if (swipeDistance > 50 && !sidebar.classList.contains('active') && !settingsPanel.classList.contains('active')) {
        // Swipe right to open sidebar
        sidebar.classList.add('active');
        chatContainer.classList.add('shifted');
    } else if (swipeDistance < -50 && sidebar.classList.contains('active')) {
        // Swipe left to close sidebar
        sidebar.classList.remove('active');
        chatContainer.classList.remove('shifted');
    }
}

// New Chat
newChatBtn.addEventListener('click', () => {
    chatMessages.innerHTML = '';
    chatHistory = []; // Clear chat history
    
    // Create a new welcome message that references the blueprint and creator
    const newChatMessage = `New chat started in ${currentMode === 'basic' ? 'Basic' : 'Super Smart'} Mode. I'm Celestia AI, created by ${celestiaBlueprint.creator}, ready to assist you with my core ${currentMode === 'basic' ? celestiaBlueprint.core.RUS : celestiaBlueprint.core.CEM} module.`;
    
    addCelestiaMessage(newChatMessage);
    chatHistory.push({
        role: "assistant",
        content: newChatMessage
    });
    
    sidebar.classList.remove('active');
    chatContainer.classList.remove('shifted');
    settingsPanel.classList.remove('active');
});

// Settings Toggle
settingsToggle.addEventListener('click', () => {
    settingsPanel.classList.add('active');
    sidebar.classList.remove('active');
});

// Close Settings
closeSettings.addEventListener('click', () => {
    settingsPanel.classList.remove('active');
});

// Add Message with improved personalization
function addMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    
    // Apply animation based on settings
    if (chatAnimation.value === 'slide') {
        messageElement.style.animation = 'slideIn 0.3s ease';
    } else if (chatAnimation.value === 'fade') {
        messageElement.style.animation = 'fadeIn 0.3s ease';
    }
    
    if (sender === 'celestia') {
        const indicator = document.createElement('div');
        indicator.classList.add('celestia-indicator');
        indicator.textContent = `${celestiaBlueprint.name} by ${celestiaBlueprint.creator}`; // Add creator attribution
        messageElement.appendChild(indicator);
    }
