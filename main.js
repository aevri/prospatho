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

function make_translate_problems() {
    var all_lists = expanded_lists(LISTS_TO_EXPAND);
    var all_translations = joined_lists(all_lists).concat(TRANSLATIONS);
    var translations = expanded_translations(all_translations);
    var problems = [];

    problems = problems.concat(
        make_pick_from_same_group_problems(
            translations));

    return problems;
}

function joined_lists(lists) {
    var joined = [];
    for (var i = 0; i < lists.length; ++i) {
        for (var j = 0; j < lists[i].length; ++j) {
            joined.push(lists[i][j]);
        }
    }
    return joined;
}

function expanded_lists(lists) {
    var expanded = [];
    for (var i = 0; i < lists.length; ++i) {
        expanded.push(expanded_list(lists[i]));
    }
    return expanded;
}

function expanded_list(list) {
    var expanded = [];
    var tags = list[0];
    for (var i = 1; i < list.length; ++i) {
        var translation = [
            list[i][0],
            list[i][1],
            tags
        ];
        expanded.push(translation);
    }
    return expanded;
}

function make_pick_from_same_group_problems(all_translations) {
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
    var expanded = [];
    for (var i = 0; i < translations.length; ++i) {
        var t = translations[i];
        var tag = t[2];
        if (is_string_in_list("gender-expand", tag)) {
            extend_array(expanded, expanded_gender(t));
        } else if (is_string_in_list("verb-expand", tag)) {
            extend_array(expanded, expanded_verb(t));
        } else if (is_string_in_list("noun-expand", tag)) {
            extend_array(expanded, expanded_noun(t));
        } else {
            expanded.push(t);
        }
    }
    return expanded;
}

function expanded_verb(t) {
    var expanded = [];
    var english = t[0].substr(0);
    var greek = t[1].substr(0);
    var tags = clone_list(t[2]);
    assert(is_string_in_list('verb-type-a', tags));
    remove_string_from_list('verb-expand', tags);
    remove_string_from_list('singular', tags);
    remove_string_from_list('first-person', tags);

    var english_prefixes = ['I', 'You', 'He/She/It', 'We', 'You(pl)', 'They'];
    var greek_suffixes = ['ω', 'εις', 'ει', 'ουμε', 'ετε', 'ουν(ε)'];

    english = string_without_prefix(english, english_prefixes[0]);
    greek = string_without_suffix(greek, greek_suffixes[0]);

    var expansions = [
        [english_prefixes[0], greek_suffixes[0], ['singular', 'first-person']],
        [english_prefixes[1], greek_suffixes[1], ['singular', 'second-person']],
        [english_prefixes[2], greek_suffixes[2], ['singular', 'third-person']],
        [english_prefixes[3], greek_suffixes[3], ['plural', 'first-person']],
        [english_prefixes[4], greek_suffixes[4], ['plural', 'second-person']],
        [english_prefixes[5], greek_suffixes[5], ['plural', 'third-person']],
    ];

    for (var i = 0; i < expansions.length; ++i) {
        var e = expansions[i];
        expanded.push([
            e[0] + english,
            greek + e[1],
            list_with_extended(tags, e[2])]);
    }

    return expanded;
}

function expanded_noun(t) {
    var english = t[0].substr(0);
    var greek = t[1].substr(0);
    var tags = clone_list(t[2]);
    assert(is_string_in_list('noun', tags));
    remove_string_from_list('noun-expand', tags);
    remove_string_from_list('singular', tags);
    remove_string_from_list('nominative', tags);

    english = string_without_prefix(english, 'The');

    return expanded_masculine_noun(english, greek, tags);
}

function expanded_masculine_noun(english, greek, tags) {
    var expanded = [];
    //remove_string_from_list('masculine', tags);

    // TODO: fix stresses to last vowel
    var greek_suffixes = [
      ['ης', 'η', 'ες', 'ες'],
      ['ής', 'ή', 'ές', 'ές'],
      ['ας', 'α', 'ες', 'ες'],
      ['άς', 'ά', 'ές', 'ές'],
      ['ος', 'ο', 'οι', 'ους'],
      ['ός', 'ό', 'όι', 'όυς']
    ];

    var ending_type = null;
    for (var i = 0; i < greek_suffixes.length; ++i) {
        if (string_ends_with(greek, greek_suffixes[i][0])) {
            assert(ending_type == null);
            ending_type = i;
        }
    }
    assert(ending_type != null);

    greek = string_without_prefix(greek, 'ο');
    greek = string_without_suffix(greek, greek_suffixes[ending_type][0]);

    var expansions = [
        ['The', '', 'ο', ['singular', 'nominative']],
        ['From the', '', 'από τον', ['singular', 'accusative']],
        ['The', 's', 'οι', ['plural', 'nominative']],
        ['From the', 's', 'από τους', ['plural', 'accusative']],
    ];

    for (var i = 0; i < expansions.length; ++i) {
        var e = expansions[i];
        expanded.push([
            e[0] + english + e[1],
            e[2] + greek + greek_suffixes[ending_type][i],
            list_with_extended(tags, e[3])]);
    }

    return expanded;
}

function expanded_gender(t) {
    var expanded = [];
    var english = t[0].substr(0);
    var greek = t[1].substr(0);
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

    var expansions = [
        ['(m)', suffixes[0], 'masculine'],
        ['(f)', suffixes[1], 'feminine'],
        ['(n)', suffixes[2], 'neuter'],
    ];

    for (var i = 0; i < expansions.length; ++i) {
        var e = expansions[i];
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
