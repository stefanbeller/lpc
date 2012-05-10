



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
    created.__defineGetter__("_identity", function () { return created; });

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
    created.__defineGetter__("_canvas", function () { return _canvas; });
    created.__defineGetter__("_ctx", function () { return _ctx; });
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

    created._reorient = function (self) {
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
        repaint(created);
    };

    return created;
};


// Actor for non-animated objects.
LPCD.ACTORS.ObjectKind = function (x, y, img) {
    "use strict";

    var parent = new LPCD.ACTORS.VisibleKind("level", x, y, img);
    var created = Object.create(parent);

    var _block_width, _block_height, _img_x_offset=0, _img_y_offset=0;
    created.__defineGetter__("_block_width", function () { return _block_width; });
    created.__defineSetter__("_block_width", function (foo) { _block_width = foo; });
    created.__defineGetter__("_block_height", function () { return _block_height; });
    created.__defineSetter__("_block_height", function (foo) { _block_height = foo; });
    created.__defineGetter__("_img_x_offset", function () { return _img_x_offset; });
    created.__defineSetter__("_img_x_offset", function (foo) { _img_x_offset = foo; });
    created.__defineGetter__("_img_y_offset", function () { return _img_y_offset; });
    created.__defineSetter__("_img_y_offset", function (foo) { _img_y_offset = foo; });

    created._deleted = false;
    created.on_delete = function (self) {
        self._deleted = true;
    };

    created._blocking = function (self, x, y) {
        var _w = self._block_width !== undefined ? self._block_width : self.width/16;
        var _h = self._block_height !== undefined ? self._block_height : self.height/16;
        if (x >= self.x && x < self.x+_w && y >= self.y && y < self.y+_h) {
            return self;
        }
    };

    created._reorient = function (self) {
        var draw_x = (self.x-LPCD.DATA.player.x-self._img_x_offset)/2;
        var draw_y = (self.y-LPCD.DATA.player.y-self._img_y_offset)/2;
        self._canvas.style.marginLeft = String(draw_x) + "em";
        self._canvas.style.marginTop = String(draw_y) + "em";
        self._canvas.style.zIndex = String(19 + self.z);
    };

    created.on_bumped = function (self, bumped_by) {
        alert("Hi there!");
        return true;
    };

    return created;
};


