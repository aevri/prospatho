window.onload = function() {
    main()
};

function lerp_int(from, to, t) {
    return Math.round(from + t * (to - from));
}

function lerp_int_triple(from, to, t) {
    return [
        lerp_int(from[0], to[0], t),
        lerp_int(from[1], to[1], t),
        lerp_int(from[2], to[2], t),
    ];
}

function rgb_string(values) {
    return "rgb(" + values[0] + ", " + values[1] + ", " + values[2] + ")";
}

function animate_bgcolor(elem, from, to, duration) {
    var start = new Date().getTime();
    timer = setInterval(function() {
        var now = new Date().getTime();
        var elapsed = now - start;
        var t = Math.min(1, elapsed / duration);
        var rgb = lerp_int_triple(from, to, t);
        elem.style.backgroundColor = rgb_string(rgb);
        if (t == 1) {
            clearInterval(timer);
        }
    }, 25);
    elem.style.backgroundColor = rgb_string(from);
}

function main() {
    var game = document.getElementById("game");

    var problems = [
        ["I try", "προσπαθώ", "προσπαδώ", "πρόσπαθω", "πρόσπαδω"],
        ["I bring", "φέρνω", "φερνώ", "φαίρνω", "φαιρνώ"],
        ["I go", "φεύγω", "φέυγω", "φευγώ", "φέβγω"],
        ["I send", "στέλνω", "φέρνω", "προσπαθώ", "φεύγω"],
        ["I wash", "πλένω", "στέλνω", "φέρνω", "προσπαθώ"],
        ["I fall", "πέφτω", "πλένω", "στέλνω", "φέρνω"],
        ["I die", "πεθαίνω", "πέφτω", "πλένω", "στέλνω"],
        ["I take", "παίρνω", "πεθαίνω", "πέφτω", "πλένω"],
        ["I give", "δίνω", "παίρνω", "πεθαίνω", "πέφτω"],
        ["I live", "ζω", "δίνω", "παίρνω", "πεθαίνω"],
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
