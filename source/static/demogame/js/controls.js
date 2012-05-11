



/******************************************************************************

   Functions related to input handling, character animation, and collision
   detection.

 ******************************************************************************/


// "wall_check" is used for intelligent collision detection.
LPCD.CALL.wall_check = function (x, y, actor) {
    "use strict";

    var i = Math.round(x);
    var k = Math.round(y);
    return LPCD.CALL.get_wall(i, k, actor) || LPCD.CALL.get_wall(i+1, k, actor);
}


// "get_wall" is used for collision detection.  Use wall_check instead.
LPCD.CALL.get_wall = function (x, y, actor) {
    "use strict";

    var visible = LPCD.ACTORS.registry.visible;
    var blocked_by = false;
    for (var i=0; i<visible.length; i+=1) {
        if (actor !== undefined && visible[i]._identity == actor._identity) { continue; }
        if (visible[i]._blocking !== undefined) {
            blocked_by = visible[i]._blocking(visible[i], x, y);
            if (blocked_by) {
                break;
            }
        }
    }
    if (!!blocked_by) {
        if (actor === undefined) {
            LPCD.DATA.player.bumped.push(blocked_by);
        }
        else {
            actor._bumped.push(blocked_by);
        }
        return true;
    }
    var raw = LPCD.DATA.level.walls[String(x)+","+String(y)];
    return raw !== undefined ? true : false;    
};


// "warp_check" is used to trigger warp events.
LPCD.CALL.warp_check = function (x, y) {
    "use strict";

    var warp = LPCD.CALL.get_warp(Math.round(x), Math.round(y));
    if (warp && LPCD.DATA.ready) {
        LPCD.EVENT.on_warp(warp[0], warp[1], warp[2]);
    }
}


// "get_warp" is used for finding warp pointsn.  Use warp_check instead.
LPCD.CALL.get_warp = function (x, y) {
    "use strict";

    var raw = LPCD.DATA.level.warps[String(x)+","+String(y)];
    return raw !== undefined ? raw : false;
};





/******************************************************************************

   Callbacks related to input handling, character animation, and collision
   detection.

 ******************************************************************************/


LPCD.EVENT.on_mouse_check = function () {
    "use strict";

    clearTimeout(LPCD.TIME.mouse_timer);

    if (LPCD.DATA.ready && LPCD.CURSOR.active) {
        var focus = LPCD.ACTORS.registry.focus;
       
        var view_width = $("#lpcd_iframe").width();
        var view_height = $("#lpcd_iframe").height();
        
        var sx = (Math.round((LPCD.CURSOR.x/16)) - Math.ceil(view_width/32))-1;
        var sy = (Math.round((LPCD.CURSOR.y/16)+.5) - Math.ceil(view_height/32))-1;
        var x = Math.round(sx + focus.x);
        var y = Math.round(sy + focus.y);
        
        if (!focus._is_moving || (x !== focus.x && y !== focus.y)) {
            focus._move_to(x, y);
        }
        LPCD.TIME.mouse_timer = setTimeout(LPCD.EVENT.on_mouse_check, 100);
    }
    else {
        LPCD.TIME.mouse_timer = -1;
    }
};


LPCD.EVENT.on_mouse_down = function (event) {
    "use strict";

    LPCD.CURSOR = {
        "downed_time" : Date.now(),
        "x" : event.x || event.clientX,
        "y" : event.y || event.clientY,
        "active" : true
    };
    LPCD.DOM.doc.body.onmousemove = LPCD.EVENT.on_mouse_move;
    LPCD.EVENT.on_mouse_check();
};


LPCD.EVENT.on_mouse_move = function (event) {
    LPCD.CURSOR.x = event.x || event.clientX;
    LPCD.CURSOR.y = event.y || event.clientY;
};


LPCD.EVENT.on_mouse_up = function (event) {
    var mark = Date.now();
    clearTimeout(LPCD.TIME.mouse_timer);
    LPCD.DOM.doc.body.onmousemove = undefined;
    LPCD.CURSOR.active = false;
    LPCD.TIME.mouse_timer = -1;
    if (mark - LPCD.CURSOR.downed_time > 300) {
        LPCD.ACTORS.registry.focus._stop();
    }
};
