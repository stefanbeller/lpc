

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



// add some fun stuff

var batmo = API.create_critter(96, 55, "sprites/batty_bat.png", 32, 32, 3, true, 150);

batmo.on_bumped = function (self, bumped_by) {
    alert("I'm a hedgehog!");
    return true;
};

var locus_x = 86;
var locus_y = 57;
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
    if (!batmo._deleted) {
        setTimeout(batmo.on_timeout, 80);
    }
};
batmo.on_timeout();


var lady = API.create_human(80, 70, "sprites/char_template.png");
lady._move_speed = 60;
var pace = 1;
lady.on_timeout = function () {
    lady._move_to(lady.x + pace*10, lady.y);
    pace *= -1;
    if (!lady._deleted) {
        setTimeout(lady.on_timeout, 5000);
    }
};
lady.on_timeout();
lady.on_bumped = function (self, bumped_by) {
    alert("Goddammit Javascript...");
    return true;
};