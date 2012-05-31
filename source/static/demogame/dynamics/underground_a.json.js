

// exits to mountain path
// upper entrance
API.add_warp(80, 29, 85, 29, 21, 6, "mountain_path.json");
// lower entrance
API.add_warp(12, 127, 16, 127, 35, 66, "mountain_path.json");

// warps within level
API.add_warp(9, 13, 9, 14, 98, 18, "underground_a.json");
API.add_warp(14, 28, 14, 29, 110, 48, "underground_a.json");

API.add_warp(99, 18, 99, 19, 10, 14, "underground_a.json");
API.add_warp(111, 47, 112, 48, 16, 28, "underground_a.json");

API.add_warp(120, 56, 121, 57, 74, 94, "underground_a.json");
API.add_warp(73, 93, 73, 94, 119, 57, "underground_a.json");


// add an ncp
API.instance("chest", 68, 102);


// some monsters
API.instance("slime", 21, 84);
API.instance("slime", 22, 18);
API.instance("bat", 7, 21);
API.instance("bat", 23, 68);

API.instance("eyeball", 90, 93);
API.instance("eyeball", 76, 100);

API.instance("slime", 88, 10);
API.instance("slime", 82, 15);