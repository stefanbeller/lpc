
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

   Functions related to the graphics engine.

 ******************************************************************************/

// "cue_loading" hides the player and shows the loading screen until a new
// level is ready.
LPCD.CALL.cue_loading = function () {
    var doc = LPCD.DOM.doc = $("#lpcd_iframe").contents()[0];
    doc.head.innerHTML = '<link rel="stylesheet" type="text/css" href="./_static/demogame/lpcd.css" />';
    doc.body.style.backgroundColor = "black";
    doc.body.style.color = "white";
    doc.body.style.textAlign = "center";
    doc.body.innerHTML="<div id='backdrop'><h1 id='text_overlay'>loading...</h1></div>";
    LPCD.DATA.ready = false;
    LPCD.CALL.unlink_transients();
};


// "repaint" is used to intelligently schedule a redraw event.
// A closure is used to encapsulate the function for the redraw event, because
// there is absolutely no circumstance in which it should be called directly.
LPCD.CALL.repaint = (function () {
    "use strict";

    var on_redraw = function () {
        if (LPCD.DATA.ready) {
            var focus = LPCD.ACTORS.registry.focus;
            LPCD.CALL.move_actors();
            var boards = ["below", "above"];
            for (var i=0; i<boards.length; i+=1) {
                var board = LPCD.DOM.doc.getElementById("layer_"+boards[i]);
                board.style.marginLeft = String(-.5*focus.x) + "em";
                board.style.marginTop = String(-.5*focus.y) + "em";
            }
        }
    };

    return function () {
        RequestAnimationFrame(on_redraw);
    };
})();
