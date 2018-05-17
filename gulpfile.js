(function () {
    'use strict'

    // 引入gulp
    var gulp = require('gulp');

    // 引入组件
    var less = require('gulp-less'),               // less
        minifyCSS = require('gulp-minify-css'),    // css压缩
        autoprefix = require('gulp-autoprefixer'), // 自动补齐前缀
        jshint = require('gulp-jshint'),           // js检测
        uglify = require('gulp-uglify'),           // js压缩
        concat = require('gulp-concat'),           // 合并文件
        rename = require('gulp-rename'),           // 重命名
        spritesmith = require('gulp.spritesmith'), // 精灵图
        imagemin = require('gulp-imagemin'),       // 图片压缩
        pngquant = require('imagemin-pngquant'),   //深度压缩png图片的imagemin插件
        changed = require('gulp-changed'),         // 过滤改动的文件
        clean = require('gulp-clean');             // 清空文件夹

    // 定义路径对象
    var srcRoot = 'src/';                            // 源目录文件夹 ./表示当前目录,这里没有设置./是因为需要监听新增的图片
    var distRoot = 'dist/';                     // 输出目录文件夹
    var paths = {
        src: {
            less: srcRoot + 'less/',
            scripts: srcRoot + 'js/',
            fonts: srcRoot + 'fonts/',
            img: srcRoot + 'img/'
        },
        dist: {
            css: distRoot + 'css/',
            scripts: distRoot + 'js/',
            fonts: distRoot + 'fonts/',
            img: distRoot + 'img/'
        }
    };

    //拷贝图片，开发环境不需要每次都压缩图片。之所以需要拷贝一次，是因为会执行clean任务。
    gulp.task('img', function () {
        var imgSrc = paths.src.img + '**/*.+(jpeg|jpg|png|svg|gif|ico)';
        var imgDest = paths.dist.img;

        return gulp.src(imgSrc)
            .pipe(changed(imgDest))
            .pipe(gulp.dest(imgDest))
    });

    // 压缩图片。只在build任务中才压缩图片
    gulp.task('imgMin', function () {
        var imgSrc = paths.src.img + '**/*.+(jpeg|jpg|png|svg|gif|ico)';
        var imgDest = paths.dist.img;

        return gulp.src(imgSrc)
            .pipe(changed(imgDest))
            .pipe(imagemin({
                optimizationLevel: 5,                     //类型：Number  默认：3  取值范围：0-7（优化等级）
                progressive: false,                        //类型：Boolean 默认：false 无损压缩jpg图片
                interlaced: true,                         //类型：Boolean 默认：false 隔行扫描gif进行渲染
                multipass: true,                          //类型：Boolean 默认：false 多次优化svg直到完全优化
                svgoPlugins: [{removeViewBox: false}],    //不要移除svg的viewbox属性
                use: [pngquant({quality: '65-80'})]
            }))
            .pipe(gulp.dest(imgDest))
    });
    gulp.task('sprite', function () {
        var spritSrc = paths.src.img + 'spirit/*.png';
        var spritImgDest = paths.dist.img + "spirit/";
        var spritCssDest = paths.src.less;

        var spriteData = gulp.src(spritSrc)
            .pipe(changed(spritImgDest))
            .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.less',
            cssFormat:"css",
            /*下面这个方法是自动生成精灵图的hover属性，但是可能执行不了，这时可以偷懒，直接把图片命名成带:hover后缀即可*/
            cssOpts: {
                cssClass: function (item) {
                    // If this is a hover sprite, name it as a hover one (e.g. 'home-hover' -> 'home:hover')
                    if (item.name.indexOf('-hover') !== -1) {
                        return '.icon-' + item.name.replace('-hover', ':hover');
                        // Otherwise, use the name as the selector (e.g. 'home' -> 'home')
                    } else {
                        return '.icon-' + item.name;
                    }
                }
            },
            /*imgPath这个参数是给生成的css文件提供图片地址，不写默认是／sprite.png*/
            imgPath: '../../'+spritImgDest+'sprite.png'
        }));
        spriteData.img
            .pipe(gulp.dest(spritImgDest));

        spriteData.css
            .pipe(gulp.dest(spritCssDest));
    });

    //less转css,自动补齐前缀并压缩
    //这里依赖sprite任务是因为，sprite任务会生成一个icon的css文件，在css任务中可能用到
    gulp.task('css',['sprite'], function () {
        var cssSrc = paths.src.less + 'style.less';
        var cssDest = paths.dist.css;

        return gulp.src(cssSrc)
            .pipe(changed(cssDest))
            .pipe(less())
            .pipe(autoprefix())
            .pipe(gulp.dest(cssDest))
    });

    gulp.task('cssMin',['sprite'], function () {
        var cssSrc = paths.src.less + 'style.less';
        var cssDest = paths.dist.css;

        return gulp.src(cssSrc)
            .pipe(changed(cssDest))
            .pipe(less())
            .pipe(autoprefix())
            .pipe(rename({ suffix: '.min' }))
            .pipe(minifyCSS(
                {
                    advanced: false,
                    aggressiveMerging: false
                }))
            .pipe(gulp.dest(cssDest))
    });

    // 检查、合并、压缩js文件
    gulp.task('js', function () {
        var jsSrc = paths.src.scripts + '**/*.js';
        var jsDest = paths.dist.scripts;

        return gulp.src(jsSrc)
            .pipe(changed(jsDest))
            // .pipe(jshint())
            // .pipe(jshint.reporter('default'))
            /*.pipe(concat('all.js'))*/
            .pipe(gulp.dest(jsDest))
    });

    gulp.task('jsMin', function () {
        var jsSrc = paths.src.scripts + '**/*.js';
        var jsDest = paths.dist.scripts;

        return gulp.src(jsSrc)
            .pipe(changed(jsDest))
            // .pipe(jshint())
            // .pipe(jshint.reporter('default'))
            /*.pipe(concat('all.js'))*/
            .pipe(rename({ suffix: '.min' }))
            .pipe(uglify())
            .pipe(gulp.dest(jsDest))
    });

    //拷贝字体
    gulp.task('fonts', function () {
        var fontSrc = paths.src.fonts + '*.*';
        var fontDest = paths.dist.fonts;

        return gulp.src(fontSrc)
            .pipe(changed(fontDest))
            .pipe(gulp.dest(fontDest))
    });

    //定义监听任务
    gulp.task('watch', ['default'], function () {
        gulp.watch(paths.src.img + '**/*.+(jpeg|jpg|png|svg|gif|ico)', ['imgMin']);//此任务好像没有效果？ 原因：用 './xx' 开头作为当前路径开始，会导致无法监测到新增文件，所以直接省略掉 './' 即可。'./images/*' === 'images/*'
        gulp.watch(paths.src.less + '**/*.less', ['cssMin']);
        gulp.watch(paths.src.scripts + '*.js', ['jsMin']);
    });

    // 清空dist目录下的所有文件
    gulp.task('clean', function () {
        return gulp.src(distRoot + '**/**.*', {read: false})
            .pipe(clean({force: true}));
    });

    // gulp命令默认启动的就是default认为,这里将clean任务作为依赖,也就是先执行一次clean任务,流程再继续.
    gulp.task('default', ['clean'], function () {
        gulp.start('imgMin', 'cssMin', 'jsMin', 'fonts');
    });

    //push时需要调用的任务，在build中调用
    gulp.task('build', ['clean'],  function () {
        gulp.start('imgMin', 'cssMin', 'jsMin', 'fonts');
    });
})();
