const sideNavigation = document.querySelector('.sideNavigation');
const sideBarToggle = document.querySelector('.fa-bars');
const startContentUl = document.querySelector('.startContent ul');
const inputArea = document.querySelector('.inputArea input');
const sendRequest = document.querySelector('.fa-paper-plane');
const chatHistory = document.querySelector('.chatHistory ul');
const startContent = document.querySelector('.startContent');
const chatContent = document.querySelector('.chatContent');
const results = document.querySelector('.results');

// prompt data 
const promptdata = [
    {
        question: 'Write a thank you message to my best friend',
        icon: 'fa-solid fa-wand-magic-sparkles',
    },
    {
        question: 'Write a simple code to learn JavaScript',
        icon: 'fa-solid fa-code',
    },
    {
        question: 'How to become a Full Stack Developer',
        icon: 'fa-solid fa-laptop-code',
    },
    {
        question: 'How to become a Frontend Developer',
        icon: 'fa-solid fa-database',
    },
];

// A dynamic display of the prompt question
window.addEventListener('load', () => {
    promptdata.forEach(data => {
        let item = document.createElement('li');

        item.addEventListener('click', () => {
            getGeminiResponse(data.question, true);
        });
        item.innerHTML = `
        <div class="promptSuggestion">
            <p>${data.question}</p>
            <div class="suggestIcon"><i class="${data.icon}"></i></div>
        </div>`;

        startContentUl.append(item);
    });
});

// side bar toggle
sideBarToggle.addEventListener('click', () => {
    sideNavigation.classList.toggle('expandClose');
});

// show the send icon when the text is entered
inputArea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        getGeminiResponse(inputArea.value, true);
    }
    if (e.target.value.length > 0) {
        sendRequest.style.display = 'inline';
    } else {
        sendRequest.style.display = 'none';
    }
});

sendRequest.addEventListener('click', () => {
    getGeminiResponse(inputArea.value, true);
});

// function to get Gemini api
async function getGeminiResponse(question, appendHistory) {
    // Create a new list item for the chat history
    let historyList = document.createElement('li');

    // Show recent search back to the chat window on click
    if (appendHistory) {
        historyList.addEventListener('click', () => {
            getGeminiResponse(question, false);
        });
        historyList.innerHTML = `<i class="fa-solid fa-message"></i>${question}`;
        chatHistory.append(historyList);

    }
    results.innerHTML = "";
    inputArea.value = "";

    startContent.style.display = 'none';
    chatContent.style.display = 'block';

    let resultTest = `
    <div class="resultTest">
        <img src="https://cdn-icons-png.flaticon.com/128/3135/3135715.png">
        <p>${question}</p>
    </div>`;
    let resultData = `
    <div class="resultData">
        <img src="https://cdn-icons-png.flaticon.com/128/8369/8369338.png">
        <div class="loader">
            <div class="animatedBg"></div>
            <div class="animatedBg"></div>
            <div class="animatedBg"></div>
        </div>
    </div>`;
    results.innerHTML += resultTest;
    results.innerHTML += resultData;

    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyD7ETPSJWVZ5vaxdVnnxKBu7b18WJoVw00";

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: question }] }]
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const geminiResponse = data.candidates[0].content.parts[0].text;

        // Clear the loader
        results.innerHTML = `
        <div class="resultTest">
            <img src="https://cdn-icons-png.flaticon.com/128/3135/3135715.png">
            <p class:'loaded'>${question}</p>
        </div>
        <div class="resultResponse">
            <img src="https://cdn-icons-png.flaticon.com/128/8369/8369338.png">
            <pre><code id="typeEffect"></code></pre>
        </div>`;

        // Apply typing effect
        typeEffect(document.getElementById('typeEffect'), geminiResponse);

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

// Typing effect function
function typeEffect(element, text, speed = 50) {
    let index = 0;
    function type() {
        if (index < text.length) {
            element.innerHTML += text.charAt(index) === '\n' ? '<br/>' : text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }
    type();
}

function newChat() {
    startContent.style.display = 'block';
    chatContent.style.display = 'none';
}
