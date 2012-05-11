                      Liberated Pixel Cup README
                      ==========================



1 Introduction 
---------------

Welcome to the Liberated Pixel Cup style guide and base asset
directory!  The Liberated Pixel Cup is a contest for free software and
free culture game authoring sponsored by Creative Commons, the Free
Software Foundation, Mozilla, and OpenGameArt.  To learn more about
Liberated Pixel Cup, please visit the [Liberated Pixel Cup website].

This repository contains both documentation (particularly, defining
the style) and base assets for the Liberated Pixel Cup.  As a bonus
and demonstration, it also includes a simple "walkaround demo game" in
the documentation.


[Liberated Pixel Cup website]: http://lpc.opengameart.org/

2 Building the documentation 
-----------------------------

Building the documentation is simple.  Make sure you have [Sphinx]
installed on your system.  On Debianoid GNU/Linux systems, you can
install it like:

$ sudo apt-get install python-sphinx

You can then compile the documentation using make:

$ make

This should build everything into the build/ directory.  You can now
open this like so:

$ firefox build/index.html


[Sphinx]: http://sphinx.pocoo.org/

3 Sprites/tiles/assets 
-----------------------

You can find the base assets in the ~sprites/~ folder in this directory.

4 Copying and license 
----------------------

See the file COPYING in this directory.  But in sum, all code is [GPLv3]
or later, all documentation (including this file) and image/sprite
assets are dual licensed under GPLv3 or later and [CC BY-SA 3.0].

[GPLv3]: http://www.gnu.org/licenses/gpl-3.0.html
[CC BY-SA 3.0]: http://creativecommons.org/licenses/by-sa/3.0/

