



/******************************************************************************

   Functions related to input handling, character animation, and collision
   detection.

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




/******************************************************************************

   Callbacks related to input handling, character animation, and collision
   detection.

 ******************************************************************************/


// "on_click" happens when the iframe is clicked on.
// This function attempts to determine the world coordinates for that click,
// and initiates a walk cycle.
LPCD.EVENT.on_click = function (event) {
    "use strict";
    if (LPCD.DATA.ready) {
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
