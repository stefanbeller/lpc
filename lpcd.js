


/******************************************************************************

   Liberated Pixel Cup Demo: Symbol Table

 ******************************************************************************/
var LPCD = {
    "DOM" : {
        "doc" : undefined,
        "res" : {},
        "layers" : {}
    },

    "DATA" : {
        "ready" : false,
        "level" : {
            "debug" : undefined,
            "walls" : {},
            "min_x" : undefined,
            "max_x" : undefined,
            "min_y" : undefined,
            "max_y" : undefined
        },
        "player" : {
            "x" : undefined,
            "y" : undefined,
            "dir" : undefined,
            "el" : undefined,
            "sprite" : undefined,
            "state" : undefined,
            "walk_speed" : 50,
            "walk_dist" : .5,
            "walking" : undefined
        }
    },

    "TIME" : {
        "walk" : -1
    },

    "CALL" : {
        "build_map" : undefined, // (mapdata)
        "get_wall" : undefined, // (x, y)
        "set_wall" : undefined, // (x, y)
        "add_tile" : undefined, // (sx, sy, dx, dy, uri, layer)
    },
    
    "EVENT" : {
        "on_click" : undefined,
        "on_redraw" : undefined,
        "on_walk" : undefined,
        "map_ready" : undefined,
        "make" : undefined
    }
};


// low-level initialization event...
$(document).ready(function () {
    "use strict";
    var doc = LPCD.DOM.doc = $("#lpcd_iframe").contents()[0];
    doc.head.innerHTML += '<link rel="stylesheet" type="text/css" href="lpcd.css" />';
    doc.body.style.backgroundColor = "black";
    doc.body.style.color = "white";
    doc.body.style.textAlign = "center";
    doc.body.innerHTML="<h1 id='text_overlay'>loading...</h1>";
    jQuery.getJSON("./levels/start1.json", LPCD.EVENT.map_ready);
});




/******************************************************************************

  Liberated Pixel Cup Demo: "Bag of functions"

 ******************************************************************************/


// "get_wall" is used for collision detection.
LPCD.CALL.get_wall = function (x, y) {
    "use strict";

    var test = function (_x, _y) {
        var raw = LPCD.DATA.level.walls[String(_x)+","+String(_y)];
        return raw !== undefined ? true : false;    
    };

    //return test(Math.floor(x), Math.floor(y)) || test(Math.ceil(x), Math.ceil(y));
    return test(Math.round(x), Math.round(y));
};


// "set_wall" is used to add single a wall block.  Use "drop" instead, please.
LPCD.CALL.set_wall = function (x, y) {
    "use strict";

    var _x = Math.round(x);
    var _y = Math.round(y);
    LPCD.DATA.level.walls[String(_x)+","+String(_y)] = true;
};


// "add_tile" blits a tile into a tile layer.
LPCD.CALL.add_tile = function (sx, sy, dx, dy, uri, layer) {
    "use strict";
    
    var canvas = LPCD.DOM.layers[layer];
    var img = LPCD.DOM.res[uri];
    canvas.ctx.drawImage(img, sx*32, sy*32, 32, 32, dx*32, dy*32, 32, 32);
};


// "build_map" takes map data and creates game objects from it.
// Must be called after image resources are ready.
LPCD.CALL.build_map = function (mapdata) {
    "use strict";
    var level = LPCD.DATA.level;  // shorthand
    level.debug = mapdata;

    for (var i=0; i<mapdata.layers.length; i+=1) {
        var layer = mapdata.layers[i];
        console.info("processing layer: " + layer.name);
        var _x = 0;
        var _y = 0;
        for (var k=0; k<layer.data.length; k+=1) {
            if (layer.data[k] > 0) {
                var tile = mapdata.lookup_tile(layer.data[k]);
                if (tile !== false) {
                    var target = layer.properties.target === undefined ? "below" : layer.properties.target;
                    LPCD.CALL.add_tile(tile.sx, tile.sy, _x, _y, tile.uri, target);
                    if (layer.properties.is_walls !== undefined && layer.properties.is_walls > 0) {
                        LPCD.CALL.set_wall(_x, _y);
                    }
                }
                else {
                    console.info("no such tile: " + layer.data[k]);
                }
            }
            _x += 1;
            if (_x == mapdata.width) {
                _y += 1;
                _x = 0;
            }
        }
    }
};




/******************************************************************************

  Liberated Pixel Cup Demo: Callbacks

 ******************************************************************************/


