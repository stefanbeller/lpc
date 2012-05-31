
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

  Character definitions.


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
    var barrel = LPCD.API.create_object(x, y, "./_static/gamesprites/barrel.png");
    barrel._crop(0, 0, 32, 48)
    barrel._block_width = 2;
    barrel._block_height = 1;
    barrel.on_bumped = undefined;
    return barrel;
};




LPCD.CHARS.chest = function (x, y) {
    var chest = LPCD.API.create_object(x, y, "./_static/gamesprites/chests.png");
    chest._block_width = 2;
    chest._block_height = 2;
    LPCD.API.store_default("chest", true);

    if (LPCD.API.fetch("chest")) {
        chest._crop(0, 0, 32, 32);
    }
    else {
        chest._crop(0, 64, 32, 32);
    }
    chest.on_bumped = function (self, bumped_by) {
        bumped_by._look_at(self.x, self.y);
        if (LPCD.API.fetch("chest")) {
            chest._crop(0, 64, 32, 32);
            LPCD.API.alert("Woah!  You found something awesome!");
            LPCD.API.store("chest", false)
            return true;
        }
    };
    return chest;
};




LPCD.CHARS.alice = function (x, y) {
    "use strict";
    
    var focused = LPCD.ACTORS.registry.focus;
    if (focused !== undefined && focused.name === "Alice") { return; }

    var alice = LPCD.API.create_human(x, y, "./_static/gamesprites/char_alice.png");
    alice.name = "Alice";

    alice.on_bumped = function (self, bumped_by) {
        self._look_at(bumped_by.x, bumped_by.y);
        bumped_by._look_at(self.x, self.y);
        if (bumped_by.name.indexOf("Bat") > -1) {
            LPCD.API.alert("Hello, little bat! <3");
        }
        else {
            LPCD.API.alert("What a beautiful day today...");
        }
        if (LPCD.API.confirm("Become Alice?")) {
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

    var bob = LPCD.API.create_human(x, y, "./_static/gamesprites/char_bob.png");
    bob.name = "Bob";

    bob.on_bumped = function (self, bumped_by) {
        self._look_at(bumped_by.x, bumped_by.y);
        bumped_by._look_at(self.x, self.y);
        LPCD.API.alert("Hi!  My name is Robert'); DROP TABLE Students;--");
        if (LPCD.API.confirm("Become Bobby Tables?")) {
            bob._gain_input_focus();
        }
        return true;
    };
};




LPCD.CHARS.student = function (x, y) {
    "using strict";
    
    var student = LPCD.API.create_human(x, y, "./_static/gamesprites/student_a.png");
    student.name = "Red Shirt";
    student.dir = 0;

    var timer = -1;
    
    student.on_bumped = function (self, bumped_by) {
        if (bumped_by.name === "Bob") {
            LPCD.CALL.unlink_actor(self);
        }
        else {
            self._look_at(bumped_by.x, bumped_by.y);
            bumped_by._look_at(self.x, self.y);
            LPCD.API.alert("Hi!  I'm a student!");
            clearTimeout(timer);
            timer = setTimeout(function () { student.dir = 0; }, 3000);
        }
    };

    return student;
};




LPCD.CHARS.critter = function (x, y, sprite) {
    var critter = LPCD.API.create_critter(
        x, y, sprite!==undefined?sprite:"./_static/gamesprites/batty_bat.png", 32, 32, 3, true, 150);
    critter.name = "critter";
    critter.on_bumped = function () {};
    critter._frequency = 200;
    critter.on_lost_focus = function () { critter._wander(10); };
    setTimeout(function() { critter._wander(10); }, 500);
    return critter;
};




LPCD.CHARS.bat = function (x, y) {
    "use strict";

    var bat = LPCD.CHARS.critter(x, y, "./_static/gamesprites/batty_bat.png");
    bat.name = "Homerun Bat";
    return bat;
};




LPCD.CHARS.bee = function (x, y) {
    "use strict";

    var bee = LPCD.CHARS.critter(x, y, "./_static/gamesprites/bee.png");
    bee.name = "Lazy Bee";
    return bee;
};




LPCD.CHARS.worm = function (x, y) {
    "use strict";

    var worm = LPCD.CHARS.critter(x, y, "./_static/gamesprites/small_worm.png");
    worm.name = "Little Worm";
    return worm;
};




LPCD.CHARS.eyeball = function (x, y) {
    "use strict";

    var critter = LPCD.API.create_critter(
        x, y, "./_static/gamesprites/eyeball.png", 32, 38, 3, true, 100);
    critter._img_y_offset = -2;
    critter.name = "Eyeball";
    critter.on_bumped = function () {};
    critter._frequency = 200;
    critter.on_lost_focus = function () { critter._wander(10); };
    setTimeout(function() { critter._wander(10); }, 500);
    return critter;
};




LPCD.CHARS.slime = function (x, y) {
    "use strict";

    var slime = LPCD.CHARS.critter(x, y, "./_static/gamesprites/slime.png");
    slime.name = "Green Slime";
    return slime;
};




LPCD.CHARS.snake = function (x, y) {
    "use strict";

    var snake = LPCD.CHARS.critter(x, y, "./_static/gamesprites/snake.png");
    snake.name = "Oh so snake!";
    return snake;
};




LPCD.CHARS.derpy_bat = function (x, y) {
    "use strict";

    var focused = LPCD.ACTORS.registry.focus;
    if (focused !== undefined && focused.name === "Derpy Bat") { return; }

    var bat = LPCD.CHARS.bat(x, y);
    bat.name = "Derpy Bat";

    bat.on_bumped = function () {
        LPCD.API.alert("I'm a hedgehog!");
        if (LPCD.API.confirm("Become the derpy bat?")) {
            bat._gain_input_focus();
        }
        return true;
    };
};
