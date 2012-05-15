
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

  Actor constructor functions.

 ******************************************************************************/


// Prototypal object which all actors should inherit from.
LPCD.ACTORS.AbstractKind = function (binding) {
    "use strict";

    var _loop_timer = -1;
    var _binding = binding === "player" ? "player" : "level";
    var created = {
        "on_player_enter" : function (self, player) {
        },
        "on_delete" : function (self) {
        },
        "on_loop" : function (self) {
        },
        "_rebind" : function (new_binding) {
            _binding = new_binding === "player" ? "player" : "level";
            LPCD.CALL.unlink_actor(created);
            LPCD.CALL.link_actor(created);
        },
        "_frequency" : 100,
        "_start" : function () {
            clearTimeout(_loop_timer);
            (function inner_loop (self) {
                if (!self._deleted && !self._is_player) {
                    self.on_loop(self);
                }
                _loop_timer = setTimeout(
                    function () { inner_loop(self); }, self._frequency);
            })(this);
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
};


// Prototypal object which visible actors should inherit from.
LPCD.ACTORS.VisibleKind = function (binding, _x, _y, _img) {
    "use strict";

    var parent = new LPCD.ACTORS.AbstractKind(binding);
    var created = Object.create(parent);


    // private vars --------------------------------
    var x=_x, y=_y, src=false;
    var cropped=false, sx=0, sy=0, sw=0, sh=0;
    var img;


    // private methods --------------------------------
    var px = function (value) { return String(value) + "px"; };
    var update_img = function (self) {
        img = LPCD.DOM.res[src];
        self._div.style.backgroundImage = "url('"+src+"')";
        resize(self);
    };
    var resize = function (self) {
        var pos = "";
        if (cropped) {
            self._div.style.width = px(sw);
            self._div.style.height = px(sh);
            pos += px(sx*-1) + " " + px(sy*-1);
        }
        else {
            self._div.style.width = px(img.width || 0);
            self._div.style.height = px(img.height || 0);
            pos = "0px 0px";
        }
        self._div.style.backgroundPosition = pos;
        self._dirty();
    };


    // public vars --------------------------------
    created._div = LPCD.DOM.doc.createElement("div");
    created._div.setAttribute("class", "actor");
    created.__defineGetter__("width", function () { return cropped ? sw : img.width; });
    created.__defineGetter__("height", function () { return cropped ? sh : img.height; });
    created.__defineGetter__("img", function () { return src; });
    created.__defineSetter__("img", function (uri) {
        if (uri !== src) {
            var self = this;
            src = uri;
            var resource = LPCD.DOM.res[src];
            if (resource !== undefined) {
                if (resource.width === 0) {
                    // most likely still downloading
                    var old_onload = resource.onload;
                    resource.onload = function () {
                        try { 
                            old_onload(); 
                        } catch (err) { 
                            // don't worry about it 
                        }
                        update_img(self);
                    };
                }
                else {
                    // resource is available
                    update_img(self);
                }
            }
            else {
                img = LPCD.DOM.res[src] = new Image();
                img.onload = function () {
                    update_img(self);
                };
                img.src = src;
            }
        }
    });
    created.__defineGetter__("x", function () { return x; });
    created.__defineSetter__("x", function (_x) {
        if (_x !== x) {
            x = _x;
            this._dirty();
        }
    });
    created.__defineGetter__("y", function () { return y; });
    created.__defineSetter__("y", function (_y) {
        if (_y !== y) {
            y = _y;
            this._dirty();
        }
    });


    // public methods --------------------------------
    created._show = function () {
        var layer = LPCD.DOM.layers.actors;
        if (layer !== undefined) {
            layer.contentWindow.document.body.appendChild(this._div);
            this._refresh();
        }
    };

    created._hide = function () {
        if (this._div.parentNode) {
            this._div.parentNode.removeChild(this._div);
        }
    };
    
    created._crop = function (_sx, _sy, _sw, _sh) {
        cropped = true;
        sx = _sx;
        sy = _sy;
        sw = _sw;
        sh = _sh;
        resize(this);
    };

    created._dirty = function (allow_player) {
        if (allow_player || this._is_player === false) {
            var _x = (this.x*16);
            var _y = (this.y*16) - this.height;
            this._div.style.top = px(_y);
            this._div.style.left = px(_x);
            this._div.style.zIndex = String(Math.round(_y));
        }
    };

    created._refresh = function () {
        update_img(this);
    };


    // finish up --------------------------------
    created.img = _img;
    return created;
};


// Actor for non-animated objects.
LPCD.ACTORS.ObjectKind = function (x, y, img) {
    "use strict";

    var parent = new LPCD.ACTORS.VisibleKind("level", x, y, img);
    var created = Object.create(parent);

    var _block_width, _block_height, _img_x_offset=0, _img_y_offset=0;
    var px = function (value) { return String(value) + "px"; };
    created.__defineGetter__("_block_width", function () { return _block_width; });
    created.__defineSetter__("_block_width", function (foo) { 
        _block_width = foo;
    });
    created.__defineGetter__("_block_height", function () { return _block_height; });
    created.__defineSetter__("_block_height", function (foo) {
        _block_height = foo;
        this._dirty();
    });
    created.__defineGetter__("_img_x_offset", function () { return _img_x_offset; });
    created.__defineSetter__("_img_x_offset", function (foo) {
        _img_x_offset = foo;
        this._dirty();
    });
    created.__defineGetter__("_img_y_offset", function () { return _img_y_offset; });
    created.__defineSetter__("_img_y_offset", function (foo) {
        _img_y_offset = foo;
        this._dirty();
    });

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

    created._dirty = function (allow_player) {
        if (allow_player || !this._is_player) {
            var _x = (this.x + this._img_x_offset) * 16;
            var _y = ((this.y + this._img_y_offset) * 16) - this.height + this._block_height*16;
            this._div.style.top = px(_y);
            this._div.style.left = px(_x);
            this._div.style.zIndex = String(Math.round(_y) + this.height);
        }
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
    var _move_timer = -1;
    var _old_speed;

    var delta = function (n1, n2) { return Math.sqrt(Math.pow((n2-n1),2)); };

    created._gain_input_focus = function () {
        // Actor gains input focus - mouse events call _move_to, and the
        // screen focuses on this actor's x/y

        try {
            LPCD.ACTORS.registry.focus._lose_input_focus();
            _ignore = LPCD.ACTORS.registry.focus;
            LPCD.ACTORS.registry.focus._ignore = this;
        } catch (err) {/* don't worry about it */}
        LPCD.ACTORS.registry.focus = this;
        LPCD.CALL.unlink_actor(this, true);
        LPCD.ACTORS.registry.visible.push(this);
        this._show();
        _is_player = true;
        _old_speed = this._move_speed;
        this._move_speed -= 25; // speed up

        if (this.on_gained_focus !== undefined) { this.on_gained_focus(this); }
    };

    created._lose_input_focus = function () {
        // Should not be called directly :P
        // This method is called when this actor loses input focus.

        _is_player = false;
        if (this._binding === "level") {
            // Actor rebinds and is added back into the level.
            LPCD.CALL.unlink_actor(this, true);
            LPCD.CALL.link_actor(this, true);
            this._move_speed = _old_speed;
        }
        else {
            // Actor rebinds to whatever it was before
            LPCD.CALL.unlink_actor(this, true);
            LPCD.CALL.link_actor(this, false);
        }
        if (this.on_lost_focus !== undefined) {
            this.on_lost_focus();
        }
    };
    
    created.__defineGetter__("_move_speed", function () { return _move_speed; });
    created.__defineSetter__("_move_speed", function (speed) { _move_speed = speed; });
    created.__defineGetter__("_move_dist", function () { return _move_dist; });
    created.__defineSetter__("_move_dist", function (dist) { _move_dist = dist });

    created.__defineGetter__("_steps", function () { return _steps; });
    created.__defineGetter__("_is_moving", function () { return !!_walking; });
    created.__defineGetter__("_is_player", function () { return _is_player; });

    created._repaint = function () {};

    created.__defineGetter__("dir", function () { return _dir; });
    created.__defineSetter__("dir", function (new_dir) {
        if (new_dir >= 4 || new_dir <= 4) {
            new_dir = new_dir % 4;
        }
        _dir = new_dir;
        this._repaint();
    });

    created._look_at = function (look_x, look_y) {
        if (look_x >= created.x && look_y <= created.y) {
            // north east
            created.dir = delta(created.x, look_x) > delta(created.y, look_y) ? 3 : 0;
        }
        else if (look_x <= created.x && look_y <= created.y) {
            // north east
            created.dir = delta(created.x, look_x) > delta(created.y, look_y) ? 1 : 0;
        }
        else if (look_x <= created.x && look_y >= created.y) {
            // north east
            created.dir = delta(created.x, look_x) > delta(created.y, look_y) ? 1 : 2;
        }
        else if (look_x >= created.x && look_y >= created.y) {
            // north east
            created.dir = delta(created.x, look_x) > delta(created.y, look_y) ? 3 : 2;
        }
    };

    created._move_to = function (pick_x, pick_y) {
        _walking = {"x":pick_x, "y":pick_y};
        clearTimeout(_move_timer);
        _move_timer = _movecycle(this);
    };

    created._stop = function () {
        // conceptually pair this with "_move_to", not "_is_moving"
        _steps = 0;
        _walking = false;
        clearTimeout(_move_timer);
        _move_timer = -1;
    };

    var locus_x, locus_y;
    created._wander = function (radius) {
        if (radius === undefined) {
            radius = 10;
        }
        locus_x = this.x;
        locus_y = this.y;
        this.on_loop = function (self) {
            var x_dist = (Math.random() * radius * 2) - radius;
            var y_dist = (Math.random() * radius * 2) - radius;
            self._frequency = 4000 + (Math.random()*2000-1000);
            self._move_to(locus_x + x_dist, locus_y + y_dist);
        };
        this._frequency = 4000;
        this._start();
    };

    var _movecycle = function _movecycle (self) {
        var next_x, next_y, stop = false, stopped_by = false, check, other, dist, no_rotate = false, a;
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
                self._look_at(next_x, next_y);
            }
            self.x = next_x;
            self.y = next_y;
        }

        if (self._bumped.length > 0) {
            var bumped = self._bumped[0];
            self._bumped = [];
            if (bumped.on_bumped !== undefined && bumped !== _ignore && !bumped._is_player) {
                _ignore = bumped;
                // call the "on_bumped" method of the other actor.
                var acted = bumped.on_bumped(bumped, self);

                if (acted) { 
                    // if on_bumped returned true, interrupt the player's movement
                    LPCD.CALL.mouse_cancel();
                    stopped_by = bumped;
                    stop = true;
                }
            }
        }
        else {
            _ignore = undefined;
        }

        if (stop) {
            self._stop();
            if ( self.on_stopped !== undefined && !self._is_player ) {
                self.on_stopped(self, stopped_by);
            }
        }
        else {
            _steps += 1;
            _move_timer = setTimeout(function() {_movecycle(self);}, self._move_speed);
        }

        self._repaint();
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
    var reorient;

    created._block_width = w/16;
    created._block_height = h/16;
    created._img_y_offset = -1;

    created._crop(0, 0, w, h);
    if (directional) {
        created._repaint = function () {
            this._crop(w*_step, h*this.dir, w, h);
        };
    }
    else {
        created._repaint = function () {
            this._crop(w*_step, 0, w, h);
        };
    }
    // animation loop
    (function animate () {
        _step += 1;
        if (_step >= steps) {
            _step = 0;
        }
        created._repaint();
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
    created._move_speed = 60;

    created._repaint = function () {
        var frame = 0;
        if (this._is_moving) {
            frame = this._steps % 8 + 1;
        }
        this._crop(32 * frame, 48*this.dir, 32, 48);
    };

    created._repaint(created);
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
        }
        if (visible && registry.visible.indexOf(actor) === -1) {
            registry.visible.push(actor);
            actor._show();
        }
    }
    else {
        throw ("Attempted to link non-actor!");
    }
};


// "unlink_actor" removes an actor object from the actor registry.
LPCD.CALL.unlink_actor = function (actor, no_delete) {
    "use strict";

    var registry = LPCD.ACTORS.registry;
    no_delete = no_delete !== undefined ? !!no_delete : false;
    if (actor._binding !== undefined) {
        var regindex = registry[actor._binding].indexOf(actor);
        var visindex = registry.visible.indexOf(actor);
        if (regindex !== -1) {
            registry[actor._binding].splice(regindex, 1);
        }
        if (visindex !== -1) {
            registry.visible.splice(visindex, 1);
            actor._hide();
        }
        if (!no_delete) {
            actor.on_delete(actor);
        }
    }
    else {
        throw ("Attempted to unlink non-actor!");
    }
};


// "unlink_transients" removes all actors with level binding.
// has nothing to do with homeless individuals.
LPCD.CALL.unlink_transients = function () {
    "use strict";
    
    var targets = LPCD.ACTORS.registry.level;
    while (targets.length > 0) {
        LPCD.CALL.unlink_actor(targets[0]);
    }
};


// "select" is a nifty function for searching for a specific actor.
// this is really only intended for debug use.
LPCD.CALL.find_actor = function (key, value) {
    "use strict";

    var candidates = [LPCD.ACTORS.registry.focus];
    candidates = candidates.concat(LPCD.ACTORS.registry.level);
    candidates = candidates.concat(LPCD.ACTORS.registry.player);
    for (var i=0; i<candidates.length; i+=1) {
        if (candidates[i][key] !== undefined && candidates[i][key] === value) {
            return candidates[i];
        }
    }
};
