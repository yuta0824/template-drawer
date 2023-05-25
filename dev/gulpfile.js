//Package
const { src, dest, series, watch, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const gcmq = require("gulp-group-css-media-queries");
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssdeclsort = require("css-declaration-sorter");
const sassGlob = require("gulp-sass-glob-use-forward");
const webp = require("gulp-webp");
const imagemin = require("gulp-imagemin");
const mozjpeg = require("imagemin-mozjpeg");
const pngquant = require("imagemin-pngquant");
const del = require("del");
const browserSync = require("browser-sync");

//デフォルト
const distBase = "../public"; // 出力ファイル名
const srcSass = "./scss/**/*.scss"; // Sass src path
const srcImg = "./img/**"; // img src path
const distCss = `${distBase}/assets/css`; // CSS output path
const distImg = `${distBase}/assets/img`; // img output path
const distFile = `${distBase}/**/*`;

// Sassのコンパイル;
const compileSass = (done) => {
	src(srcSass)
		.pipe(
			plumber({
				errorHandler: notify.onError("Error:<%= error.message %>"),
			})
		)
		.pipe(sassGlob())
		.pipe(sass())
		.pipe(postcss([autoprefixer()]))
		.pipe(
			postcss([
				cssdeclsort({
					order: "alphabetical",
				}),
			])
		)
		.pipe(gcmq()) // 追加
		.pipe(dest(distCss));
	done();
};

// ローカルサーバー立ち上げ
const browserSyncFunc = () => {
	browserSync.init(browserSyncOption);
};
const browserSyncOption = {
	server: {
		// ルートとなるディレクトリを指定
		baseDir: distBase,
	},
};

// ローカルサーバーリロード
const browserSyncReload = (done) => {
	browserSync.reload();
	done();
};

// 変更の監視
const watchFiles = (done) => {
	watch(srcSass, series(compileSass, browserSyncReload));
	watch(srcImg, series(copyImages, browserSyncReload));
	watch(distFile, browserSyncReload);
	done();
};

// clean
const clean = () => {
	return del(distImg, {
		force: true,
	});
};

// 画像をコピー
const copyImages = (done) => {
	src(srcImg).pipe(dest(distImg));
	done();
};

//webP圧縮変換
function imageMinWebp() {
	return src([`${srcImg}/**.png`, `${srcImg}/**.jpg`, `${srcImg}/**.jpeg`])
		.pipe(
			imagemin([
				pngquant({
					quality: [0.65, 0.7],
					speed: 1,
				}),
				mozjpeg({ progressive: true, quality: 65 }),
				imagemin.svgo({
					plugins: [{ removeViewBox: false }],
				}),
				imagemin.optipng(),
				imagemin.gifsicle({ optimizationLevel: 3 }),
			])
		)
		.pipe(
			webp({
				quality: 65,
				method: 6,
			})
		)
		.pipe(dest(`${distImg}`));
}

//webP変換
function imageWebp() {
	return src([`${srcImg}/**.png`, `${srcImg}/**.jpg`, `${srcImg}/**.jpeg`])
		.pipe(
			webp({
				quality: 90,
				method: 6,
			})
		)
		.pipe(dest(`${distImg}`));
}

// 画像圧縮
function imageMini() {
	return src([`${distImg}/**`, `!${distImg}/**/*.webp`])
		.pipe(
			imagemin([
				pngquant({
					quality: [0.65, 0.7],
					speed: 1,
				}),
				mozjpeg({ progressive: true, quality: 65 }),
				imagemin.svgo({
					plugins: [{ removeViewBox: false }],
				}),
				imagemin.optipng(),
				imagemin.gifsicle({ optimizationLevel: 3 }),
			])
		)
		.pipe(dest(distImg));
}

// タスク
exports.imagemin = imageMini;
exports.webp = imageWebp;
exports.webpmin = imageMinWebp;
exports.default = series(
	parallel(compileSass, copyImages, watchFiles, browserSyncFunc)
);
