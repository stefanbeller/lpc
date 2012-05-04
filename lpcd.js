


/******************************************************************************

   Liberated Pixel Cup Demo: Symbol Table

 ******************************************************************************/
var LPCD = {
    "DOM" : {
        "buffer" : "",
        "doc" : undefined
    },

    "DATA" : {
        "ready" : false,
        "level" : {
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
        "get_wall" : undefined, // (x, y)
        "set_wall" : undefined, // (x, y)
        "drop" : undefined // (x, y, w, h, gfx_cue, [phys_cue])
    },
    
    "EVENT" : {
        "on_click" : undefined,
        "on_redraw" : undefined,
        "on_walk" : undefined,
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
    doc.body.innerHTML="<h1>loading...</h1>";

    // ideally queue up some graphics to be loaded and have the following stuff
    // happen on the callback
    LPCD.EVENT.make();

    // attach click event
    doc.body.onclick = LPCD.EVENT.on_click;
});




/******************************************************************************

  Liberated Pixel Cup Demo: "Bag of functions"

 ******************************************************************************/


// "get_wall" is used for collision detection.
LPCD.CALL.get_wall = function (x, y) {
    "use strict";

    var _x = Math.round(x);
    var _y = Math.round(y);
    var raw = LPCD.DATA.level.walls[String(_x)+","+String(_y)];
    return raw !== undefined ? true : false;
};


// "set_wall" is used to add single a wall block.  Use "drop" instead, please.
LPCD.CALL.set_wall = function (x, y) {
    "use strict";

    var _x = Math.round(x);
    var _y = Math.round(y);
    LPCD.DATA.level.walls[String(_x)+","+String(_y)] = true;
};


// "drop" is used for procedural level creation.
LPCD.CALL.drop = function (x, y, w, h, gfx_cue, phys_cue) {
    "use strict";

    var level = LPCD.DATA.level;  // shorthand

    var wall = phys_cue !== undefined && !!phys_cue ? true : false;
    var gfx = !!gfx_cue ? String(gfx_cue) : false; // hack
    var _x = Math.round(x);
    var _y = Math.round(y);
    var xstart = _x;
    var xstop = w>=1 ? _x+Math.round(w) : _x+1;
    var ystop = h>=1 ? _y+Math.round(h) : _y+1;
    
    for (;_y < ystop; _y+=1) {
        for (_x = xstart;_x < xstop; _x+=1) {
            if (wall) {
                LPCD.CALL.set_wall(_x,_y);
            }
            if (level.min_x === undefined || _x < level.min_x) {
                level.min_x = _x;
            }
            if (level.max_x === undefined || _x > level.max_x) {
                level.max_x = _x;
            }
            if (level.min_y === undefined || _y < level.min_y) {
                level.min_y = _y;
            }
            if (level.max_y === undefined || _y > level.max_y) {
                level.max_y = _y;
            }
            if (gfx_cue) {
                // FIXME: be more robust =)
                LPCD.DOM.buffer += "<div class='placeholder' style='";
                LPCD.DOM.buffer += "top:" + _y + "em;";
                LPCD.DOM.buffer += "left:" + _x + "em;";
                if (wall) {
                    LPCD.DOM.buffer += "background-color:#555;";
                    LPCD.DOM.buffer += "border: 1px solid #333;";
                }
                else {
                    LPCD.DOM.buffer += "background-color:green;";
                    LPCD.DOM.buffer += "border: 1px dotted darkgreen;";
                }
                LPCD.DOM.buffer += "'></div>";
            }
        }
    }
};




/******************************************************************************

  Liberated Pixel Cup Demo: Callbacks

 ******************************************************************************/


// "make" is used to build the level, bootstrap the game, and start the demo.
LPCD.EVENT.make = function () {
    "use strict";
    
    // set the player stats:
    var player = LPCD.DATA.player;
    player.x = 0;
    player.y = 0;

    // load a level
    LPCD.CALL.drop(-32, -32, 64, 64, 1, 0);

    LPCD.CALL.drop(-5, -5, 10, 1, 1, 1);
    LPCD.CALL.drop(-5, 5, 10, 1, 1, 1);
    LPCD.CALL.drop(-5, -5, 1, 10, 1, 1);
    LPCD.CALL.drop(5, -5, 1, 5, 1, 1);
    LPCD.CALL.drop(5, 1, 1, 5, 1, 1);
    LPCD.CALL.drop(7, -7, 1, 15, 1, 1);
    LPCD.CALL.drop(-7, -7, 15, 1, 1, 1);
    LPCD.CALL.drop(-7, -7, 1, 15, 1, 1);
    LPCD.CALL.drop(6,6,1,1,1,1);
    LPCD.CALL.drop(-6, 7, 6, 1, 1, 1);
    LPCD.CALL.drop(1, 7, 6, 1, 1, 1);

    LPCD.CALL.drop(-1, 9, 1, 1, 1, 1);
    LPCD.CALL.drop(-3, 9, 1, 1, 1, 1);
    LPCD.CALL.drop(-5, 9, 1, 1, 1, 1);
    LPCD.CALL.drop(-7, 9, 1, 1, 1, 1);
    LPCD.CALL.drop(1, 9, 1, 1, 1, 1);
    LPCD.CALL.drop(3, 9, 1, 1, 1, 1);
    LPCD.CALL.drop(5, 9, 1, 1, 1, 1);
    LPCD.CALL.drop(7, 9, 1, 1, 1, 1);

    var next = "<div id='game_board'>" + LPCD.DOM.buffer + "</div>";
    next += "<div id='player' class='placeholder'></div>";
    LPCD.DOM.doc.body.innerHTML = next;
    LPCD.DOM.doc.body.style.backgroundColor = "transparent";
    LPCD.DOM.doc.body.style.color = "inherit";
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

    if (!LPCD.CALL.get_wall(next_x, next_y)) {
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
    var board = LPCD.DOM.doc.getElementById("game_board");

    board.style.marginLeft = String(-1*player.x) + "em";
    board.style.marginTop = String(-1*player.y) + "em";
};