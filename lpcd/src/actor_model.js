



/******************************************************************************

  Actor constructor functions.

 ******************************************************************************/


// Prototypal object which all actors should inherit from.
LPCD.ACTORS.AbstractKind = function (binding) {
    "use strict";

    var _binding = binding === "player" ? "player" : "level";
    var created = {
        "on_player_enter" : function (self, player) {
        },
        "on_delete" : function (self) {
        },
        "_rebind" : function (new_binding) {
            _binding = new_binding === "player" ? "player" : "level";
            LPCD.CALL.unlink_actor(created);
            LPCD.CALL.link_actor(created);
        }
    };
    created.__defineGetter__("_binding", function () { return _binding; });

    return created;
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
LPCD.ACTORS.VisibleKind = function (binding, x, y, img) {
    "use strict";

    var parent = new LPCD.ACTORS.AbstractKind(binding);
    var created = Object.create(parent);
   
    var _sx = 0;
    var _sy = 0;
    var cropped = false;
    var repaint = function (self) {
        if (!!_src) {
            var _img = LPCD.DOM.res[_src];
            _ctx.clearRect(0, 0, _canvas.width, _canvas.height);
            _ctx.drawImage(_img, _sx, _sy, _canvas.width, _canvas.height, 0, 0, _canvas.width, _canvas.height);
        }
    };

    var set_img = function (new_src) {
        var _img = LPCD.DOM.res[new_src];
        if (!cropped) {
            _canvas.width = _img.width;
            _canvas.height = _img.height;
        }
        _src = new_src;
        repaint();
    };

    var _canvas = LPCD.DOM.doc.createElement("canvas");
    _canvas.setAttribute("class", "actor");
    _canvas.width = 0;
    _canvas.height = 0;
    var _ctx = _canvas.getContext("2d");
    created.__defineGetter__("width", function() { return _canvas.width; });
    created.__defineSetter__("width", function(w) { _canvas.width = w; repaint(); });
    created.__defineGetter__("height", function() { return _canvas.height; });
    created.__defineSetter__("height", function(h) { _canvas.height = h; repaint(); });
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

    var _x = x;
    var _y = y;
    var _z = 0;
    created.__defineGetter__("x", function () { return _x; });
    created.__defineSetter__("x", function (newx) { 
        _x = newx;
        LPCD.CALL.repaint();
    });
    created.__defineGetter__("y", function () { return _y; });
    created.__defineSetter__("y", function (newy) {
        _y = newy;
        LPCD.CALL.repaint();
    });
    created.__defineGetter__("z", function () { return _z; });
    created.__defineSetter__("z", function (newz) { 
        _z = newz;
        LPCD.CALL.repaint();
    });

    created._reorient = function () {
        _canvas.style.marginLeft = String((_x-LPCD.DATA.player.x)/2) + "em";
        _canvas.style.marginTop = String((_y-LPCD.DATA.player.y)/2) + "em";
        _canvas.style.zIndex = String(19 + _z);
    };

    created.img = img;
    created._show = function () {
        LPCD.DOM.doc.body.appendChild(_canvas);
    };

    created._crop = function (sx, sy, sw, sh) {
        cropped = true;
        _sx = sx;
        _sy = sy;
        _canvas.width = sw;
        _canvas.height = sh;
        repaint();
    };

    return created;
};


// Actor for non-animated objects.
LPCD.ACTORS.ObjectKind = function (x, y, img) {
    "use strict";

    var parent = new LPCD.ACTORS.VisibleKind("level", x, y, img);
    var created = Object.create(parent);

    created._blocking = function (self, x, y) {
        var w = self.width/16;
        var h = self.height/16;
        if (x >= self.x && x < self.x + w && y >= self.y && y < self.y + h) {
            return self;
        }
    };

    created.on_bumped = function (self, bumped_by) {
        alert("Hi there!");
        return true;
    };

    return created;
};


// Actor for simple animated objects with directional facings.
LPCD.ACTORS.CritterKind = function (x, y, img, w, h, steps, directional, rate) {
    "use strict";
    
    var parent = new LPCD.ACTORS.ObjectKind(x, y, img);
    var created = Object.create(parent);
    var _dir = 2;
    var _step = 0;
    created._crop(0, 0, w, h);
    if (directional) {
        created.__defineGetter__("dir", function () { return _dir; });
        created.__defineSetter__("dir", function (new_dir) {
            if (new_dir >= 4) {
                new_dir = new_dir % 4;
            }
            _dir = new_dir;
            created._reorient(); 
        });
    }
    created._reorient = function () {
        created._crop(w*_step, h*_dir, w, h);
        parent._reorient();
    };
    // animation loop
    (function animate () {
        _step += 1;
        if (_step >= steps) {
            _step = 0;
        }
        created._crop(w*_step, h*_dir, w, h);
        LPCD.CALL.repaint();
        setTimeout(animate, rate);
    })();

    return created;
};




/******************************************************************************

   Functions related to the actor model.

 ******************************************************************************/


// "link_actor" adds an actor object into the actor registry.
LPCD.CALL.link_actor = function (actor, visible) {
    "use strict";

    var registry = LPCD.ACTORS.registry;
    visible = visible !== undefined ? !!visible : false;
    if (actor._binding !== undefined) {
        if (registry[actor._binding].indexOf(actor) === -1) {
            registry[actor._binding].push(actor);
            if (visible) {
                registry.visible.push(actor);
                actor._show();
                actor._reorient();
            }
        }
    }
    else {
        throw ("Attempted to link non-actor!");
    }
};


// "unlink_actor" removes an actor object from the actor registry.
LPCD.CALL.unlink_actor = function (actor) {
    "use strict";

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


// "move_actors" Calls the "_reorient" method on all visible actors.
LPCD.CALL.move_actors = function () {
    "use strict";

    var visible = LPCD.ACTORS.registry.visible;
    for (var i=0; i<visible.length; i+=1) {
        visible[i]._reorient();
    }
};




/******************************************************************************

  Callbacks related to the actor model.

 ******************************************************************************/
