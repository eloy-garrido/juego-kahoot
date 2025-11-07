-- Enable RLS for all tables
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE options ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Allow public read access to quizzes, questions, and options
CREATE POLICY "Allow public read access to quizzes" ON quizzes FOR SELECT USING (true);
CREATE POLICY "Allow public read access to questions" ON questions FOR SELECT USING (true);
CREATE POLICY "Allow public read access to options" ON options FOR SELECT USING (true);

-- Allow users to insert their scores
CREATE POLICY "Allow users to insert their scores" ON scores FOR INSERT WITH CHECK (true);
-- Allow public read access to scores for the ranking
CREATE POLICY "Allow public read access to scores" ON scores FOR SELECT USING (true);
