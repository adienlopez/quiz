let quizzes = [];

async function generateQuizzes() {
    const category = document.getElementById('category').value;
    const difficulty = document.getElementById('difficulty').value;
    const quizContainer = document.getElementById('quiz-display');
    quizContainer.innerHTML = '';

    const apiUrl = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        quizzes = data.results;

        if (quizzes.length === 0) {
            quizContainer.innerHTML = 'No quizzes available for the selected category and difficulty level.';
            return;
        }

        quizzes.forEach((quiz, index) => {
            const quizElement = document.createElement('div');
            quizElement.classList.add('quiz');

            const questionElement = document.createElement('h2');
            questionElement.innerHTML = `${index + 1}. ${quiz.question}`;
            quizElement.appendChild(questionElement);

            const options = [...quiz.incorrect_answers, quiz.correct_answer];
            options.sort(() => Math.random() - 0.5);  // Shuffle options

            options.forEach(option => {
                const optionElement = document.createElement('div');
                const inputElement = document.createElement('input');
                inputElement.type = 'radio';
                inputElement.name = `quiz-${index}`;
                inputElement.value = option;

                const labelElement = document.createElement('label');
                labelElement.innerHTML = option;
                optionElement.appendChild(inputElement);
                optionElement.appendChild(labelElement);

                quizElement.appendChild(optionElement);
            });

            quizContainer.appendChild(quizElement);
        });

        // Add a submit button
        const submitButton = document.createElement('button');
        submitButton.innerHTML = 'Submit Answers';
        submitButton.onclick = checkAnswers;
        quizContainer.appendChild(submitButton);

    } catch (error) {
        quizContainer.innerHTML = 'Failed to load quizzes. Please try again later.';
        console.error('Error fetching quizzes:', error);
    }
}

function checkAnswers() {
    const quizContainer = document.getElementById('quiz-display');
    const results = document.createElement('div');
    results.classList.add('results');

    quizzes.forEach((quiz, index) => {
        const selectedOption = document.querySelector(`input[name="quiz-${index}"]:checked`);
        const correctAnswer = quiz.correct_answer;
        const resultElement = document.createElement('div');

        if (selectedOption) {
            if (selectedOption.value === correctAnswer) {
                resultElement.innerHTML = `Question ${index + 1}: Correct`;
                resultElement.style.color = 'green';
            } else {
                resultElement.innerHTML = `Question ${index + 1}: Incorrect. The correct answer was: ${correctAnswer}`;
                resultElement.style.color = 'red';
            }
        } else {
            resultElement.innerHTML = `Question ${index + 1}: No answer selected. The correct answer was: ${correctAnswer}`;
            resultElement.style.color = 'orange';
        }

        results.appendChild(resultElement);
    });

    quizContainer.appendChild(results);
}