// Prototype for Actors representing things that move about.
// Does not handle animation directly.
// Anything prototyping this should be able to represent the player character.
LPCD.ACTORS.AnimateKind = function (x, y, img) {
    "use strict";

    var parent = new LPCD.ACTORS.ObjectKind(x, y, img);
    var created = Object.create(parent);
    var _move_speed = 40;
    var _move_dist = .5;
    var _dir = 2;
    created._bumped = [];
    var _ignore;
    var _steps = 0;
    var _is_player = false;
    var _walking = false;
    created._gain_input_focus = function () {
        // FIXME
        // this function should re-bind the actor to be persistant, set _is_player to true
        // and un-bind the old player actor and set it's _is_player to false
    };
    created._lose_input_focus = function () {
    };
    
    created.__defineGetter__("_move_speed", function () { return _move_speed; });
    created.__defineSetter__("_move_speed", function (speed) { _move_speed = speed; });
    created.__defineGetter__("_move_dist", function () { return _move_dist; });
    created.__defineSetter__("_move_dist", function (dist) { _move_dist = dist });

    created.__defineGetter__("_steps", function () { return _steps; });
    created.__defineGetter__("_is_moving", function () { return !!_walking; });
    created.__defineGetter__("_is_player", function () { return _is_player; });

    created.__defineGetter__("dir", function () { return _dir; });
    created.__defineSetter__("dir", function (new_dir) {
        if (new_dir >= 4 || new_dir <= 4) {
            new_dir = new_dir % 4;
        }
        _dir = new_dir;
        created._reorient(created); 
    });

    created._move_to = function (pick_x, pick_y) {
        _walking = {"x":pick_x, "y":pick_y};
        _movecycle(this);
    };

    var _movecycle = function _movecycle (self) {
        var next_x, next_y, stop = false, stopped_by = false, check, other, dist, no_rotate = false, a;
        var delta = function (n1, n2) { return Math.sqrt(Math.pow((n2-n1),2)); };
        if (_walking) {
            dist = Math.sqrt(Math.pow(_walking.x-self.x, 2) + Math.pow(_walking.y-self.y, 2));
            if (dist <.5) {
                next_x = _walking.x;
                next_y = _walking.y;
                stop = true;
            }
            else {
                a = _move_dist/dist;
                next_x = self.x*(1.0-a) + _walking.x*a;
                next_y = self.y*(1.0-a) + _walking.y*a;
                if (next_x !== self.x) {
                    if (next_x < self.x) { check = Math.floor; other = Math.ceil; }
                    else { check = Math.ceil; other = Math.floor; }
                    if (LPCD.CALL.wall_check(check(next_x), next_y, self) > 0) {
                        next_x = other(next_x);
                        if (delta(next_y, self.y) <= .05) { stop = true; }
                    }
                }
                if (next_y !== self.y) {
                    if (next_y < self.y) {
                        check = Math.floor;
                        other = Math.ceil;
                    }
                    else {
                        check = Math.ceil;
                        other = Math.floor;
                    }
                    if (LPCD.CALL.wall_check(next_x, check(next_y), self) > 0) {
                        next_y = other(next_y);
                        if (delta(next_x, self.x) <= .05) { stop = true; }
                    }
                }
                if (next_x === self.x && next_y === self.y) { stop = true; }
            }

            if (LPCD.CALL.wall_check(next_x, next_y, self)) {
                // hit a wall
                self.x = Math.round(self.x);
                self.y = Math.round(self.y);
                stop = true;
            }
            else if (!no_rotate && !stop) {
                // determine the character's facing
                if (next_x >= self.x && next_y <= self.y) {
                    // north east
                    self.dir = delta(self.x, next_x) > delta(self.y, next_y) ? 3 : 0;
                }
                else if (next_x <= self.x && next_y <= self.y) {
                    // north east
                    self.dir = delta(self.x, next_x) > delta(self.y, next_y) ? 1 : 0;
                }
                else if (next_x <= self.x && next_y >= self.y) {
                    // north east
                    self.dir = delta(self.x, next_x) > delta(self.y, next_y) ? 1 : 2;
                }
                else if (next_x >= self.x && next_y >= self.y) {
                    // north east
                    self.dir = delta(self.x, next_x) > delta(self.y, next_y) ? 3 : 2;
                }
            }
            self.x = next_x;
            self.y = next_y;
        }

        if (self._bumped.length > 0) {
            // TODO : add an on_stopped event, to compliment on_bumped.
            var bumped = self._bumped[0];
            self._bumped = [];
            if (bumped.on_bumped !== undefined && bumped !== _ignore) {
                _ignore = bumped;
                // call the "on_bumped" method of the other actor.
                var acted = bumped.on_bumped(bumped, self);
                if (acted) { 
                    stopped_by = bumped;
                    stop = true;
                }
            }
        }
        else {
            _ignore = undefined;
        }

        if (stop) {
            _steps = 0;
            _walking = false;
            if ( self.on_stopped !== undefined ) {
                self.on_stopped(self, stopped_by);
            }
        }
        else {
            _steps += 1;
            setTimeout(function() {_movecycle(self);}, self._move_speed);
        }

        LPCD.CALL.repaint();
        if (_is_player) {
            LPCD.CALL.warp_check(self.x, self.y);
        }
    };

    return created;
}


// Actor for simple animated objects with directional facings.
LPCD.ACTORS.CritterKind = function (x, y, img, w, h, steps, directional, rate) {
    "use strict";
    
    var parent = new LPCD.ACTORS.AnimateKind(x, y, img);
    var created = Object.create(parent);
    var _step = 0;

    created._block_width = w/16;
    created._block_height = h/16;

    created._crop(0, 0, w, h);
    if (directional) {
        created._reorient = function (self) {
            self._crop(w*_step, h*self.dir, w, h);
            parent._reorient(self);
        };
    }
    else {
        created._reorient = function (self) {
            self._crop(w*_step, 0, w, h);
            parent._reorient(self);
        };
    }
    // animation loop
    (function animate () {
        _step += 1;
        if (_step >= steps) {
            _step = 0;
        }
        LPCD.CALL.repaint();
        if (!created._deleted) { setTimeout(animate, rate); }
    })();

    return created;
};


// Actor for human characters.
LPCD.ACTORS.HumonKind = function (x, y, img) {
    "use strict";

    var parent = new LPCD.ACTORS.AnimateKind(x, y, img);
    var created = Object.create(parent);

    created._block_height = 1;
    created._block_width = 2;
    created._img_y_offset = 2;

    created._reorient = function (self) {
        var frame = 0;
        if (self._is_moving) {
            frame = self._steps % 8 + 1;
        }
        self._crop(32 * frame, 48*self.dir, 32, 48);
        parent._reorient(self);
    };

    created._reorient(created);
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
                actor._reorient(actor);
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
        actor.on_delete(actor);
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
        visible[i]._reorient(visible[i]);
    }
};




/******************************************************************************

  Callbacks related to the actor model.

 ******************************************************************************/
