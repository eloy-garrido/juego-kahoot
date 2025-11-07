const supabaseUrl = 'https://hqbysakupbqwdfyprzya.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxYnlzYWt1cGJxd2RmeXByenlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyOTE0NTMsImV4cCI6MjA3Nzg2NzQ1M30.ctzCo94xOuiVvytAJypPu1tuPVj2iLHZP82LOHsxE3E';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

const path = window.location.pathname;

if (path.endsWith('play.html')) {
    handlePlayPage();
} else if (path.endsWith('score.html')) {
    handleScorePage();
} else if (path.endsWith('index.html') || path === '/') {
    handleStartPage();
}

function handleStartPage() {
    const startForm = document.getElementById('start-form');
    startForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const playerName = document.getElementById('player-name').value;
        localStorage.setItem('playerName', playerName);
        window.location.href = 'play.html';
    });
}

async function handlePlayPage() {
    const playerName = localStorage.getItem('playerName');
    if (!playerName) {
        window.location.href = 'index.html';
        return;
    }

    const gameContainer = document.getElementById('game-container');
    const timerEl = document.getElementById('timer');
    const questionTextEl = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');

    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let timer;

    const fetchQuestions = async () => {
        console.log("Fetching questions...");
        const { data: quiz, error: quizError } = await supabase.from('quizzes').select('id').eq('title', 'Angular Basics').single();
        if (quizError) {
            console.error("Error fetching quiz:", quizError);
            return;
        }

        const { data, error } = await supabase.from('questions').select('*, options(*)').eq('quiz_id', quiz.id);
        if (error) {
            console.error("Error fetching questions:", error);
            return;
        }
        questions = data;
        console.log("Questions fetched:", questions);
        showNextQuestion();
    };

    const showNextQuestion = () => {
        if (currentQuestionIndex >= questions.length) {
            endGame();
            return;
        }

        const question = questions[currentQuestionIndex];
        questionTextEl.textContent = question.text;
        optionsContainer.innerHTML = '';

        let timeLeft = question.time_limit;
        timerEl.textContent = timeLeft;
        timer = setInterval(() => {
            timeLeft--;
            timerEl.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                currentQuestionIndex++;
                showNextQuestion();
            }
        }, 1000);

        question.options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option.text;
            button.onclick = () => {
                clearInterval(timer);
                if (option.is_correct) {
                    score += timeLeft * 10;
                }
                currentQuestionIndex++;
                showNextQuestion();
            };
            optionsContainer.appendChild(button);
        });
    };

    const endGame = async () => {
        await supabase.from('scores').insert([{ player_name: playerName, score }]);
        localStorage.setItem('lastScore', score);
        window.location.href = 'score.html';
    };

    fetchQuestions();
}

async function handleScorePage() {
    // ... (logic from previous step)
}
