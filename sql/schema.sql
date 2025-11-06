-- Profiles Table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    username TEXT,
    role TEXT
);

-- Quizzes Table
CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    created_by UUID REFERENCES profiles(id)
);

-- Questions Table
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    time_limit INTEGER
);

-- Options Table
CREATE TABLE options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL
);

-- Games Table
CREATE TABLE games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    game_code VARCHAR(6) UNIQUE NOT NULL,
    status TEXT DEFAULT 'lobby',
    current_question_id UUID REFERENCES questions(id)
);

-- Players Table
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    nickname TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    user_id UUID -- Optional, for Anonymous Auth
);

-- Player Responses Table
CREATE TABLE player_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    option_id UUID REFERENCES options(id) ON DELETE CASCADE,
    time_taken INTEGER -- in milliseconds
);
