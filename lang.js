/*jshint globalstrict: true*/
"use strict";

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

    if (is_string_in_list('masculine', tags)) {
        return expanded_masculine_noun(english, greek, tags);
    } else if (is_string_in_list('feminine', tags)) {
        return expanded_feminine_noun(english, greek, tags);
    } else if (is_string_in_list('neuter', tags)) {
        return expanded_neuter_noun(english, greek, tags);
    }
    assert(false, "could not expand noun: " + english);
}

function expanded_masculine_noun(english, greek, tags) {
    // TODO: fix stresses to last vowel
    var greek_suffixes = [
      ['ης', 'η', 'ες', 'ες'],
      ['ής', 'ή', 'ές', 'ές'],
      ['ας', 'α', 'ες', 'ες'],
      ['άς', 'ά', 'ές', 'ές'],
      ['ος', 'ο', 'οι', 'ους'],
      ['ός', 'ό', 'όι', 'όυς']
    ];

    var expansions = [
        ['The', '', 'ο', ['singular', 'nominative']],
        ['From the', '', 'από τον', ['singular', 'accusative']],
        ['The', 's', 'οι', ['plural', 'nominative']],
        ['From the', 's', 'από τους', ['plural', 'accusative']],
    ];

    return expanded_noun_util(
        english, greek, tags, greek_suffixes, 'ο', expansions);
}

function expanded_feminine_noun(english, greek, tags) {
    var greek_suffixes = [
      ['η', 'η', 'ες', 'ες'],
      ['ή', 'ή', 'ές', 'ές'],
      ['α', 'α', 'ες', 'ες'],
      ['ά', 'ά', 'ές', 'ές'],
    ];

    var expansions = [
        ['The', '', 'η', ['singular', 'nominative']],
        ['From the', '', 'από την', ['singular', 'accusative']],
        ['The', 's', 'οι', ['plural', 'nominative']],
        ['From the', 's', 'από τις', ['plural', 'accusative']],
    ];

    return expanded_noun_util(
        english, greek, tags, greek_suffixes, 'η', expansions);
}

function expanded_neuter_noun(english, greek, tags) {
    var greek_suffixes = [
      ['ι', 'ι', 'ια', 'ια'],
      ['ί', 'ί', 'ιά', 'ιά'],
      ['ο', 'ο', 'α', 'α'],
      ['ό', 'ό', 'ά', 'ά'],
      ['μα', 'μα', 'ματα', 'ματα'],
      // TODO: figure out what a stressed 'mata' ending should look like
    ];

    var expansions = [
        ['The', '', 'το', ['singular', 'nominative']],
        ['From the', '', 'από το', ['singular', 'accusative']],
        ['The', 's', 'τα', ['plural', 'nominative']],
        ['From the', 's', 'από τα', ['plural', 'accusative']],
    ];

    return expanded_noun_util(
        english, greek, tags, greek_suffixes, 'το', expansions);
}

function expanded_noun_util(
        english, greek, tags, greek_suffixes, greek_prefix, expansions) {
    var expanded = [];

    var ending_type = null;
    for (var i = 0; i < greek_suffixes.length; ++i) {
        if (string_ends_with(greek, greek_suffixes[i][0])) {
            assert(ending_type == null, 'ending type is not null');
            ending_type = i;
        }
    }
    assert(ending_type != null, 'ending type is null: ' + english);

    greek = string_without_prefix(greek, greek_prefix);
    greek = string_without_suffix(greek, greek_suffixes[ending_type][0]);

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

