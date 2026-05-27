// Delta Export Chatbot
class DeltaExportChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.init();
    }

    init() {
        this.createChatbotDOM();
        this.attachEventListeners();
        this.addWelcomeMessage();
    }

    createChatbotDOM() {
        // Create chatbot container
        const chatbotHTML = `
            <div id="chatbot-widget" class="chatbot-widget">
                <div class="chatbot-header">
                    <div class="chatbot-title">
                        <i class="fas fa-comments"></i>
                        <span>Delta Export Assistant</span>
                    </div>
                    <button class="chatbot-close" id="chatbotClose" aria-label="Close chat">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="chatbot-messages" id="chatbotMessages"></div>
                <div class="chatbot-input-area">
                    <input 
                        type="text" 
                        id="chatbotInput" 
                        placeholder="Ask me anything..." 
                        class="chatbot-input"
                        autocomplete="off"
                    >
                    <button class="chatbot-send" id="chatbotSend" aria-label="Send message">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
            <button id="chatbot-toggle" class="chatbot-toggle" aria-label="Open chat">
                <i class="fas fa-comments"></i>
            </button>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    attachEventListeners() {
        const toggleBtn = document.getElementById('chatbot-toggle');
        const closeBtn = document.getElementById('chatbotClose');
        const sendBtn = document.getElementById('chatbotSend');
        const input = document.getElementById('chatbotInput');

        toggleBtn.addEventListener('click', () => this.toggleChat());
        closeBtn.addEventListener('click', () => this.closeChat());
        sendBtn.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    toggleChat() {
        const widget = document.getElementById('chatbot-widget');
        const toggle = document.getElementById('chatbot-toggle');
        this.isOpen = !this.isOpen;
        widget.classList.toggle('active', this.isOpen);
        toggle.classList.toggle('hidden', this.isOpen);
    }

    closeChat() {
        const widget = document.getElementById('chatbot-widget');
        const toggle = document.getElementById('chatbot-toggle');
        this.isOpen = false;
        widget.classList.remove('active');
        toggle.classList.remove('hidden');
    }

    sendMessage() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();

        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        input.value = '';

        // Get bot response
        setTimeout(() => {
            const response = this.getBotResponse(message);
            this.addMessage(response, 'bot');
        }, 500);
    }

    addMessage(text, sender) {
        const messagesDiv = document.getElementById('chatbotMessages');
        const messageEl = document.createElement('div');
        messageEl.className = `chatbot-message ${sender}-message`;
        messageEl.innerHTML = `<div class="message-content">${this.escapeHtml(text)}</div>`;
        messagesDiv.appendChild(messageEl);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        this.messages.push({ text, sender, timestamp: new Date() });
    }

    addWelcomeMessage() {
        setTimeout(() => {
            this.addMessage('👋 Welcome to Delta Export! How can I assist you today?', 'bot');
            this.addMessage('You can ask me about:\n• Our spices & scrap products\n• Pricing & shipping\n• Contact information\n• Company details', 'bot');
        }, 300);
    }

    getBotResponse(userMessage) {
        const message = userMessage.toLowerCase();

        // Greeting responses
        if (this.matchesKeywords(message, ['hello', 'hi', 'hey', 'greetings'])) {
            return '👋 Hello! Welcome to Delta Export. How can I help you today?';
        }

        // Products
        if (this.matchesKeywords(message, ['products', 'what do you', 'offer', 'sell', 'export'])) {
            return '🏭 We export:\n• Premium Indian Spices\n• Copper Scrap\n• Aluminium Scrap\n• Other Industrial Metal Scrap\n\nWould you like more details about any of these?';
        }

        if (this.matchesKeywords(message, ['spice', 'spices'])) {
            return '🌶️ We offer premium quality Indian spices with reliable export service. Our spices are sourced and processed to the highest standards. Interested in bulk orders?';
        }

        if (this.matchesKeywords(message, ['copper', 'aluminium', 'scrap', 'metal'])) {
            return '♻️ We provide high-quality copper, aluminium, and other industrial metal scraps. Perfect for manufacturing and recycling industries. Contact us for competitive pricing!';
        }

        // About
        if (this.matchesKeywords(message, ['about', 'who are you', 'company', 'delta export'])) {
            return '🏢 Delta Export is a premium Indian exporter of spices and metal scrap. We provide reliable service with competitive pricing. Learn more at our About Us page!';
        }

        // Contact & Orders
        if (this.matchesKeywords(message, ['contact', 'call', 'email', 'phone', 'reach'])) {
            return '📞 You can reach us via:\n• WhatsApp: Click the WhatsApp button on any page\n• Email: Check our Contact Us page\n• Phone: Available on our contact page\n\nVisit our Contact Us page for all details!';
        }

        if (this.matchesKeywords(message, ['order', 'buy', 'purchase', 'quote', 'price'])) {
            return '💼 For orders and quotes, please visit our Contact Us page or reach out via WhatsApp. Our team will provide you with the best pricing and delivery options!';
        }

        // Shipping & Delivery
        if (this.matchesKeywords(message, ['shipping', 'delivery', 'export', 'international', 'where'])) {
            return '🌍 We handle international export with reliable logistics. Delivery times and costs vary by destination. Contact us for shipping details and rates!';
        }

        // Quality
        if (this.matchesKeywords(message, ['quality', 'standard', 'certified', 'guarantee'])) {
            return '✅ All our products meet international quality standards. We ensure premium quality at every step of processing and export. Your satisfaction is guaranteed!';
        }

        // Bulk orders
        if (this.matchesKeywords(message, ['bulk', 'wholesale', 'large', 'quantity'])) {
            return '📦 We specialize in bulk exports and wholesale supplies. Contact us for special bulk pricing and flexible payment terms!';
        }

        // Help options
        if (this.matchesKeywords(message, ['help', 'what can you', 'options', 'menu'])) {
            return '📋 I can help with:\n• Product information\n• Shipping & delivery details\n• Pricing & quotes\n• Contact information\n• Company background\n\nWhat would you like to know?';
        }

        // Thank you
        if (this.matchesKeywords(message, ['thank', 'thanks', 'thank you'])) {
            return '😊 You\'re welcome! Feel free to ask me anything else about Delta Export!';
        }

        // Bye
        if (this.matchesKeywords(message, ['bye', 'goodbye', 'see you', 'farewell'])) {
            return '👋 Thank you for chatting with us! Have a great day!';
        }

        // Default response
        return '🤔 I\'m not sure about that. You can:\n• Visit our products page\n• Check the About Us section\n• Contact us directly via WhatsApp\n• Email us from the Contact Us page\n\nHow else can I help?';
    }

    matchesKeywords(message, keywords) {
        return keywords.some(keyword => message.includes(keyword));
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new DeltaExportChatbot();
});
