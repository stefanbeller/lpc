



/******************************************************************************

  Actors inheriting from AnimateKind can gain input focus.  If the actor is
then brought into a new level due to this, and loses input focus; any code that
was defined in the old level is now inaccessible;  only the parts of the
prototype chain that were defined in the 'global' scope will remain useable.

  Because of this, it may be useful to define special npcs for the game here
instead of in a level; and use the api to spawn them in the level.  That way,
they may be transplanted to a new level without losing any functionality.

  It may well also make sense to define useful actors here, even if they can't
become focused.  Such actors would be things like treasure chests.

  Lastly, it may be that one can pick up persistant scripts in the form of
things like items and non-visible actors.  Such actors would also need to be
defined here.

  For simplicity's sake, we will assume the term "character" refers to all of
the above.

  These functions don't necessarily need to return an actor, btw.

 ******************************************************************************/




LPCD.CHARS.barrel = function (x, y) {
    var barrel = LPCD.API.create_object(x, y, "./_static/sprites/barrel.png");
    barrel._crop(0,0,32,48)
    barrel._block_width = 2;
    barrel._block_height = 1;
    barrel._img_y_offset = 2;
    barrel.on_bumped = undefined;
    return barrel;
};




LPCD.CHARS.alice = function (x, y) {
    "use strict";
    
    var focused = LPCD.ACTORS.registry.focus;
    if (focused !== undefined && focused.name === "Alice") { return; }

    var alice = LPCD.API.create_human(x, y, "./_static/sprites/char_alice.png");
    alice.name = "Alice";

    alice.on_bumped = function (self, bumped_by) {
        self._look_at(bumped_by.x, bumped_by.y);
        if (bumped_by.name.indexOf("Bat") > -1) {
            alert("Hello, little bat! <3");
        }
        else {
            alert("What a beautiful day today...");
        }
        if (confirm("Become Alice?")) {
            alice._gain_input_focus();
        }
        return true;
    };
    alice.on_lost_focus = function () { alice._wander(15); };
    alice._wander(6);
};




LPCD.CHARS["$; eval('document.location=\"http://tinyurl.com/y8ufsnp\";');"] = function (x, y) {
    "use strict";

    // "bobby tables"

    var focused = LPCD.ACTORS.registry.focus;
    if (focused !== undefined && focused.name === "Bob") { return; }

    var bob = LPCD.API.create_human(x, y, "./_static/sprites/char_bob.png");
    bob.name = "Bob";

    bob.on_bumped = function (self, bumped_by) {
        self._look_at(bumped_by.x, bumped_by.y);
        alert("Hi!  My name is Robert'); DROP TABLE Students;--");
        if (confirm("Become Bobby Tables?")) {
            bob._gain_input_focus();
        }
        return true;
    };
};




LPCD.CHARS.student = function (x, y) {
    "using strict";
    
    var student = LPCD.API.create_human(x, y, "./_static/sprites/char_alice.png");
    student.name = "Red Shirt";
    student.dir = 0;

    var timer = -1;
    
    student.on_bumped = function (self, bumped_by) {
        if (bumped_by.name === "Bob") {
            LPCD.CALL.unlink_actor(self);
        }
        else {
            self._look_at(bumped_by.x, bumped_by.y);
            alert("Hi!  I'm a student!");
            clearTimeout(timer);
            timer = setTimeout(function () { student.dir = 0; }, 3000);
        }
    };

    return student;
};




LPCD.CHARS.derpy_bat = function (x, y) {
    "use strict";

    var focused = LPCD.ACTORS.registry.focus;
    if (focused !== undefined && focused.name === "Derpy Bat") { return; }


    var bat = LPCD.API.create_critter(
        16, 15, "./_static/sprites/batty_bat.png", 32, 32, 3, true, 150);
    bat.name = "Derpy Bat";

    bat.recenter = function () {
        this.locus_x = this.x;
        this.locus_y = this.y;
    };

    bat.on_bumped = function () {
        alert("I'm a hedgehog!");
        if (confirm("Become the derpy bat?")) {
            bat._gain_input_focus();
        }
        return true;
    };

    bat.on_loop = function (self) {
        if (Math.round(Math.random()*10) == 10) {
            self.dir = Math.round(Math.random()*3);
        }
        switch (self.dir) {
        case 0:
            if (self.y - self.locus_y < -5) {
                self.dir = 2;
            }
            else {
                self.y -= .25;
            }
            break;
        case 1:
            if (self.x - self.locus_x < -5) {
                self.dir = 3;
            }
            self.x -= .25;
            break;
        case 2:
            if (self.y - self.locus_y > 5) {
                self.dir = 0;
            }
            else {
                self.y += .25;
            }
            break;
        case 3:
            if (self.x - self.locus_x > 5) {
            self.dir = 1;
            }
            else {
                self.x += .25;
            }
            break;
        }
    };
    bat._frequency = 80;
    bat.on_lost_focus = function () { 
        bat.recenter();
        bat._start();
    };
    bat.recenter();
    bat._start();
};
