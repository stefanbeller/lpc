



/******************************************************************************

  Callbacks related to displaying game graphics.

 ******************************************************************************/


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
