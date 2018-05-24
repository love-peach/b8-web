window.onload = function () {
    initPage();
    var wow = new WOW({
        boxClass: 'wow',
        animateClass: 'animated',
        offset: 100,
        mobile: false,
        live: true
    });
    wow.init();

    var throttleScroll = throttle(function () {
        scrollHandler();
    }, 0);
    window.addEventListener('scroll', throttleScroll);
};

function initPage() {
    var objLoading = document.getElementById("js-loading-wrapper");
    if (objLoading != null) {
        objLoading.style.opacity = 0;
        setTimeout(function() {
            objLoading.style.display = 'none';
        }, 500)
    }
}
var jsHeader = document.getElementById('jsHeader');
function scrollHandler() {
    var t = document.documentElement.scrollTop || document.body.scrollTop;
    if(t > (window.innerHeight - 100)) {
        jsHeader.classList.add('header-black');
    } else {
        jsHeader.classList.remove('header-black');
    }
}

function throttle(fn, delay) {
    var timer = null;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn();
        }, delay);
    };
}




