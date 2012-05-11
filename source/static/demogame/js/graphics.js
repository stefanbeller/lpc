



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
LPCD.CALL.repaint = function () {
    RequestAnimationFrame(LPCD.EVENT.on_redraw);
};




/******************************************************************************

  Callbacks related to the graphics engine.

 ******************************************************************************/


// "on_redraw" moves sprites around when the player's coordinates change.
// Use LPCD.CALL.repaint to schedule this event.
LPCD.EVENT.on_redraw = function () {
    "use strict";
    if (LPCD.DATA.ready) {
        var player = LPCD.DATA.player;
        player.ctx.clearRect(0, 0, 32, 48);
        player.ctx.drawImage(player.sprite, player.state*32, player.dir*48 + player.offset, 32, 48, 0, 0, 32, 48);

        LPCD.CALL.move_actors();

        var boards = ["below", "above"];
        for (var i=0; i<boards.length; i+=1) {
            var board = LPCD.DOM.doc.getElementById("layer_"+boards[i]);
            board.style.marginLeft = String(-.5*player.x) + "em";
            board.style.marginTop = String(-.5*player.y) + "em";
        }
    }
};