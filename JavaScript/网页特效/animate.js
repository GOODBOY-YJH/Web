function animate(obj, target, callback) {
    clearInterval(obj.timer);
    obj.timer = window.setInterval(function() {
        var step = (target - div.offsetLeft) / 10;
        step = step > 0 ? Math.ceil(step) : Math.floor(step);
        if (div.offsetLeft >= target) {
            clearInterval(obj.timer);
            if (callback) {
                callback();
            }
            return;
        }

        div.style.left = div.offsetLeft + step + 'px';
    }, 30);
};

function red() {
    div.style.backgroundColor = 'red';
};