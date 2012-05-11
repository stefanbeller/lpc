


/******************************************************************************

   Liberated Pixel Cup Demo: Symbol Table

 ******************************************************************************/
var LPCD = {
    "DOM" : {
        "doc" : undefined,
        "res" : {},
        "layers" : {}
    },

    "ACTORS" : {
        "registry" : {
            // these refer to where the npc attaches, not if they are the player
            "player" : [],
            "level" : [],
            
            // a second list, maintained of everything visible
            "visible" : [],

            // the actor that has input and screen focus
            "focus" : undefined,
        },
        /*"misc", {
            "min_x" : 0,
            "min_y" : 0
        },*/
        "AbstractKind" : undefined,
        "PersistentKind" : undefined,
        "VisibleKind" : undefined,
        "ObjectKind" : undefined
    },

    // functions to used by script dynamics
    "API" : {
        "global" : {}, // handy place to store persistant game data
        "store_default" : undefined, // (key, value)
        "store" : undefined, // (key, value)
        "fetch" : undefined, // (key, value)

        // "undefined" parmas on add_warp will use the player's x/y vaule.
        "add_warp" : undefined, // (x1, y1, x2, y2, dx, dy, [level]),
        "distance" : undefined, // (actor1, actor2)
        "create_object" : undefined, // (x, y, img)
    },

    "DATA" : {
        "ready" : false,
        "level" : {
            "name" : "",
            "debug" : undefined,
            "walls" : {},
            "warps" : {},
            "dynamics" : false,
            "min_x" : undefined,
            "max_x" : undefined,
            "min_y" : undefined,
            "max_y" : undefined
        }
    },

    "CURSOR" : {
        "downed_time" : -1,
        "x" : undefined,
        "y" : undefined,
        "active" : false
    },

    "TIME" : {
        "mouse_timer" : -1
    },

    "CALL" : {
        /*
          Note, functions to do with physics assume that the x/y grid is
          of 16px squares.  Functions to do with tiles (just add_tile, 
          really) assume that the grid is of 32px squares!
         */

        "repaint" : undefined, // ()
        "link_actor" : undefined, // (actor, [visible])
        "unlink_actor" : undefined, // (actor)
        "unlink_transients" : undefined, // ()
        "move_actors" : undefined, // ()
        "build_map" : undefined, // (mapdata)
        "get_wall" : undefined, // (x, y)
        "set_wall" : undefined, // (x, y)
        "wall_check" : undefined, // (x, y) <-- use instead of get_wall!
        "add_tile" : undefined, // (sx, sy, dx, dy, uri, layer)
        "add_warp" : undefined, // (x1, y1, x2, y2, [destination]);
        "get_warp" : undefined, // (x, y)
        "warp_check" : undefined, // (x, y) <-- use instead of get_warp!
        "cue_loading" : undefined, // ()
    },
    
    "EVENT" : {
        "on_warp" : undefined,
        "on_mouse_check" : undefined,
        "on_mouse_down" : undefined,
        "on_mouse_up" : undefined,
        "on_walk" : undefined,
        "map_ready" : undefined,
        "make" : undefined
    }
};


// low-level initialization event...
$(document).ready(function () {
    "use strict";
    LPCD.DOM.frame = $("#lpcd_iframe")[0].contentWindow;
    var doc = LPCD.DOM.doc = $("#lpcd_iframe").contents()[0];

    if (window.top === window) {
        var player = new LPCD.ACTORS.HumonKind(
            undefined, undefined, "./_static/sprites/char_template.png");
        player._gain_input_focus();
        LPCD.EVENT.on_warp(undefined, undefined, "start1.json");
    }
    else {
        window.document.body.innerHTML = "";
    }
});
