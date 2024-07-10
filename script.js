const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const copyBtn = document.getElementById('copy-btn');
const textContainer = document.getElementById('text-container');

let recognition;
let isRecognizing = false;

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        isRecognizing = true;
        startBtn.disabled = true;
        stopBtn.disabled = false;
    };

    recognition.onerror = (event) => {
        console.error(event.error);
    };

    recognition.onend = () => {
        isRecognizing = false;
        startBtn.disabled = false;
        stopBtn.disabled = true;
    };

    recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                textContainer.textContent += event.results[i][0].transcript + ' ';
                textContainer.scrollTop = textContainer.scrollHeight; 
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
    };

    startBtn.addEventListener('click', () => {
        if (!isRecognizing) {
            recognition.start();
        }
    });

    stopBtn.addEventListener('click', () => {
        if (isRecognizing) {
            recognition.stop();
        }
    });
} else {
    console.error('Speech recognition not supported in this browser.');
    alert('Speech recognition not supported in this browser.');
}

copyBtn.addEventListener('click', () => {
    const text = textContainer.textContent;
    navigator.clipboard.writeText(text).then(() => {
        alert('Text copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
});
