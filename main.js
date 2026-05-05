document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    };
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    
    revealElements.forEach(el => revealObserver.observe(el));
    
    // Trigger immediately for elements already in view on load
    setTimeout(() => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if(rect.top < window.innerHeight) {
                el.classList.add('active');
            }
        });
    }, 100);

    // --- 2. BMI Calculator ---
    const btnCalc = document.getElementById('calc-bmi-btn');
    if (btnCalc) {
        const heightInput = document.getElementById('height');
        const weightInput = document.getElementById('weight');
        const resultDiv = document.getElementById('bmi-result');
        const scoreDiv = document.querySelector('.bmi-score');
        const statusDiv = document.querySelector('.bmi-status');
        const recDiv = document.querySelector('.bmi-recommendation');

        btnCalc.addEventListener('click', () => {
            const h = parseFloat(heightInput.value);
            const w = parseFloat(weightInput.value);
            
            if (!h || !w || h <= 0 || w <= 0) {
                alert('Please enter valid positive numbers for height and weight.');
                return;
            }

            // BMI = weight(kg) / height(m)^2
            const heightInMeters = h / 100;
            const bmi = (w / (heightInMeters * heightInMeters)).toFixed(1);
            
            resultDiv.classList.remove('hidden');
            scoreDiv.textContent = bmi;
            
            let status = '';
            let recommendation = '';
            let color = 'var(--primary)'; // Default primary blue

            if (bmi < 18.5) {
                status = 'Underweight';
                recommendation = 'Focus on our Strength & Hypertrophy classes to build muscle mass safely.';
                color = 'var(--outline)';
            } else if (bmi >= 18.5 && bmi < 25) {
                status = 'Normal weight';
                recommendation = 'Maintain your fitness with a mix of HIIT and Yoga/Mobility classes.';
                color = 'var(--primary)';
            } else if (bmi >= 25 && bmi < 30) {
                status = 'Overweight';
                recommendation = 'Try our High-Intensity Interval Training (HIIT) for effective fat burn.';
                color = 'var(--secondary)'; // Orange
            } else {
                status = 'Obese';
                recommendation = 'Start with low-impact classes and consult our expert coaches for a personalized plan.';
                color = '#ba1a1a'; // Error color from design system
            }

            statusDiv.textContent = status;
            statusDiv.style.color = color;
            scoreDiv.style.color = color;
            recDiv.textContent = recommendation;
        });
    }

    // --- 3. Interactive Class Schedule ---
    const scheduleData = [
        { id: 1, time: '06:00 AM', name: 'Morning Burn (HIIT)', trainer: 'Sarah Jenkins', type: 'hiit' },
        { id: 2, time: '08:00 AM', name: 'Power Lifting', trainer: 'Marcus Vance', type: 'strength' },
        { id: 3, time: '12:00 PM', name: 'Lunchtime Flow', trainer: 'David Chen', type: 'yoga' },
        { id: 4, time: '05:30 PM', name: 'Endurance Circuit', trainer: 'Sarah Jenkins', type: 'hiit' },
        { id: 5, time: '07:00 PM', name: 'Strength Foundations', trainer: 'Marcus Vance', type: 'strength' },
        { id: 6, time: '08:15 PM', name: 'Recovery Mobility', trainer: 'David Chen', type: 'yoga' }
    ];

    const scheduleGrid = document.getElementById('schedule-grid');
    if (scheduleGrid) {
        const filterBtns = document.querySelectorAll('.filter-btn');

        function renderSchedule(filterType) {
            scheduleGrid.innerHTML = ''; // Clear existing
            
            const filteredData = filterType === 'all' 
                ? scheduleData 
                : scheduleData.filter(item => item.type === filterType);
                
            if (filteredData.length === 0) {
                scheduleGrid.innerHTML = '<p class="text-center">No classes found for this category.</p>';
                return;
            }

            filteredData.forEach(item => {
                const el = document.createElement('div');
                el.className = 'schedule-item card';
                el.innerHTML = `
                    <div class="schedule-time">${item.time}</div>
                    <div class="schedule-name">
                        <strong>${item.name}</strong>
                        <div class="schedule-trainer">Coach: ${item.trainer}</div>
                    </div>
                    <button class="btn btn-outline" style="padding: 8px 16px; font-size: 0.875rem;">Book</button>
                `;
                scheduleGrid.appendChild(el);
            });
        }

        // Initial render
        renderSchedule('all');

        // Filter click events
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked
                e.target.classList.add('active');
                
                const filter = e.target.getAttribute('data-filter');
                renderSchedule(filter);
            });
        });
    }
});

