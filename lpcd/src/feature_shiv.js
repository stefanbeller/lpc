
(function () {
    var ani_timeout = -1;
    window.RequestAnimationFrame = window.RequestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        if (ani_timeout === -1) {
            ani_timeout = setTimeout(function(){ callback(); ani_timeout = -1; }, 100/60);
        }
    };  
})();