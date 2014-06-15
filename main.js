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
    var all_translations = expanded_translations(TRANSLATIONS);
    var tag_to_group = group_translations_by_tags(all_translations);
    var problems = [];
    for (var tag in tag_to_group) {
        var translations = tag_to_group[tag];
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
    }
    return problems;
}

function expanded_translations(translations) {
    var expanded = []
    for (var i = 0; i < translations.length; ++i) {
        var t = translations[i];
        var tag = t[2];
        if (is_string_in_list("gender-expand", tag)) {
            extend_array(expanded, expanded_gender(t));
        } else {
            expanded.push(t);
        }
    }
    return expanded;
}

function expanded_gender(t) {
    var expanded = [];
    var english = new String(t[0]);
    var greek = new String(t[1]);
    var tags = clone_list(t[2]);
    assert(is_string_in_list('masculine', tags));
    remove_string_from_list('gender-expand', tags);
    remove_string_from_list('masculine', tags);

    var unstressed_suffixes = ['ος', 'η', 'ο'];
    var stressed_suffixes = ['ός', 'ή', 'ό'];
    var suffixes = [];

    // assert ends in os, remove os
    if (string_ends_with(greek, unstressed_suffixes[0])) {
        suffixes = unstressed_suffixes;
    } else if (string_ends_with(greek, stressed_suffixes[0])) {
        suffixes = stressed_suffixes;
    } else {
        assert(false, 'unexpeced ending encountered: ' + greek);
    }
    greek = greek.slice(0, -2);

    expansions = [
        ['(m)', suffixes[0], 'masculine'],
        ['(f)', suffixes[1], 'feminine'],
        ['(n)', suffixes[2], 'neuter'],
    ];

    for (var i = 0; i < expansions.length; ++i) {
        e = expansions[i];
        expanded.push([
            english + ' ' + e[0],
            greek + e[1],
            list_with_appended(tags, e[2])]);
    }

    return expanded;
}

function group_translations_by_tags(translations) {
    var groups = {};
    for (var i = 0; i < translations.length; ++i) {
        var t = translations[i];
        var tag = t[2];
        if (!(tag in groups)) {
            groups[tag] = [];
        }
        groups[tag].push(t);
    }
    return groups;
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
