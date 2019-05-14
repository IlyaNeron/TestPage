"use strict";

var gulp         = require('gulp'), // Подключаем Gulp
	sass         = require('gulp-sass'), //Подключаем Sass пакет,
	browserSync  = require('browser-sync'), // Подключаем Browser Sync
	concat       = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
	uglify       = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
	cssnano      = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
	rename       = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
	del          = require('del'), // Подключаем библиотеку для удаления файлов и папок
	imagemin     = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
	pngquant     = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
	cache        = require('gulp-cache'), // Подключаем библиотеку кеширования
	autoprefixer = require('gulp-autoprefixer'),// Подключаем библиотеку для автоматического добавления префиксов
	plumber      = require('gulp-plumber'),
	sourcemaps   = require('gulp-sourcemaps'),
	babel        = require('gulp-babel'),
	del          = require('del')

gulp.task('sass', function(){ // Создаем таск Sass
	return gulp.src('dev/scss/**/*.scss') // Берем источник
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError)) // Преобразуем Sass в CSS посредством gulp-sass
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('dev/css')) // Выгружаем результата в папку app/css
		.pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

gulp.task('browser-sync', function () {
	browserSync({
		server: {
			baseDir: "../",
			index: "index.html",
			directory: true
		},
		notify: false
	});
});

gulp.task('cleanMin', function () {
	return del((['dev/js/main.min.js']))
});

gulp.task('scripts', ['cleanMin'], function() {
	return gulp.src(['dev/js/*.js'])
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(concat('main.min.js')) // Собираем их в кучу в новом файле main.min.js
		.pipe(uglify()) // Сжимаем JS файл
		.pipe(gulp.dest('dev/js')); // Выгружаем в папку dev/js
});

gulp.task('css-libs', ['sass'], function() {
	return gulp.src('dev/css/main.css') // Выбираем файл для минификации
		.pipe(cssnano()) // Сжимаем
		.pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
		.pipe(gulp.dest('dev/css')); // Выгружаем в папку app/css
});

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() {
	gulp.watch('dev/scss/**/*.scss', ['sass']); // Наблюдение за sass файлами в папке sass
	gulp.watch('dev/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
	gulp.watch('dev/js/**/*.js', browserSync.reload);   // Наблюдение за JS файлами в папке js
});

gulp.task('clean', function() {
	return del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('img', function() {
	return gulp.src('dev/img/**/*') // Берем все изображения из app
		.pipe(cache(imagemin({ // С кешированием
		// .pipe(imagemin({ // Сжимаем изображения без кеширования
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))/**/)
		.pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});

gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function() {

	let buildCss = gulp.src([ // Переносим библиотеки в продакшен
		'dev/css/main.css',
		'dev/css/main.min.css'
		])
	.pipe(gulp.dest('dist/css'));

	let buildFonts = gulp.src('dev/fonts/**/*') // Переносим шрифты в продакшен
	.pipe(gulp.dest('dist/fonts'));

	let buildJs = gulp.src([
		'dev/js/main.min.js',
		'dev/js/swiper.js'
	]) // Переносим скрипты в продакшен
	.pipe(gulp.dest('dist/js'));

	let buildHtml = gulp.src('dev/*.html') // Переносим HTML в продакшен
	.pipe(gulp.dest('dist'));

});

gulp.task('clear', function (callback) {
	return cache.clearAll();
});

gulp.task('default', ['watch']);
