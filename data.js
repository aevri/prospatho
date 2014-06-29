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
    ["I will leave", "θα φύγω"],
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
    ["I leave", "φεύγω"],
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
    ["eleventh", "εντέκατος"],
    ["twelfth", "δωδέκατος"],
    ["twentieth", "εικοστός"],
];

var MASCULINE_SINGULAR_NOUNS = [
    ["noun-expand", "noun", "masculine", "singular"],
    ["The lighter", "ο αναπτήρας"],
    ["The computer", "ο υπολογιστής"],
    ["The envelope", "ο φάκελος"],
    ["The garden", "ο κήπος"],
    ["The air / wind", "ο αέρας"],
    ["The man / husband", "ο άντρας"],
    ["The rock", "ο βράχος"],
];

var FEMININE_SINGULAR_NOUNS = [
    ["noun", "feminine", "singular"],
    ["the chair", "η καρέκλα"],
    ["the motorbike", "η μηχανή"],
    ["the television", "η τηλεόραση"],
    ["the newspaper", "η εφημερίδα"],
    ["England", "η Αγγλία"],
    ["the market", "η αγορά"],
    ["Athens", "η Αθήνα"],
    ["America", "η Αμερική"],
    ["the receipt", "η απόδειξη"],
    ["the diary / agenda", "η ατζέντα"],
    ["the courtyard", "η αυλή"],
    ["the vanilla", "η βανίλια"],
    ["the gasoline", "η βενζίνη"],
    ["the balcony / porch", "η βεράντα"],
    ["the night / evening", "η βραδιά"],
    ["Britain", "η Βριτανία"],
];

var NEUTER_SINGULAR_NOUNS = [
    ["noun", "neuter", "singular"],
    ["the statue", "το άγαλμα"],
    ["the wallet", "το πορτοφόλι"],
    ["the car", "το αυτοκίνητο"],
    ["the souvlaki", "το σουβλάκι"],
    ["the coin", "το κέρμα"],
    ["the house", "το σπίτι"],
    ["the book", "το βιβλίο"],
    ["the clock", "το ρολόι"],
    ["the egg", "το αβγό"],
    ["the cucumber", "το αγγούρι"],
    ["the airport", "το αεροδρόμιο"],
    ["the airplane", "το αεροπλάνο"],
    ["the salt", "το αλάτι"],
    ["the alphabet", "το αλφάβητο"],
    ["the refreshment", "το αναψυκτικό"],
    ["the pear", "το αχλάδι"],
    ["the vase", "το βάζο"],
    ["the apricot", "το βερίκοκο"],
    ["the video", "το βίντεο"],
    ["the mountain", "το βουνό"],
    ["the butter", "το βούτυρο"],
    ["the milk", "το γάλα"],
];

var QUESTIONS = [
    ["question"],
    ["how many? (m, nom)", "πόσοι;"],
    ["how many? (m, acc)", "πόσους;"],
    ["how many? (f)", "πόσες;"],
    ["how many? (n)", "πόσα;"],
]

var LISTS_TO_EXPAND = [
    TYPE_A_VERBS, FUTURE_VERBS, PRESENT_VERBS, ORDINALS,
    MASCULINE_SINGULAR_NOUNS, FEMININE_SINGULAR_NOUNS, NEUTER_SINGULAR_NOUNS,
    QUESTIONS
];

var TRANSLATIONS = [
];