// --- 4. Interactive AI Chatbot Widget ---
// Create chatbot DOM elements
const chatbotHTML = `
<div class="chatbot-widget">
    <button class="chatbot-toggle" id="chatbot-toggle">
        <i class="fa-solid fa-message"></i>
    </button>
    <div class="chatbot-window" id="chatbot-window">
        <div class="chatbot-header">
            <h3>Kinetic Assistant</h3>
            <button class="chatbot-close" id="chatbot-close"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="chatbot-messages" id="chatbot-messages">
            <div class="chat-msg bot">Welcome to Kinetic! How can we elevate your performance today?</div>
        </div>
        <div class="chatbot-quick-actions" id="chatbot-quick-actions">
            <button class="chat-quick-btn" data-msg="Tell me about Memberships">Memberships</button>
            <button class="chat-quick-btn" data-msg="Personal Training options?">Personal Training</button>
            <button class="chat-quick-btn" data-msg="What is the pricing?">Pricing</button>
        </div>
        <div class="chatbot-input-area">
            <input type="text" id="chatbot-input" placeholder="Type your message...">
            <button id="chatbot-send"><i class="fa-solid fa-paper-plane"></i></button>
        </div>
    </div>
</div>
`;

document.body.insertAdjacentHTML('beforeend', chatbotHTML);

const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotSend = document.getElementById('chatbot-send');
const quickBtns = document.querySelectorAll('.chat-quick-btn');

let chatHistory = [
    { role: "system", content: "You are a helpful and energetic assistant for Kinetic Fitness gym. Keep your answers brief, friendly, and focused on fitness. If asked about pricing, direct them to 'Talk to a Human' by providing a link to contact.html." }
];

chatbotToggle.addEventListener('click', () => {
    chatbotWindow.classList.add('open');
});

chatbotClose.addEventListener('click', () => {
    chatbotWindow.classList.remove('open');
});

function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;
    msgDiv.textContent = text;
    chatbotMessages.appendChild(msgDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

async function sendToOpenRouter(userMessage) {
    // Show loading
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'chatbot-loading active';
    loadingDiv.textContent = 'Typing...';
    chatbotMessages.appendChild(loadingDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    chatHistory.push({ role: "user", content: userMessage });

    try {
        // Use environment variable for the API key
        const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
        
        if (!apiKey) {
            throw new Error("API Key missing");
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "meta-llama/llama-3-8b-instruct",
                messages: chatHistory
            })
        });

        const data = await response.json();
        const botReply = data.choices[0].message.content;
        
        loadingDiv.remove();
        addMessage(botReply, 'bot');
        chatHistory.push({ role: "assistant", content: botReply });

    } catch (error) {
        loadingDiv.remove();
        console.error("Chatbot Error:", error);
        addMessage("Sorry, I am having trouble connecting right now. Please reach out via our contact page!", 'bot');
    }
}

function handleSend(messageText) {
    const text = messageText || chatbotInput.value.trim();
    if (!text) return;
    
    addMessage(text, 'user');
    chatbotInput.value = '';
    
    if (text.toLowerCase().includes('pricing')) {
        setTimeout(() => {
            addMessage("For detailed pricing and memberships, please talk to our team.", 'bot');
            const linkHtml = document.createElement('a');
            linkHtml.href = 'contact.html';
            linkHtml.className = 'btn btn-outline mt-4';
            linkHtml.textContent = 'Talk to a Human';
            linkHtml.style.display = 'inline-block';
            linkHtml.style.fontSize = '0.8rem';
            linkHtml.style.padding = '4px 12px';
            const msgDiv = document.createElement('div');
            msgDiv.className = 'chat-msg bot';
            msgDiv.appendChild(linkHtml);
            chatbotMessages.appendChild(msgDiv);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }, 500);
        return;
    }

    sendToOpenRouter(text);
}

chatbotSend.addEventListener('click', () => handleSend());
chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
});
quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        handleSend(btn.getAttribute('data-msg'));
        // Hide quick actions after first use
        document.getElementById('chatbot-quick-actions').style.display = 'none';
    });
});

