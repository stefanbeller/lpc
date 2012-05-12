
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


LPCD.API.instance = function (name, x, y) {
    if (LPCD.CHARS[name] !== undefined) {
        return LPCD.CHARS[name](x,y);
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
