
// Shhh... This is a secret 8^y


// exit
API.add_warp(16, 4, 17, 5, 28, 78, "start1.json");


// Secret derpy bat character!

var locus_x = 16;
var locus_y = 15;

var batmo = API.create_critter(
    locus_x, locus_y, "./_static/sprites/batty_bat.png", 32, 32, 3, true, 150);

batmo.on_bumped = function (self, bumped_by) {
    alert("I'm a hedgehog!");
    if (confirm("Become the derpy bat?")) {
        batmo._gain_input_focus();
    }
    return true;
};

batmo.on_timeout = function () {
    if (Math.round(Math.random()*10) == 10) {
        batmo.dir = Math.round(Math.random()*3);
    }
    switch (batmo.dir) {
    case 0:
        if (batmo.y - locus_y < -5) {
            batmo.dir = 2;
        }
        else {
            batmo.y -= .25;
        }
        break;
    case 1:
        if (batmo.x - locus_x < -5) {
            batmo.dir = 3;
        }
        batmo.x -= .25;
        break;
    case 2:
        if (batmo.y - locus_y > 5) {
            batmo.dir = 0;
        }
        else {
            batmo.y += .25;
        }
        break;
    case 3:
        if (batmo.x - locus_x > 5) {
            batmo.dir = 1;
        }
        else {
            batmo.x += .25;
        }
        break;
    }
    if (!batmo._deleted && !batmo._is_player) {
        setTimeout(batmo.on_timeout, 80);
    }
};
batmo.on_timeout();
batmo.on_lost_focus = function () { batmo.on_timeout(); };

