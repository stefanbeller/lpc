


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
            "mouse_vector" : {"x":0, "y":0},
            "sprite" : undefined,
            "state" : undefined,
            "walk_speed" : 40,
            "walk_dist" : .5,
            "walking" : undefined
        }
    },

    "TIME" : {
        "walk" : -1
    },

    "CALL" : {
        /*
          Note, functions to do with physics assume that the x/y grid is
          of 16px squares.  Functions to do with tiles (just add_tile, 
          really) assume that the grid is of 32px squares!
         */

        "build_map" : undefined, // (mapdata)
        "get_wall" : undefined, // (x, y)
        "set_wall" : undefined, // (x, y)
        "wall_check" : undefined, // (x, y) <-- use instead of get_wall!
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

    LPCD.DATA.player.sprite = new Image();
    LPCD.DATA.player.sprite.src = "./sprites/char_template.png";

    jQuery.getJSON("./levels/start1.json", LPCD.EVENT.map_ready);
});




/******************************************************************************

  Liberated Pixel Cup Demo: "Bag of functions"

 ******************************************************************************/


// "wall_check" is used for intelligent collision detection.
LPCD.CALL.wall_check = function (x, y) {
    "use strict";

    var i = Math.round(x);
    var k = Math.round(y);
    return LPCD.CALL.get_wall(i, k) || LPCD.CALL.get_wall(i+1, k);
}


// "get_wall" is used for collision detection.  Use wall_check instead.
LPCD.CALL.get_wall = function (x, y) {
    "use strict";

    var raw = LPCD.DATA.level.walls[String(x)+","+String(y)];
    return raw !== undefined ? true : false;    
};