// "map_ready" is called when map data is available.  It is responsible for
// fetching images;  when all needed images are loaded, the "make" event is
// then called and mouse events are bound.
LPCD.EVENT.map_ready = function (mapdata, status) {
    var pending = 0;
    var hold = true;
    var make_it_so = function () {
        LPCD.CALL.build_map(mapdata);
        LPCD.EVENT.make();
        LPCD.DOM.doc.body.onclick = LPCD.EVENT.on_click;
    };
    var image_loaded = function () {
        pending -= 1;
        console.info("image loaded: " + this.src);
        if (pending === 0 && !hold) {
            make_it_so();
        }
    }
    if (mapdata.orientation !== "orthogonal") {
        throw("This demo only supports orthogonal maps!");
    }
    for (var i=0; i<mapdata.tilesets.length; i+=1) {
        var tileset = mapdata.tilesets[i];
        var img_path = tileset.image;
        if (img_path.indexOf("../sprites/") === 0) {
            img_path = img_path.slice(1);
        }
        pending += 1;
        LPCD.DOM.res[tileset.image] = new Image();
        LPCD.DOM.res[tileset.image].onload = image_loaded;
        LPCD.DOM.res[tileset.image].src = img_path;

        // add some extra functions to help level construction later on
        mapdata.tilesets[i]._w = Math.floor(tileset.imagewidth/32);
        mapdata.tilesets[i]._h = Math.floor(tileset.imageheight/32);
        mapdata.tilesets[i]._count = tileset._w * tileset._h;
        mapdata.tilesets[i].has = function (gid) {
            return gid >= this.firstgid && gid < this.firstgid + this._count;
        };
        mapdata.tilesets[i].coords = function (gid) {
            var within = gid - this.firstgid;
            var x = within % this._w;
            return {"sx":x, "sy":((within-x)/this._w)};
        }
    }
    mapdata.lookup_tile = function (gid) {
        for (var i=0; i<mapdata.tilesets.length; i+=1) {
            var tileset = mapdata.tilesets[i];
            if (tileset.has(gid)) {
                var tile = tileset.coords(gid);
                tile.uri = tileset.image;
                return tile;
            }
        }
        return false;
    }
    LPCD.DATA.level = {
        "walls" : {},
        "min_x" : 0,
        "min_y" : 0,
        "max_x" : mapdata.width,
        "max_y" : mapdata.height
    };
    LPCD.DOM.layers = {};
    var setup_layer = function (name) {
        var el = LPCD.DOM.doc.createElement("canvas");
        el.ctx = el.getContext('2d');
        el.width = 32 * mapdata.width;
        el.height = 32 * mapdata.height;
        el.id = "layer_"+name;
        LPCD.DOM.layers[name] = el;
        LPCD.DOM.doc.body.appendChild(el);
    };
    setup_layer("above");
    setup_layer("below");
    
    hold = false;
    if (pending === 0) {
        make_it_so();
    }
};


// "make" is used to build the level, bootstrap the game, and start the demo.
LPCD.EVENT.make = function () {
    "use strict";
    
    // set the player stats:
    var player = LPCD.DATA.player;
    player.x = 16;
    player.y = 16;

    player.el = LPCD.DOM.doc.createElement("div");
    player.el.id = "player";
    player.el.setAttribute("class", "placeholder");
    LPCD.DOM.doc.body.appendChild(player.el);
    
    //LPCD.DOM.doc.body.style.backgroundColor = "transparent";
    //LPCD.DOM.doc.body.style.color = "inherit";
    LPCD.DOM.doc.getElementById("text_overlay").style.display = "none";
    LPCD.EVENT.on_redraw();
};


// "on_click" happens when the iframe is clicked on.
// This function attempts to determine the world coordinates for that click,
// and initiates a walk cycle.
LPCD.EVENT.on_click = function (event) {
    "use strict";
    var player = LPCD.DATA.player;

    var event_x = event.x || event.clientX;
    var event_y = event.y || event.clientY;

    var sx = Math.round(event_x/32) - Math.ceil($("#lpcd_iframe").width()/64);
    var sy = Math.round(event_y/32) - Math.ceil($("#lpcd_iframe").height()/64);
    var x = Math.round(sx + player.x);
    var y = Math.round(sy + player.y);

    if (player.walking === undefined || (x !== player.x && y !== player.y)) {
        LPCD.DATA.player.walking = {"x":x, "y":y};
    }

    if (LPCD.TIME.walk === -1) {
        LPCD.TIME.walk = setTimeout(LPCD.EVENT.on_walk, player.walk_speed);
    }
};


// "on_walk" is called periodically for both animation and player movement
LPCD.EVENT.on_walk = function () {
    "use strict";
    var player = LPCD.DATA.player;
    var next_x, next_y;
    var dist = Math.sqrt(Math.pow(player.walking.x - player.x,2) + Math.pow(player.walking.y - player.y, 2));
    
    if (String(dist) === "NaN") {
        player.walking = undefined;
        LPCD.TIME.walk = -1;
        throw ("Move distance is not a number...????");
    }

    if (dist <= .5) {
        next_x = player.walking.x;
        next_y = player.walking.y;
        player.walking = undefined;
        LPCD.TIME.walk = -1;
    }

    else {
        var a = player.walk_dist/dist;
        next_x = player.x*(1.0-a) + player.walking.x*a;
        next_y = player.y*(1.0-a) + player.walking.y*a;
        LPCD.TIME.walk = setTimeout(LPCD.EVENT.on_walk, player.walk_speed);
    }

    if (LPCD.CALL.get_wall(next_x, next_y) == 0) {
        // ok to advance
        player.x = next_x;
        player.y = next_y;
    }
    else {
        // hit a wall
        clearTimeout(LPCD.TIME.walk);
        player.walking = undefined;
        LPCD.TIME.walk = -1;
        player.x = Math.round(player.x);
        player.y = Math.round(player.y);   
    }
    
    LPCD.EVENT.on_redraw();
};


// "on_redraw" moves sprites around when the player's coordinates change.
LPCD.EVENT.on_redraw = function () {
    "use strict";
    var player = LPCD.DATA.player;
    var boards = ["below", "above"];
    for (var i=0; i<boards.length; i+=1) {
        var board = LPCD.DOM.doc.getElementById("layer_"+boards[i]);
        board.style.marginLeft = String(-1*player.x) + "em";
        board.style.marginTop = String(-1*player.y) + "em";
    }
};