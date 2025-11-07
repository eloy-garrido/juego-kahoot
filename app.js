const supabaseUrl = 'https://hqbysakupbqwdfyprzya.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxYnlzYWt1cGJxd2RmeXByenlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyOTE0NTMsImV4cCI6MjA3Nzg2NzQ1M30.ctzCo94xOuiVvytAJypPu1tuPVj2iLHZP82LOHsxE3E';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Sound setup
const sounds = {
    background: new Howl({ src: ['audio/background.mp3'], loop: true, volume: 0.3 }),
    correct: new Howl({ src: ['audio/correct.mp3'] }),
    incorrect: new Howl({ src: ['audio/incorrect.mp3'] })
};

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path.endsWith('play.html')) {
        handlePlayPage();
    } else if (path.endsWith('score.html')) {
        handleScorePage();
    } else if (path.endsWith('index.html') || path.endsWith('/')) {
        handleStartPage();
    }
});


function handleStartPage() {
    const startForm = document.getElementById('start-form');
    if (startForm) {
        startForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const playerNameInput = document.getElementById('player-name');
            const playerName = playerNameInput.value;
            if (playerName && playerName.trim()) {
                localStorage.setItem('playerName', playerName);
                window.location.href = 'play.html';
            } else {
                playerNameInput.placeholder = "Please enter a name!";
            }
        });
    }
}

async function handlePlayPage() {
    sounds.background.play();
    const playerName = localStorage.getItem('playerName');
    if (!playerName) {
        window.location.href = 'index.html';
        return;
    }

    const gameContainer = document.getElementById('game-container');
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorContainer = document.getElementById('error-container');
    const timerEl = document.getElementById('timer');
    const questionTextEl = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');

    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let timer;

    const fetchQuestions = async () => {
        try {
            const { data: quiz, error: quizError } = await supabase.from('quizzes').select('id').eq('title', 'Angular Basics').single();
            if (quizError) throw quizError;

            const { data, error } = await supabase.from('questions').select('*, options(*)').eq('quiz_id', quiz.id);
            if (error) throw error;

            questions = data;
            loadingIndicator.style.display = 'none';
            gameContainer.style.display = 'block';
            showNextQuestion();
        } catch (error) {
            console.error('Error fetching questions:', error);
            loadingIndicator.style.display = 'none';
            errorContainer.style.display = 'block';
        }
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
                    button.classList.add('correct');
                    sounds.correct.play();
                } else {
                    button.classList.add('incorrect');
                    sounds.incorrect.play();
                }

                setTimeout(() => {
                    currentQuestionIndex++;
                    showNextQuestion();
                }, 1000); // Wait 1 second before showing next question
            };
            optionsContainer.appendChild(button);
        });
    };

    const endGame = async () => {
        sounds.background.stop();
        await supabase.from('scores').insert([{ player_name: playerName, score }]);
        localStorage.setItem('lastScore', score);
        window.location.href = 'score.html';
    };

    fetchQuestions();
}

async function handleScorePage() {
    const playerName = localStorage.getItem('playerName');
    const lastScore = localStorage.getItem('lastScore');

    document.getElementById('player-name').textContent = playerName;
    document.getElementById('final-score').textContent = lastScore;

    const rankingList = document.getElementById('ranking-list');
    const { data, error } = await supabase
        .from('scores')
        .select('*')
        .order('score', { ascending: false })
        .limit(10);

    if (error) return;

    data.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `${entry.player_name}: ${entry.score}`;
        rankingList.appendChild(li);
    });
}