// "set_wall" is used to add single a wall block.
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
        var _x = 0;
        var _y = 0;
        for (var k=0; k<layer.data.length; k+=1) {
            if (layer.data[k] > 0) {
                var tile = mapdata.lookup_tile(layer.data[k]);
                if (tile !== false) {
                    var target = layer.properties.target === undefined ? "below" : layer.properties.target;
                    LPCD.CALL.add_tile(tile.sx, tile.sy, _x, _y, tile.uri, target);
                    if (layer.properties.is_walls !== undefined && layer.properties.is_walls > 0) {
                        // layer wall info has priority
                        LPCD.CALL.set_wall(_x*2,_y*2);
                        LPCD.CALL.set_wall(_x*2,_y*2+1);
                        LPCD.CALL.set_wall(_x*2+1,_y*2+1);
                        LPCD.CALL.set_wall(_x*2+1,_y*2);
                    }
                    else if (tile.props !== undefined && tile.props.wall !== undefined) {
                        // otherwise use the semantic value give to the wall
                        var points;
                        switch ( tile.props.wall ) {
                        case "a":
                            points = [[0,0],[0,1],[1,0],[1,1]];
                            break;
                        case "nw":
                            points = [[0,0]];
                            break;
                        case "n":
                            points = [[0,0],[1,0]];
                            break;
                        case "ne":
                            points = [[1,0]];
                            break;
                        case "e":
                            points = [[1,0], [1,1]];
                            break;
                        case "se":
                            points = [[1,1]];
                            break;
                        case "s":
                            points = [[0,1],[1,1]];
                            break;
                        case "sw":
                            points = [[0,1]];
                            break;
                        case "w":
                            points = [[0,0],[0,1]];
                            break;
                        default:
                            points = [];
                        }
                        for (var j=0; j<points.length; j+=1) {
                            LPCD.CALL.set_wall(_x*2+points[j][0], _y*2+points[j][1]);
                        }
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
        mapdata.tilesets[i].get = function (gid) {
            var within = gid - this.firstgid;
            var x = within % this._w;
            var props;
            if (this.tileproperties !== undefined) {
                props = this.tileproperties[within];
            }
            return {"props":props, "sx":x, "sy":((within-x)/this._w)};
        }
    }
    mapdata.lookup_tile = function (gid) {
        for (var i=0; i<mapdata.tilesets.length; i+=1) {
            var tileset = mapdata.tilesets[i];
            if (tileset.has(gid)) {
                var tile = tileset.get(gid);
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
    player.x = 32;
    player.y = 32;
    player.state = 0;
    player.dir = 2;

    player.el = LPCD.DOM.doc.createElement("canvas");
    player.el.id = "player";
    player.el.width = 32;
    player.el.height = 48;
    LPCD.DOM.doc.body.appendChild(player.el);
    player.ctx = player.el.getContext("2d");

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
    var view_width = $("#lpcd_iframe").width();
    var view_height = $("#lpcd_iframe").height();

    var sx = (Math.round((event_x/16)) - Math.ceil(view_width/32))-1;
    var sy = (Math.round((event_y/16)+.5) - Math.ceil(view_height/32))-1;
    console.info(sx);
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
    var next_x, next_y, stop, check, other;
    var dist = Math.sqrt(Math.pow(player.walking.x - player.x,2) + Math.pow(player.walking.y - player.y, 2));
    var no_rotate = false;
    var delta = function (n1, n2) {
        return Math.sqrt(Math.pow((n2-n1), 2));
    }
    if (dist < .5) {
        next_x = player.walking.x;
        next_y = player.walking.y;
        stop = true;
    }
    else {
        var a = player.walk_dist/dist;
        next_x = player.x*(1.0-a) + player.walking.x*a;
        next_y = player.y*(1.0-a) + player.walking.y*a;
        if (next_x !== player.x) {
            if (next_x < player.x) {
                check = Math.floor;
                other = Math.ceil;
            }
            else {
                check = Math.ceil;
                other = Math.floor;
            }
            if (LPCD.CALL.wall_check(check(next_x), next_y) > 0) {
                next_x = other(next_x);
                if (delta(next_y, player.y) <= .05) {
                    stop = true;
                }
            }
        }
        if (next_y !== player.y) {
            if (next_y < player.y) {
                check = Math.floor;
                other = Math.ceil;
            }
            else {
                check = Math.ceil;
                other = Math.floor;
            }
            if (LPCD.CALL.wall_check(next_x, check(next_y)) > 0) {
                next_y = other(next_y);
                if (delta(next_x, player.x) <= .05) {
                    stop = true;
                }
            }
        }
        if (next_x === player.x && next_y === player.y) {
            stop = true;
        }
    }

    if (LPCD.CALL.wall_check(next_x, next_y)) {
        // hit a wall
        player.x = Math.round(player.x);
        player.y = Math.round(player.y);
        stop = true;
    }
    else {
        if(!no_rotate && !stop) {
            // determine the character's facing
            if (next_x >= player.x && next_y <= player.y) {
                // north east
                player.dir = delta(player.x, next_x) > delta(player.y, next_y) ? 3 : 0;
            }
            else if (next_x <= player.x && next_y <= player.y) {
                // north east
                player.dir = delta(player.x, next_x) > delta(player.y, next_y) ? 1 : 0;
            }
            else if (next_x <= player.x && next_y >= player.y) {
                // north east
                player.dir = delta(player.x, next_x) > delta(player.y, next_y) ? 1 : 2;
            }
            else if (next_x >= player.x && next_y >= player.y) {
                // north east
                player.dir = delta(player.x, next_x) > delta(player.y, next_y) ? 3 : 2;
            }
        }

        player.x = next_x;
        player.y = next_y;
    }

    if (stop) {
        player.state = 0;
        player.walking = undefined;
        LPCD.TIME.walk = -1;
        clearTimeout(LPCD.TIME.walk);
    }
    else {
        // update animation step
        player.state += 1;
        if (player.state > 8) {
            player.state = 1;
        }
        
        // schedule next walk iteration
        LPCD.TIME.walk = setTimeout(LPCD.EVENT.on_walk, player.walk_speed);
    }
    
    LPCD.EVENT.on_redraw();
};


// "on_redraw" moves sprites around when the player's coordinates change.
LPCD.EVENT.on_redraw = function () {
    "use strict";
    var player = LPCD.DATA.player;
    player.ctx.clearRect(0, 0, 32, 48);
    player.ctx.drawImage(player.sprite, player.state*32, player.dir*48, 32, 48, 0, 0, 32, 48);

    var boards = ["below", "above"];
    for (var i=0; i<boards.length; i+=1) {
        var board = LPCD.DOM.doc.getElementById("layer_"+boards[i]);
        board.style.marginLeft = String(-.5*player.x) + "em";
        board.style.marginTop = String(-.5*player.y) + "em";
    }
};