
// exit to start level
API.add_warp(30, 126, 38, 128, 56, 2, "start1.json");


// entrances to underground
// upper entrance
API.add_warp(20, 4, 24, 4, 81, 26, "underground_a.json");
// lower entrance
API.add_warp(34, 64, 37, 64, 13, 124, "underground_a.json");


// add an ncp
(function () {
    var chest = API.create_object(8, 10, "./_static/sprites/chests.png");
    API.store_default("chest", true);

    if (API.fetch("chest")) {
        chest._crop(0, 0, 32, 32);
    }
    else {
        chest._crop(0, 64, 32, 32);
    }

    chest.on_bumped = function (self, player) {
        if (API.fetch("chest")) {
            chest._crop(0, 64, 32, 32);
            alert("Woah!  You found something awesome!");
            API.store("chest", false)
            return true;
        }
    };
})();