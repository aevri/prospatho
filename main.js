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

function make_range(maximum) {
    range = []
    for (var i = 0; i < maximum; ++i) {
        range.push(i);
    }
    return range;
}

function choose_n_excluding(choices, n, index) {
    var indices = make_range(choices.length);
    indices.splice(index, 1);
    var chosen = []
    for (var i = 0; i < n; ++i) {
        var index_index = random_int(indices.length);
        var chosen_index = indices[index_index];
        chosen.push(choices[chosen_index]);
        indices.splice(index_index, 1);
    }
    return chosen;
}

function make_translate_problems() {
    var translations = [
        ["I try", "προσπαθώ"],
        ["I bring", "φέρνω"],
        ["I go", "φεύγω"],
        ["I send", "στέλνω"],
        ["I wash", "πλένω"],
        ["I fall", "πέφτω"],
        ["I die", "πεθαίνω"],
        ["I take", "παίρνω"],
        ["I give", "δίνω"],
        ["I live", "ζω"],
        ["first (m)", "πρώτος"],
        ["first (f)", "πρώτη"],
        ["first (n)", "πρώτο"],
        ["second (m)", "δεύτερος"],
        ["second (f)", "δεύτερη"],
        ["second (n)", "δεύτερο"],
        ["third (m)", "τρίτος"],
        ["third (f)", "τρίτη"],
        ["third (n)", "τρίτο"],
        ["fourth (m)", "τέταρτος"],
        ["fourth (f)", "τέταρτη"],
        ["fourth (n)", "τέταρτο"],
        ["fifth (m)", "πέμπτος"],
        ["fifth (f)", "πέμπτη"],
        ["fifth (n)", "πέμπτο"],
        ["sixth (m)", "έκτος"],
        ["sixth (f)", "έκτη"],
        ["sixth (n)", "έκτο"],
        ["seventh (m)", "έβδομος"],
        ["seventh (f)", "έβδομη"],
        ["seventh (n)", "έβδομο"],
        ["eighth (m)", "όγδοος"],
        ["eighth (m)", "όγδοη"],
        ["eighth (m)", "όγδοο"],
        ["ninth (m)", "ένατος"],
        ["ninth (f)", "ένατη"],
        ["ninth (n)", "ένατο"],
        ["tenth (m)", "δέκατος"],
        ["tenth (f)", "δέκατη"],
        ["tenth (n)", "δέκατο"],
        ["eleventh (m)", "ενδέκατος"],
        ["eleventh (f)", "ενδέκατη"],
        ["eleventh (n)", "ενδέκατο"],
        ["twelfth (m)", "δωδέκατος"],
        ["twelfth (f)", "δωδέκατη"],
        ["twelfth (n)", "δωδέκατο"],
        ["thirteenth (m)", "δέκατος τρίτος"],
        ["fourteenth (m)", "δέκατος τέταρτος"],
        ["fifteenth (m)", "δέκατος πέμπτος"],
        ["sixteenth (m)", "δέκατος έκτος"],
        ["seventeenth (m)", "δέκατοσ έβδομος"],
        ["eighteenth (m)", "δέκατος όγδοος"],
        ["nineteenth (m)", "δέκατος ένατος"],
        ["twentieth (m)", "εικοστός"],
    ];
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
