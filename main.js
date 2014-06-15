window.onload = function() {
    main()
};

function main() {
    var game = document.getElementById("game");

    var problems = [
        ["I try", "προσπαθώ", "προσπαδώ", "πρόσπαθω", "πρόσπαδω"],
    ];

    problems = problems.concat(make_translate_problems());

    var question = document.createElement("div");
    question.setAttribute("class", "question");

    var score = document.createElement("div");
    score.setAttribute("class", "score");
    score.innerHTML = "No score";

    var answers = [];
    var num_answers = 4;
    var current_correct_answer = 0;
    var next_problem = 0;
    var score_number = 0;
    var game_state = {
        "correct_answer": 0,
    };

    do_next_problem = function() {
        display_problem(
            question,
            answers,
            problems[next_problem],
            game_state);
        next_problem++;
        if (next_problem == problems.length) {
            next_problem = 0;
        }
    };

    make_process_answer_click = function(i) {
        return function() {
            // update score
            if (i == game_state["correct_answer"]) {
                score_number += 1;

                // sucess animation
                animate_bgcolor(score, [255, 255, 255], [0, 0, 0], 1000);
            }
            score.innerHTML = "score: " + score_number.toString();

            // transition to next problem
            do_next_problem();
        };
    };

    // setup the game elements
    game.appendChild(question);
    for (var i = 0; i < num_answers; i++) {
        a = document.createElement("div")
        a.setAttribute("class", "answer");
        a.onclick = make_process_answer_click(i);
        answers.push(a);
        game.appendChild(a);
    }
    game.appendChild(score);

    do_next_problem();
}

function make_translate_problems() {
    var translations = TRANSLATIONS;
    var problems = [];
    for (var i = 0; i < translations.length; ++i) {
        var choices = choose_n_excluding(translations, 3, i);
        var problem = [
            translations[i][0],
            translations[i][1],
            choices[0][1],
            choices[1][1],
            choices[2][1],
        ];
        problems.push(problem);
    }
    return problems;
}

function display_problem(question, answers, problem, game_state) {
    question.innerHTML = problem[0];

    ordering = [0, 1, 2, 3];
    shuffle_array(ordering);

    for (var i=0; i<4; ++i) {
        shuffled_i = ordering[i]
        answers[i].innerHTML = problem[shuffled_i + 1];
        if (shuffled_i == 0) {
            game_state["correct_answer"] = i;
        }
    }
}
