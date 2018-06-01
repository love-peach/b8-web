window.onload = function () {
    initPage();
    var wow = new WOW({
        boxClass: 'wow',
        animateClass: 'animated',
        offset: 150,
        mobile: false,
        live: true
    });
    wow.init();

    var jsNavMenu = document.getElementById('jsNavMenu');
    var navListPc = document.getElementById('navListPc');
    var navListPcLink = navListPc.getElementsByTagName('a');
    var navListPhone = document.getElementById('navListPhone');
    var navListPhoneLink = navListPhone.getElementsByTagName('a');
    eventAttach(navListPcLink);
    eventAttach(navListPhoneLink);
    jsNavMenu.onclick = function () {
        navListPhone.style.display = 'block';
    };

    var throttleScroll = throttle(function () {
        scrollHandler();
    }, 50);
    window.addEventListener('scroll', throttleScroll);


    /* 页面加载完成后, 去掉loading */
    function initPage() {
        var objLoading = document.getElementById("js-loading-wrapper");
        if (objLoading != null) {
            objLoading.style.opacity = 0;
            setTimeout(function() {
                objLoading.style.display = 'none';
            }, 100)
        }
    }

    /* 滚动导航相关 */

// 声明每个导航点的名字
    var navListName = ['home', 'keyIssues', 'solution', 'about', 'joinUs'];
// 获取每个导航点的高度
    var anchorPointOffsetHeight = getAnchorPointOffsetHeight(navListName);
    /* 滚动事件 */
    function scrollHandler() {
        var t = document.documentElement.scrollTop || document.body.scrollTop;
        var distance =  t + 150;
        for(var i = 0; i < anchorPointOffsetHeight.length; i++) {
            if(distance >= anchorPointOffsetHeight[i] && anchorPointOffsetHeight[i + 1] > distance) {
                setActiveNav(i);
                break;
            }
        }
    }

    /* 导航高亮方法 */
    var navListAll = document.getElementsByName('link');
    function setActiveNav(activeIndex) {
        navListAll.forEach(function (item) {
            item.classList.remove('active');
        });
        var activeNavPc= navListPc.querySelector('a[href="#' + navListName[activeIndex] + '"]');
        var activeNavPhone= navListPhone.querySelector('a[href="#' + navListName[activeIndex] + '"]');
        activeNavPc.classList.add('active');
        activeNavPhone.classList.add('active');
    }

    /* 给 a link 绑定事件*/
    function eventAttach(links) {
        for(var i = 0; i < links.length; i++) {
            (function(index) {
                links[i].onclick = function() {
                    scrollMove(anchorPointOffsetHeight[index] - 50, 300);
                    navListPhone.style.display = 'none';
                }
            })(i);
        }
    }

    /* 平滑滚动到目标位置 */
    function scrollMove(scrollTo, time) {
        var scrollFrom = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        var count = 0;
        var every = 10;
        scrollTo = parseInt(scrollTo);
        time /= every;

        var interval = setInterval(function () {
            count++;
            document.documentElement.scrollTop = document.body.scrollTop = (scrollTo - scrollFrom) / time * count + scrollFrom;
            if (count >= time) {
                clearInterval(interval);
            }
        }, every);
    }

    /* 获取锚点的高度 */
    function getAnchorPointOffsetHeight (navs) {
        return navs.map(function (item) {
            return document.getElementById(item).offsetTop;
        })
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
};



