/*jshint globalstrict: true*/
"use strict";

var TYPE_A_VERBS = [
    ["verb-expand", "verb-type-a", "future-tense", "first-person", "singular"],
    ["I will turn", "θα γυρίσω"],
    ["I will close", "θα κλείσω"],
    ["I will arrive", "θα φτάνω"],
    ["I will look", "θα κοιτάξω"],
];

var FUTURE_VERBS = [
    ["verb", "future-tense", "first-person", "singular"],
    ["I will bring", "θα φέρω"],
    ["I will go", "θα φύγω"],
    ["I will send", "θα στείλω"],
    ["I will wash", "θα πλύνω"],
    ["I will fall", "θα πέσω"],
    ["I will die", "θα πεθάνω"],
    ["I will take", "θα πάρνω"],
    ["I will give", "θα δώσω"],
    ["I will live", "θα ζήσω"],
    ["I will live/stay", "θα μείνω"],
    ["I will put", "θα βάλω"],
    ["I will remove", "θα βγάλω"],
    ["I will learn", "θα μάθω"],
    ["I will suffer", "θα πάθω"],
    ["I will enter", "θα μπω"],
    ["I will burn", "θα κάψω"],
    ["I will cry", "θα κλάψω"],
    ["I will rise", "θα ανεβώ"],
    ["I will descend", "θα κατεβώ"],
    ["I will understand", "θα καταλαβώ"],
    ["I will see", "θα δω"],
    ["I will say", "θα πω"],
    ["I will eat", "θα φάω"],
    ["I will drink", "θα πίω"],
    ["I will find", "θα βρω"],
    ["I will go out", "θα βγω"],
];

var PRESENT_VERBS = [
    ["verb", "present-tense", "first-person", "singular"],
    ["I bring", "φέρνω"],
    ["I go", "φεύγω"],
    ["I send", "στέλνω"],
    ["I wash", "πλένω"],
    ["I fall", "πέφτω"],
    ["I die", "πεθαίνω"],
    ["I take", "παίρνω"],
    ["I give", "δίνω"],
    ["I live", "ζω"],
    ["I live/stay", "μένω"],
    ["I put", "βάζω"],
    ["I remove", "βγάζω"],
    ["I learn", "μαθαίνω"],
    ["I suffer", "παθαίνω"],
    ["I enter", "μπαίνω"],
    ["I burn", "καίω"],
    ["I cry", "κλαίω"],
    ["I rise", "ανεβαίνω"],
    ["I descend", "κατεβαίνω"],
    ["I understand", "καταλαβαίνω"],
    ["I see", "βλέπω"],
    ["I say", "λέω"],
    ["I eat", "τρώω"],
    ["I drink", "πίνω"],
    ["I find", "βρίσκω"],
    ["I go out", "βγαίνω"],
    ["I look", "κοιτάζω"],
    ["I know", "ξέρω"],
    ["I close", "κλείνω"],
    ["I have", "έχω"],
];

var ORDINALS = [
    ["gender-expand", "masculine", "ordinal"],
    ["first", "πρώτος"],
    ["second", "δεύτερος"],
    ["third", "τρίτος"],
    ["fourth", "τέταρτος"],
    ["fifth", "πέμπτος"],
    ["sixth", "έκτος"],
    ["seventh", "έβδομος"],
    ["eighth", "όγδοος"],
    ["ninth", "ένατος"],
    ["tenth", "δέκατος"],
    ["eleventh", "ενδέκατος"],
    ["twelfth", "δωδέκατος"],
    ["twentieth", "εικοστός"],
];

var LISTS_TO_EXPAND = [
    TYPE_A_VERBS, FUTURE_VERBS, PRESENT_VERBS, ORDINALS,
];

var TRANSLATIONS = [
];
