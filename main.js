/*jshint globalstrict: true*/
"use strict";

window.onload = function() {
    main();
};

function main() {
    var game = document.getElementById("game");

    var problems = [
        ["I try", "προσπαθώ", "προσπαδώ", "πρόσπαθω", "πρόσπαδω"],
    ];

    var auto_problems = make_translate_problems();
    shuffle_array(auto_problems);
    problems = problems.concat(auto_problems);

    var ui = make_ui();

    var current_correct_answer = 0;
    var current_problem = 0;
    var next_problem = 0;
    var min_level = get_min_level(problems);
    var game_state = {
        correct_answer: 0,
    };

    var do_next_problem = function() {
        var level = null;
        do {
            if (next_problem == problems.length) {
                next_problem = 0;
                min_level = get_min_level(problems);
            }
            current_problem = next_problem;
            next_problem++;
            level = get_problem_level(problems[current_problem][0]);
        }
        while (level > min_level);
        display_problem(
            ui, problems[current_problem], game_state, level);
    };

    var process_answer_typed = function() {
        // update score
        var delay = 2000;
        ui.textinput_expected.innerHTML = game_state.correct_answer;
        if (ui.textinput.value == game_state.correct_answer) {
            update_problem_on_success(problems[current_problem]);

            // sucess animation
            animate_bgcolor(
                ui.textinput_div, [0, 255, 128], [64, 64, 64], delay);
        } else {
            update_problem_on_fail(problems[current_problem]);
            // fail animation
            delay = 6000;
            animate_bgcolor(
                ui.textinput_div, [255, 0, 64], [64, 64, 64], delay);
        }

        // transition to next problem
        setTimeout(do_next_problem, delay);
    };

    var process_answer_click = function(i) {
        // update score
        var delay = 1000;
        if (i == game_state.correct_answer) {
            update_problem_on_success(problems[current_problem]);

            // sucess animation
            animate_bgcolor(
                ui.answers[i], [0, 255, 128], [64, 64, 64], delay);
        } else {
            update_problem_on_fail(problems[current_problem]);
            // fail animation
            delay = 5000;
            animate_bgcolor(
                ui.answers[game_state.correct_answer],
                [0, 255, 128],
                [64, 64, 64],
                delay);
            animate_bgcolor(
                ui.answers[i],
                [255, 0, 64],
                [64, 64, 64],
                delay / 5);
        }

        // transition to next problem
        setTimeout(do_next_problem, delay);
    };

    ui.click_callback = process_answer_click;
    ui.textinput_callback = process_answer_typed;

    // setup the game elements
    game.appendChild(ui.div);

    do_next_problem();
}

function get_min_level(problems) {
    var min_level = null;
    for (var i = 0; i < problems.length; ++i) {
        var level = get_problem_level(problems[i][0]);
        if (min_level == null || level < min_level) {
            min_level = level;
        }
    }
    assert(min_level != null);
    return min_level;
}

function update_problem_on_success(problem) {
    var problem_name = problem[0];
    var problem_level = get_problem_level(problem_name);
    problem_level += 1;
    set_problem_level(problem_name, problem_level);
}

function update_problem_on_fail(problem) {
    var problem_name = problem[0];
    var problem_level = get_problem_level(problem_name);
    problem_level -= 1;
    if (problem_level < 0) {
        problem_level = 0;
    }
    set_problem_level(problem_name, problem_level);
}

function set_problem_level(problem_name, value) {
    var problem_data = localStorage.getItem(problem_name);
    if (problem_data == null) {
        problem_data = {};
    } else {
        problem_data = JSON.parse(problem_data);
    }
    problem_data["level"] = value;
    localStorage.setItem(problem_name, JSON.stringify(problem_data));
}

function get_problem_level(problem_name) {
    var problem_data = localStorage.getItem(problem_name);
    if (problem_data == null) {
        return 0;
    }
    problem_data = JSON.parse(problem_data);
    if (!("level" in problem_data)) {
        return 0;
    }
    return problem_data["level"];
}

function make_ui() {
    var ui = {
        div: null,
        question: null,
        level: null,
        answers: [],
        answers_div: null,
        textinput_div: null,
        textinput: null,
        textinput_expected: null,
        textinput_callback: null,
        click_callback: null
    };

    ui.div = document.createElement("div");

    ui.question = document.createElement("div");
    ui.question.setAttribute("class", "question");

    ui.level = document.createElement("div");
    ui.level.setAttribute("class", "level");
    ui.level.innerHTML = "No level";

    ui.div.appendChild(ui.question);

    var make_click_callback = function(index) {
        return function() {
            ui.click_callback(index);
        }
    };

    ui.textinput_div = document.createElement("div");
    ui.textinput_div.setAttribute("class", "entry");
    ui.textinput = document.createElement("input");
    ui.textinput.type = "text";
    ui.textinput.setAttribute("autocomplete", "off");
    ui.textinput.setAttribute("autocorrect", "off");
    ui.textinput.setAttribute("autocapitalize", "off");
    ui.textinput.setAttribute("spellcheck", "off");
    ui.textinput.onkeyup = function(e) {
        var enter_key = 13;
        if (e.which == enter_key){
            ui.textinput_callback();
        }
    };
    ui.textinput_expected = document.createElement("div");
    ui.textinput_expected.setAttribute("class", "expected");
    ui.textinput_div.appendChild(ui.textinput);
    ui.textinput_div.appendChild(ui.textinput_expected);
    ui.textinput_div.style.display = 'none';
    ui.div.appendChild(ui.textinput_div);

    var num_answers = 4;
    ui.answers_div = document.createElement("div");
    for (var i = 0; i < num_answers; i++) {
        var a = document.createElement("div");
        a.setAttribute("class", "answer");
        a.onclick = make_click_callback(i);
        ui.answers.push(a);
        ui.answers_div.appendChild(a);
    }
    ui.answers_div.style.display = 'none';
    ui.div.appendChild(ui.answers_div);

    ui.div.appendChild(ui.level);

    ui.show_answers = function() {
        ui.answers_div.style.display = 'block';
        ui.textinput_div.style.display = 'none';
        document.activeElement.blur();
    };

    ui.show_textinput = function() {
        ui.textinput_div.style.display = 'block';
        ui.answers_div.style.display = 'none';

        // looks like this won't help on Apple mobile devices:
        // http://stackoverflow.com/questions/12204571/mobile-safari-
        //   javascript-focus-method-on-inputfield-only-works-with-click
        ui.textinput.focus();
    };

    return ui;
}

function display_problem(ui, problem, game_state, level) {
    ui.question.innerHTML = problem[0];

    if (level == 0) {
      set_bgcolor(ui.question, [0, 0, 0]);
    } else if (level == 1) {
      set_bgcolor(ui.question, [0, 64, 32]);
    } else if (level == 2) {
      set_bgcolor(ui.question, [64, 0, 32]);
    } else if (level == 3) {
      set_bgcolor(ui.question, [32, 0, 64]);
    } else {
      set_bgcolor(ui.question, [64, 0, 64]);
    }

    if (level == 0) {
        var ordering = [0, 1, 2, 3];
        shuffle_array(ordering);

        for (var i=0; i<4; ++i) {
            var shuffled_i = ordering[i];
            ui.answers[i].innerHTML = problem[shuffled_i + 1];
            if (shuffled_i === 0) {
                game_state.correct_answer = i;
            }
        }
        ui.show_answers();
    } else {
        game_state.correct_answer = problem[1];
        ui.textinput_expected.innerHTML = "";
        ui.textinput.value = "";
        ui.show_textinput();
    }
    ui.level.innerHTML = "level: " + level.toString();
}
