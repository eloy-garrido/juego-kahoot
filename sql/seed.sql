-- Create a quiz for Angular Basics
INSERT INTO quizzes (id, title, description)
VALUES ('a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6', 'Angular Basics', 'A quiz to test your basic knowledge of Angular.');

-- Insert 10 questions for the Angular Basics quiz
DO $$
DECLARE
    question_id_1 UUID := gen_random_uuid();
    question_id_2 UUID := gen_random_uuid();
    question_id_3 UUID := gen_random_uuid();
    question_id_4 UUID := gen_random_uuid();
    question_id_5 UUID := gen_random_uuid();
    question_id_6 UUID := gen_random_uuid();
    question_id_7 UUID := gen_random_uuid();
    question_id_8 UUID := gen_random_uuid();
    question_id_9 UUID := gen_random_uuid();
    question_id_10 UUID := gen_random_uuid();
BEGIN
    -- Question 1
    INSERT INTO questions (id, quiz_id, text) VALUES (question_id_1, 'a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6', 'What is the command to generate a new component in Angular?');
    INSERT INTO options (question_id, text, is_correct) VALUES
        (question_id_1, 'ng generate component my-component', TRUE),
        (question_id_1, 'ng new component my-component', FALSE),
        (question_id_1, 'ng create component my-component', FALSE);

    -- Question 2
    INSERT INTO questions (id, quiz_id, text) VALUES (question_id_2, 'a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6', 'Which directive is used to conditionally render an element in Angular?');
    INSERT INTO options (question_id, text, is_correct) VALUES
        (question_id_2, '*ngIf', TRUE),
        (question_id_2, '*ngFor', FALSE),
        (question_id_2, '*ngSwitch', FALSE);

    -- Question 3
    INSERT INTO questions (id, quiz_id, text) VALUES (question_id_3, 'a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6', 'How do you bind a property in Angular?');
    INSERT INTO options (question_id, text, is_correct) VALUES
        (question_id_3, 'Using [property]="value"', TRUE),
        (question_id_3, 'Using (property)="value"', FALSE),
        (question_id_3, 'Using {{property}}="value"', FALSE);

    -- Question 4
    INSERT INTO questions (id, quiz_id, text) VALUES (question_id_4, 'a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6', 'What is the purpose of the `RouterModule` in Angular?');
    INSERT INTO options (question_id, text, is_correct) VALUES
        (question_id_4, 'To handle routing and navigation', TRUE),
        (question_id_4, 'To make HTTP requests', FALSE),
        (question_id_4, 'To manage forms', FALSE);

    -- Question 5
    INSERT INTO questions (id, quiz_id, text) VALUES (question_id_5, 'a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6', 'Which file is the main entry point for an Angular application?');
    INSERT INTO options (question_id, text, is_correct) VALUES
        (question_id_5, 'main.ts', TRUE),
        (question_id_5, 'app.component.ts', FALSE),
        (question_id_5, 'index.html', FALSE);

    -- Question 6
    INSERT INTO questions (id, quiz_id, text) VALUES (question_id_6, 'a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6', 'What is interpolation in Angular?');
    INSERT INTO options (question_id, text, is_correct) VALUES
        (question_id_6, 'Displaying a component property in the template using {{ }}', TRUE),
        (question_id_6, 'Creating a new component', FALSE),
        (question_id_6, 'Importing a module', FALSE);

    -- Question 7
    INSERT INTO questions (id, quiz_id, text) VALUES (question_id_7, 'a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6', 'Which decorator is used to define a component in Angular?');
    INSERT INTO options (question_id, text, is_correct) VALUES
        (question_id_7, '@Component', TRUE),
        (question_id_7, '@NgModule', FALSE),
        (question_id_7, '@Injectable', FALSE);

    -- Question 8
    INSERT INTO questions (id, quiz_id, text) VALUES (question_id_8, 'a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6', 'What does `ngFor` do?');
    INSERT INTO options (question_id, text, is_correct) VALUES
        (question_id_8, 'Repeats a template for each item in a list', TRUE),
        (question_id_8, 'Binds a property to an element', FALSE),
        (question_id_8, 'Handles user clicks', FALSE);

    -- Question 9
    INSERT INTO questions (id, quiz_id, text) VALUES (question_id_9, 'a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6', 'How do you create a two-way data binding in Angular?');
    INSERT INTO options (question_id, text, is_correct) VALUES
        (question_id_9, 'Using [(ngModel)]', TRUE),
        (question_id_9, 'Using [ngModel]', FALSE),
        (question_id_9, 'Using (ngModel)', FALSE);

    -- Question 10
    INSERT INTO questions (id, quiz_id, text) VALUES (question_id_10, 'a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6', 'What is the purpose of a service in Angular?');
    INSERT INTO options (question_id, text, is_correct) VALUES
        (question_id_10, 'To share data and logic across components', TRUE),
        (question_id_10, 'To define the HTML structure of a component', FALSE),
        (question_id_10, 'To style a component', FALSE);
END $$;
