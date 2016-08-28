
var pointsArray = document.getElementsByClassName('point');

var revealPoint = function(point) {
    point.style.opacity = 1;
    point.style.transform = "scaleX(1) translateY(0)";
    point.style.msTransform = "scaleX(1) translateY(0)";
    point.style.WebkitTransform = "scaleX(1) translateY(0)";
};

var animatePoints = function(point) {
    forEach(point, revealPoint);
};

window.onload = function() {
    if (window.innerHeight > 950) {
        revealPoint(pointsArray);
    }  
    
    var sellingPoints = document.getElementsByClassName('selling-points')[0];
    var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 400;

    window.addEventListener("scroll", function(event) {
        if (document.documentElement.scrollTop || document.body.scrollTop.getBoundingClientRect().top + " pixels"); {
        animatePoints(pointsArray);
        }
    });
}