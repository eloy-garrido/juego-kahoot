const supabaseUrl = 'https://hqbysakupbqwdfyprzya.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxYnlzYWt1cGJxd2RmeXByenlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyOTE0NTMsImV4cCI6MjA3Nzg2NzQ1M30.ctzCo94xOuiVvytAJypPu1tuPVj2iLHZP82LOHsxE3E';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

const path = window.location.pathname;

if (path.endsWith('login.html')) {
    handleLoginPage();
} else if (path.endsWith('admin.html')) {
    handleAdminPage();
} else if (path.endsWith('host.html')) {
    handleHostPage();
} else if (path.endsWith('play.html')) {
    handlePlayPage();
} else if (path.endsWith('index.html') || path === '/') {
    handleJoinPage();
}

async function handleLoginPage() {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            console.error('Login failed:', error.message);
            // Re-add an element to show the error message to the user
            let errorEl = document.getElementById('error-message');
            if (!errorEl) {
                errorEl = document.createElement('p');
                errorEl.id = 'error-message';
                loginForm.appendChild(errorEl);
            }
            errorEl.textContent = `Error: ${error.message}`;
        } else {
            window.location.href = 'admin.html';
        }
    });
}

async function handleAdminPage() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const quizzesList = document.getElementById('quizzes-list');
    const createQuizForm = document.getElementById('create-quiz-form');

    const fetchQuizzes = async () => {
        const { data: quizzes, error } = await supabase.from('quizzes').select('*');
        if (error) {
            console.error('Error fetching quizzes:', error);
            return;
        }

        quizzesList.innerHTML = '';
        quizzes.forEach(quiz => {
            const quizElement = document.createElement('div');
            quizElement.innerHTML = `
                <h3>${quiz.title}</h3>
                <p>${quiz.description}</p>
                <button onclick="window.location.href='host.html?quiz_id=${quiz.id}'">Host</button>
            `;
            quizzesList.appendChild(quizElement);
        });
    };

    createQuizForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('quiz-title').value;
        const description = document.getElementById('quiz-description').value;

        const { data: { user } } = await supabase.auth.getUser();
        const { error } = await supabase.from('quizzes').insert([{ title, description, created_by: user.id }]);
        if (error) {
            console.error(`Error creating quiz: ${error.message}`);
        } else {
            fetchQuizzes();
            createQuizForm.reset();
        }
    });

    fetchQuizzes();
}

async function handleHostPage() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const quizId = params.get('quiz_id');

    const gameCodeEl = document.getElementById('game-code');
    const playersListEl = document.getElementById('players-list');
    const startGameBtn = document.getElementById('start-game-btn');

    let game;

    const createGame = async () => {
        const gameCode = Math.random().toString().slice(2, 8);
        const { data, error } = await supabase
            .from('games')
            .insert([{ quiz_id: quizId, game_code: gameCode, status: 'lobby' }])
            .select()
            .single();
        if (error) {
            console.error('Error creating game:', error);
            return;
        }
        game = data;
        gameCodeEl.textContent = game.game_code;
        listenForPlayers();
    };

    const listenForPlayers = () => {
        supabase
            .channel(`game:${game.id}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'players', filter: `game_id=eq.${game.id}` }, (payload) => {
                const player = payload.new;
                const playerEl = document.createElement('li');
                playerEl.textContent = player.nickname;
                playersListEl.appendChild(playerEl);
            })
            .subscribe();
    };

    startGameBtn.addEventListener('click', async () => {
        const { data: questions, error } = await supabase
            .from('questions')
            .select('id')
            .eq('quiz_id', quizId);
        if (error || !questions || questions.length === 0) {
            console.error('This quiz has no questions!');
            return;
        }

        await supabase
            .from('games')
            .update({ status: 'in_progress', current_question_id: questions[0].id })
            .eq('id', game.id);
    });

    createGame();
}

async function handlePlayPage() {
    const playerId = new URLSearchParams(window.location.search).get('player_id');
    if (!playerId) {
        window.location.href = 'index.html';
        return;
    }

    const questionContainer = document.getElementById('question-container');
    const waitingContainer = document.getElementById('waiting-container');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');

    const listenForQuestions = async () => {
        const { data: player, error } = await supabase
            .from('players')
            .select('game_id')
            .eq('id', playerId)
            .single();
        if (error) return;

        supabase
            .channel(`game-play:${player.game_id}`)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'games', filter: `id=eq.${player.game_id}` }, async (payload) => {
                const questionId = payload.new.current_question_id;
                if (questionId) {
                    const { data: question, error: qError } = await supabase.from('questions').select('*').eq('id', questionId).single();
                    const { data: options, error: oError } = await supabase.from('options').select('*').eq('question_id', questionId);

                    if (qError || oError) return;

                    questionText.textContent = question.text;
                    optionsContainer.innerHTML = '';
                    options.forEach(option => {
                        const button = document.createElement('button');
                        button.textContent = option.text;
                        button.onclick = async () => {
                            await supabase.from('player_responses').insert([{ player_id: playerId, question_id: question.id, option_id: option.id }]);
                            questionContainer.style.display = 'none';
                            waitingContainer.style.display = 'block';
                        };
                        optionsContainer.appendChild(button);
                    });

                    waitingContainer.style.display = 'none';
                    questionContainer.style.display = 'block';
                }
            })
            .subscribe();
    };

    listenForQuestions();
}

async function handleJoinPage() {
    const joinForm = document.getElementById('join-form');
    joinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const gameCode = document.getElementById('game-code').value;
        const nickname = document.getElementById('nickname').value;

        const { data: game, error } = await supabase.from('games').select('id').eq('game_code', gameCode).single();
        if (error || !game) {
            console.error('Game not found!');
            return;
        }

        const { data: player, error: pError } = await supabase.from('players').insert([{ game_id: game.id, nickname }]).select().single();
        if (pError) {
            console.error('Error joining game!', pError);
            return;
        }

        window.location.href = `play.html?player_id=${player.id}`;
    });
}
