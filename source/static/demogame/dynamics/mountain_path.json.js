
// exit to start level
API.add_warp(30, 126, 38, 128, 56, 2, "start1.json");


// entrances to underground
// upper entrance
API.add_warp(20, 4, 24, 4, 81, 26, "underground_a.json");
// lower entrance
API.add_warp(34, 64, 37, 64, 13, 124, "underground_a.json");


// add an ncp
API.instance("chest", 8, 10);


// add some critters
API.instance("bat", 44, 115);
API.instance("bat", 27, 107);
API.instance("bee", 24, 91);
API.instance("worm", 31, 73);

API.instance("worm", 20, 23);
API.instance("worm", 29, 32);
API.instance("bat", 46, 17);