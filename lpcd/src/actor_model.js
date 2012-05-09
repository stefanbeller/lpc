



/******************************************************************************

   Constructors related to the actor model.

 ******************************************************************************/


// Prototypal object which all actors should inherit from.
LPCD.ACTORS.AbstractKind = function (binding) {
    "use strict";

    var _binding = binding === "player" ? "player" : "level";
    return {
        "on_player_enter" : function (self, player) {
        },
        "on_delete" : function (self) {
        },
        "_binding" : _binding
    };
};


// Prototypal object which persistent scripts should inherit from.
LPCD.ACTORS.PersistentKind = function () {
    "use strict";
    
    var parent = new LPCD.ACTORS.AbstractKind("player");
    var created = Object.create(parent);
    created.on_player_leaves = function (self, player) {
    };
    return created;
}


// Protoypal object which visible actors should inherit from.
LPCD.ACTORS.VisibleKind = function (binding, img) {
    "use strict";

    var parent = new LPCD.ACTORS.AbstractKind(binding);
    var created = Object.create(parent);
   
    var repaint = function (self) {
        console.info("object repaint called");
        if (!!_src) {
            console.info("object repaint happened");
            var _img = LPCD.DOM.res[_src];
            _ctx.clearRect(0, 0, _canvas.width, _canvas.height);
            _ctx.drawImage(_img, 0, 0, _canvas.width, _canvas.height, 0, 0, _canvas.width, _canvas.height);
        }
    };

    var set_img = function (new_src) {
        var _img = LPCD.DOM.res[new_src];
        _canvas.width = _img.width;
        _canvas.height = _img.height;
        _src = new_src;
        console.info("set img:", new_src, _img.width, _img.height);
        repaint();
    };

    var _canvas = LPCD.DOM.doc.createElement("canvas");
    _canvas.width = 0;
    _canvas.height = 0;
    var _ctx = _canvas.getContext("2d");
    created.__defineGetter__("width", function() { return _canvas._width; });
    created.__defineSetter__("width", function(w) { _canvas._width = w; repaint(); });
    created.__defineGetter__("height", function() { return _canvas._height; });
    created.__defineSetter__("height", function(h) { _canvas._height = h; repaint(); });
    var _src = false;
    created.__defineGetter__("img", function() { return _src; });
    created.__defineSetter__("img", function(new_src) {
        var _img;
        if (LPCD.DOM.res[new_src] !== undefined) {
            _img = LPCD.DOM.res[new_src];
            if (_img.width === 0) {
                var old_onload = _img.onload;
                _img.onload = function () {
                    _img.onload();
                    set_img(new_src);
                };
            }
            else {
                set_img(new_src);
            }
        }
        else {
            _img = LPCD.DOM.res[new_src] = new Image();
            _img.onload = function () {
                set_img(new_src);
            };
            _img.src = new_src;
        }
    });
    created.img = img;

    return created;
};


// Actor for non-animated objects.
LPCD.ACTORS.ObjectKind = function (img, x, y) {
    "use strict";

    var parent = new LPCD.ACTORS.VisibleKind("level", img);
    var created = Object.create(parent);

    var _x = x;
    var _y = y;

    created.__defineGetter__("x", function () { return _x; });
    created.__defineSetter__("x", function (newx) { _x = newx; LPCD.CALL.repaint(); });
    created.__defineGetter__("y", function () { return _y; });
    created.__defineSetter__("y", function (newy) { _y = newx; LPCD.CALL.repaint(); });
    created.y = y;
};




/******************************************************************************

   Functions related to the actor model.

 ******************************************************************************/


// "link_actor" adds an actor object into the actor registry.
LPCD.CALL.link_actor = function (actor, visible) {
    "use strict";

    var registry = LPCD.ACTORS.registry;
    visible = visible !== undefined ? !!visible, false;
    if (actor._binding !== undefined) {
        if (registry[actor._binding].indexOf(actor) === -1) {
            registry[actor._binding].push(actor);
            if (visible) {
                registry.visible.push(actor);
            }
        }
    }
    else {
        throw ("Attempted to link non-actor!");
    }
};


// "unlink_actor" removes an actor object from the actor registry.
LPCD.CALL.unlink_actor = function (actor) {
    "use strict":

    var registry = LPCD.ACTORS.registry;
    if (actor._binding !== undefined) {
        var regindex = registry[actor._binding].indexOf(actor);
        var visindex = registry.visible.indexOf(actor);
        if (regindex !== -1) {
            registry[actor._binding].splice(regindex, 1);
        }
        if (visindex !== -1) {
            registry.visible.splice(visindex, 1);
        }
    }
    else {
        throw ("Attempted to unlink non-actor!");
    }
};




/******************************************************************************

  Callbacks related to the actor model.

 ******************************************************************************/
