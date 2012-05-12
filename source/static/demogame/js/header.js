
/******************************************************************************

     Liberated Pixel Cup demo engine
     -------------------------------

     Copyright (C) 2012 Liberated Pixel Cup contributors.
       See AUTHORS for details.
 
     This program is free software: you can redistribute it and/or modify
     it under the terms of the GNU General Public License as published by
     the Free Software Foundation, either version 3 of the License, or
     (at your option) any later version.

     This program is distributed in the hope that it will be useful,
     but WITHOUT ANY WARRANTY; without even the implied warranty of
     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
     GNU General Public License for more details.

     You should have received a copy of the GNU General Public License
     along with this program.  If not, see <http://www.gnu.org/licenses/>.


 ******************************************************************************

   Liberated Pixel Cup Demo: Symbol Table

 ******************************************************************************/
var LPCD = {
    "DOM" : {
        "doc" : undefined,
        "res" : {},
        "layers" : {}
    },

    "CHARS" : {},

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
        "bootstrapping" : true,
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
        "find_actor" : undefined, // (key, value)
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
        "mouse_cancel" : undefined, // ()
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
        LPCD.CHARS.alice(0, 0);
        var player = LPCD.ACTORS.registry.visible[0];
        player._gain_input_focus();
        player.dir = 2;
        LPCD.EVENT.on_warp(undefined, undefined, "start1.json");
    }
    else {
        window.document.body.innerHTML = "";
    }
});
