var p1 = document.getElementById('page1');
var p2 = document.getElementById('page2');

var startingX;

function p1handleTouchStart(evt) {
    startingX = evt.touches[0].clientX;
}

function p1handleTouchMove(evt) {
    var touch = evt.touches[0];
    var change = startingX - touch.clientX;
    if (change < 0) {
        return;
    }
    p1.style.left = '-' + change + 'px';
    p2.style.display = 'block';
    p2.style.left = (screen.width - change) + 'px';
    evt.preventDefault();
}

function p1handleTouchEnd(evt) {
    var change = startingX - evt.changedTouches[0].clientX;
    var treshold = screen.width / 3;
    if (change < treshold) {
        p1.style.left = 0;
        p2.style.left = '100%';
        p2.style.display = 'none';
    } else {
        p1.style.transition = 'all .3s';
        p2.style.transition = 'all .3s';
        p1.style.left = '-100%';
        p2.style.left = '0';
        p2.style.display = 'block';
    }
}

function p2handleTouchStart(evt) {
    startingX = evt.touches[0].clientX;
    p1.style.transition = '';
    p2.style.transition = '';
    p1.style.display = 'none';
}

function p2handleTouchMove(evt) {
    var touch = evt.touches[0];
    var change = touch.clientX - startingX;
    if (change < 0) {
        return;
    }
    p1.style.display = 'block';
    p1.style.left = (change - screen.width) + 'px';
    p2.style.left = change + 'px';
    evt.preventDefault();
}

function p2handleTouchEnd(evt) {
    var change = evt.changedTouches[0].clientX - startingX;
    var half = screen.width / 4;
    if (change < half) {
        p1.style.left = '-100%';
        p1.style.display = 'none';
        p2.style.left = '0';
    } else {
        p1.style.transition = 'all .3s';
        p2.style.transition = 'all .3s';
        p1.style.left = '0';
        p2.style.left = '100%';
    }
}