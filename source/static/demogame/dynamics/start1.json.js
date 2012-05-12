

// mountain path
API.add_warp(52, 0, 61, 1, 34, 124, "mountain_path.json");

// inn link
API.add_warp(98, 26, 99, 27, 13, 30, "inn.json");

// pub link
API.add_warp(54, 90, 55, 91, 23, 24, "bar.json");

// house1 link
API.add_warp(42, 56, 43, 57, 9, 34, "house1.json");

// house2 link
API.add_warp(26, 34, 27, 35, 51, 58, "house2.json");

// secret1 link
API.add_warp(28, 79, 29, 79, 16, 6, "secret1.json");


// cop-out wrap around
API.add_warp(127, 0, 128, 128, 2, 67, "start1.json");
API.add_warp(0, 0, 1, 128, 126, 39, "start1.json");



// add some stuff

API.create_barrel(96,55);



// add some characters

var alice = API.create_human(80, 70, "./_static/sprites/char_alice.png");
var pace = 1;
alice.on_timeout = function () {
    alice._move_to(alice.x + pace*10, alice.y);
    pace *= -1;
    if (!alice._deleted && !alice._is_player) {
        setTimeout(alice.on_timeout, 5000);
    }
};
alice.on_timeout();
alice.on_bumped = function (self, bumped_by) {
    alert("What a gorgeous day today :)");
    return true;
};
alice.on_lost_focus = function () { alice.on_timeout(); };

var bob = API.create_human(81, 36, "./_static/sprites/char_bob.png");
bob.on_bumped = function (self, bumped_by) {
    alert("Hi!  My name is Robert'); DROP TABLE Students;--");
    return true;
};
