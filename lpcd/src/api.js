



/******************************************************************************

  Level dynamics api.

 ******************************************************************************/


/*** shortcuts... ***/

LPCD.API.add_warp = LPCD.CALL.add_warp;




/*** actor creation functions ***/

LPCD.API.create_object = function (img, x, y) {
    "using strict";

    var actor = new LPCD.ACTORS.ObjectKind(img, x, y);
    LPCD.CALL.link_actor(actor, true);
    return actor;
};