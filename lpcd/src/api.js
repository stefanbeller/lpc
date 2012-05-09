



/******************************************************************************

  Level dynamics api.

 ******************************************************************************/


/*** shortcuts... ***/

LPCD.API.add_warp = LPCD.CALL.add_warp;




/*** actor creation functions ***/

LPCD.API.create_object = function (x, y, img) {
    "using strict";

    var actor = LPCD.ACTORS.ObjectKind (x, y, img);
    LPCD.CALL.link_actor(actor, true);
    return actor;
};