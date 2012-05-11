



/******************************************************************************

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

    var level_actors = LPCD.ACTORS.registry.level;
    for (var i=0; i<level_actors.length; i+=1) {
        LPCD.CALL.unlink_actor(level_actors[i]);
    }
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
