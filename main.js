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
        console.log(i);
        a.onclick = make_process_answer_click(i);
        answers.push(a);
        game.appendChild(a);
    }
    game.appendChild(score);

    do_next_problem();
}

function swap_array_items(a, i, j) {
    var temp = a[i];
    a[i] = a[j];
    a[j] = temp;
}

function random_int(less_than) {
    return Math.floor(Math.random() * less_than)
}

function shuffle_array(a) {
    for (var i=0; i<a.length; ++i) {
        var j = random_int(a.length);
        swap_array_items(a, i, j);
    }
}

function reordered_array(a, ordering) {
    new_a = [];
    for (var i=0; i<a.length; ++i) {
        new_a.push(a[ordering[i]]);
    }
    return new_a;
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
