window.onload = function () {
    initPage();
    var wow = new WOW({
        boxClass: 'wow',
        animateClass: 'animated',
        offset: 100,
        mobile: true,
        live: true
    });
    wow.init();
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




