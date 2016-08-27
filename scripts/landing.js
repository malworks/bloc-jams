
var revealPoint = function() {
    var point = document.getElementsByClassName('point');

    for (var i = 0; i < point.length; i++) {
        point[i].style.opacity = 1;
        point[i].style.transform = "scaleX(1) translateY(0)";
        point[i].style.msTransform = "scaleX(1) translateY(0)";
        point[i].style.WebkitTransform = "scaleX(1) translateY(0)";
    }
}

revealPoint();