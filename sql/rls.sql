-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE options ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_responses ENABLE ROW LEVEL SECURITY;

-- Policies for 'profiles'
-- Allow users to see their own profile
CREATE POLICY "Allow users to see their own profile" ON profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Policies for 'quizzes'
-- Admins can do anything.
CREATE POLICY "Allow admin full access on quizzes" ON quizzes
    FOR ALL
    USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
    WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Any authenticated user can view quizzes.
CREATE POLICY "Allow authenticated users to select quizzes" ON quizzes
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Policies for 'questions'
-- Admins can do anything.
CREATE POLICY "Allow admin full access on questions" ON questions
    FOR ALL
    USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
    WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Any authenticated user can view questions.
CREATE POLICY "Allow authenticated users to select questions" ON questions
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Policies for 'options'
-- Admins can do anything.
CREATE POLICY "Allow admin full access on options" ON options
    FOR ALL
    USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
    WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Any authenticated user can view options.
CREATE POLICY "Allow authenticated users to select options" ON options
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Policies for 'games'
-- Admins can create games.
CREATE POLICY "Allow admins to insert games" ON games
    FOR INSERT
    WITH CHECK (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    );

-- Only the host who created the game can update it.
CREATE POLICY "Allow host to update games" ON games
    FOR UPDATE
    USING (
        (SELECT created_by FROM quizzes WHERE id = quiz_id) = auth.uid()
    );

-- All users can see games.
CREATE POLICY "Allow all users to select games" ON games
    FOR SELECT
    USING (true);

-- Policies for 'players'
-- Anyone can insert a player into a game that is in 'lobby' state.
CREATE POLICY "Allow players to insert themselves into a lobbying game" ON players
    FOR INSERT
    WITH CHECK (
        (SELECT status FROM games WHERE id = game_id) = 'lobby'
    );

-- Policies for 'player_responses'
-- Anyone can insert a response for a game that is 'in_progress'.
CREATE POLICY "Allow players to insert their responses for an in-progress game" ON player_responses
    FOR INSERT
    WITH CHECK (
        (SELECT status FROM games WHERE id = (SELECT game_id FROM players WHERE id = player_id)) = 'in_progress'
    );
