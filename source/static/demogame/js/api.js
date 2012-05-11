



/******************************************************************************

  Level dynamics api.

 ******************************************************************************/


/*** shortcuts... ***/

LPCD.API.add_warp = LPCD.CALL.add_warp;




/*** useful stuff ***/
LPCD.API.distance = function (a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};


LPCD.API.store_default = function (key, value) {
    var level = LPCD.DATA.level.name;
    if (LPCD.API.global[level] === undefined) {
        LPCD.API.global[level] = {};
    }
    if (LPCD.API.global[level][key] === undefined) {
        LPCD.API.global[level][key] = value;
    }
};


LPCD.API.store = function (key, value) {
    var level = LPCD.DATA.level.name;
    if (LPCD.API.global[level] === undefined) {
        LPCD.API.global[level] = {};
    }
    LPCD.API.global[level][key] = value;
};


LPCD.API.fetch = function (key) {
    var level = LPCD.DATA.level.name;
    if (LPCD.API.global[level] !== undefined) {
        return LPCD.API.global[level][key];
    }
};




/*** actor creation functions ***/

LPCD.API.create_object = function (x, y, img) {
    "use strict";

    var actor = LPCD.ACTORS.ObjectKind (x, y, img);
    LPCD.CALL.link_actor(actor, true);
    return actor;
};


LPCD.API.create_critter = function (x, y, img, w, h, steps, directional, rate) {
    "use strict";

    var actor = LPCD.ACTORS.CritterKind (x, y, img, w, h, steps, directional, rate);
    LPCD.CALL.link_actor(actor, true);
    return actor;
};


LPCD.API.create_human = function (x, y, img) {
    "use strict";
    
    var actor = LPCD.ACTORS.HumonKind (x, y, img);
    LPCD.CALL.link_actor(actor, true);
    return actor;
};