window.onload = function() {
    main()
};

function main() {
    var game = document.getElementById("game");

    var problems = [
        ["hello", "yes", "no", "maybe", "definitely"],
        ["woop", "bloop", "moop", "shoop", "meoop"]
    ];

    var question = document.createElement("div");
    question.setAttribute("class", "question");
    game.appendChild(question);

    var answers = [];
    var num_answers = 4;

    process_answer = function(i) {
        load_problem(question, answers, problems[1]);
        console.log(i);
        answers[i].innerHTML = 'clicked';
    };

    for (var i = 0; i < num_answers; i++) {
        a = document.createElement("div")
        a.setAttribute("class", "answer");
        console.log(i);
        a.onclick = function() {
            binder = i;
            process_answer(binder);
        };
        answers.push(a);
        game.appendChild(a);
    }

    load_problem(question, answers, problems[0]);
}

function load_problem(question, answers, problem) {
    question.innerHTML = problem[0];
    answers[0].innerHTML = problem[1];
    answers[1].innerHTML = problem[2];
    answers[2].innerHTML = problem[3];
    answers[3].innerHTML = problem[4];
}
