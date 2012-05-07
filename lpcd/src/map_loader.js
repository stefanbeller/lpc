



/******************************************************************************

   Functions related to loading level data.

 ******************************************************************************/


// "set_wall" is used to add single a wall block.
LPCD.CALL.set_wall = function (x, y) {
    "use strict";

    var _x = Math.round(x);
    var _y = Math.round(y);
    LPCD.DATA.level.walls[String(_x)+","+String(_y)] = true;
};


// "add_tile" blits a tile into a tile layer.
LPCD.CALL.add_tile = function (sx, sy, dx, dy, uri, layer) {
    "use strict";
    
    var canvas = LPCD.DOM.layers[layer];
    var img = LPCD.DOM.res[uri];
    canvas.ctx.drawImage(img, sx*32, sy*32, 32, 32, dx*32, dy*32, 32, 32);
};


// "build_map" takes map data and creates game objects from it.
// Must be called after image resources are ready.
LPCD.CALL.build_map = function (mapdata) {
    "use strict";
    var level = LPCD.DATA.level;  // shorthand
    level.debug = mapdata;

    for (var i=0; i<mapdata.layers.length; i+=1) {
        var layer = mapdata.layers[i];
        var _x = 0;
        var _y = 0;
        for (var k=0; k<layer.data.length; k+=1) {
            if (layer.data[k] > 0) {
                var tile = mapdata.lookup_tile(layer.data[k]);
                if (tile !== false) {
                    var target = layer.properties.target === undefined ? "below" : layer.properties.target;
                    LPCD.CALL.add_tile(tile.sx, tile.sy, _x, _y, tile.uri, target);
                    if (layer.properties.is_walls !== undefined && layer.properties.is_walls > 0) {
                        // layer wall info has priority
                        LPCD.CALL.set_wall(_x*2,_y*2);
                        LPCD.CALL.set_wall(_x*2,_y*2+1);
                        LPCD.CALL.set_wall(_x*2+1,_y*2+1);
                        LPCD.CALL.set_wall(_x*2+1,_y*2);
                    }
                    else if (tile.props !== undefined && tile.props.wall !== undefined) {
                        // otherwise use the semantic value give to the wall
                        var points;
                        switch ( tile.props.wall ) {
                        case "a":
                            points = [[0,0],[0,1],[1,0],[1,1]];
                            break;
                        case "nw":
                            points = [[0,0]];
                            break;
                        case "n":
                            points = [[0,0],[1,0]];
                            break;
                        case "ne":
                            points = [[1,0]];
                            break;
                        case "e":
                            points = [[1,0], [1,1]];
                            break;
                        case "se":
                            points = [[1,1]];
                            break;
                        case "s":
                            points = [[0,1],[1,1]];
                            break;
                        case "sw":
                            points = [[0,1]];
                            break;
                        case "w":
                            points = [[0,0],[0,1]];
                            break;
                        default:
                            points = [];
                        }
                        for (var j=0; j<points.length; j+=1) {
                            LPCD.CALL.set_wall(_x*2+points[j][0], _y*2+points[j][1]);
                        }
                    }
                }
                else {
                    console.info("no such tile: " + layer.data[k]);
                }
            }
            _x += 1;
            if (_x == mapdata.width) {
                _y += 1;
                _x = 0;
            }
        }
    }
};




/******************************************************************************

   Callbacks related to loading level data.

 ******************************************************************************/


// "map_ready" is called when map data is available.  It is responsible for
// fetching images;  when all needed images are loaded, the "make" event is
// then called and mouse events are bound.
LPCD.EVENT.map_ready = function (mapdata, status) {
    var pending = 0;
    var hold = true;
    var make_it_so = function () {
        LPCD.CALL.build_map(mapdata);
        LPCD.EVENT.make();
        LPCD.DOM.doc.body.onclick = LPCD.EVENT.on_click;
    };
    var image_loaded = function () {
        pending -= 1;
        if (pending === 0 && !hold) {
            make_it_so();
        }
    }
    if (mapdata.orientation !== "orthogonal") {
        throw("This demo only supports orthogonal maps!");
    }

    for (var i=0; i<mapdata.tilesets.length; i+=1) {
        var tileset = mapdata.tilesets[i];
        var img_path = tileset.image;
        if (img_path.indexOf("../sprites/") === 0) {
            img_path = img_path.slice(1);
        }
        pending += 1;
        LPCD.DOM.res[tileset.image] = new Image();
        LPCD.DOM.res[tileset.image].onload = image_loaded;
        LPCD.DOM.res[tileset.image].src = img_path;

        // add some extra functions to help level construction later on
        mapdata.tilesets[i]._w = Math.floor(tileset.imagewidth/32);
        mapdata.tilesets[i]._h = Math.floor(tileset.imageheight/32);
        mapdata.tilesets[i]._count = tileset._w * tileset._h;
        mapdata.tilesets[i].has = function (gid) {
            return gid >= this.firstgid && gid < this.firstgid + this._count;
        };
        mapdata.tilesets[i].get = function (gid) {
            var within = gid - this.firstgid;
            var x = within % this._w;
            var props;
            if (this.tileproperties !== undefined) {
                props = this.tileproperties[within];
            }
            return {"props":props, "sx":x, "sy":((within-x)/this._w)};
        }
    }
    mapdata.lookup_tile = function (gid) {
        for (var i=0; i<mapdata.tilesets.length; i+=1) {
            var tileset = mapdata.tilesets[i];
            if (tileset.has(gid)) {
                var tile = tileset.get(gid);
                tile.uri = tileset.image;
                return tile;
            }
        }
        return false;
    }
    LPCD.DATA.level = {
        "walls" : {},
        "min_x" : 0,
        "min_y" : 0,
        "max_x" : mapdata.width,
        "max_y" : mapdata.height
    };
    LPCD.DOM.layers = {};
    var setup_layer = function (name) {
        var el = LPCD.DOM.doc.createElement("canvas");
        el.ctx = el.getContext('2d');
        el.width = 32 * mapdata.width;
        el.height = 32 * mapdata.height;
        el.id = "layer_"+name;
        LPCD.DOM.layers[name] = el;
        LPCD.DOM.doc.body.appendChild(el);
    };
    setup_layer("above");
    setup_layer("below");
    
    hold = false;
    if (pending === 0) {
        make_it_so();
    }
};


// "make" is used to build the level, bootstrap the game, and start the demo.
LPCD.EVENT.make = function () {
    "use strict";
    
    // set the player stats:
    var player = LPCD.DATA.player;
    player.x = 32;
    player.y = 32;
    player.state = 0;
    player.dir = 2;

    player.el = LPCD.DOM.doc.createElement("canvas");
    player.el.id = "player";
    player.el.width = 32;
    player.el.height = 48;
    LPCD.DOM.doc.body.appendChild(player.el);
    player.ctx = player.el.getContext("2d");

    LPCD.DOM.doc.getElementById("text_overlay").style.display = "none";
    LPCD.EVENT.on_redraw();
};
