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

