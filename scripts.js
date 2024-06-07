async function generateQuizzes() {
    const category = document.getElementById('category').value;
    const difficulty = document.getElementById('difficulty').value;
    const quizContainer = document.getElementById('quiz-display');
    quizContainer.innerHTML = '';


    const apiUrl = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`;


    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const quizzes = data.results;


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
    } catch (error) {
        quizContainer.innerHTML = 'Failed to load quizzes. Please try again later.';
        console.error('Error fetching quizzes:', error);
    }
}