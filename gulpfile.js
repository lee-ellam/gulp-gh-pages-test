var gulp = require('gulp');
var less = require('gulp-less');
var csslint = require('gulp-csslint');
var autoprefixer = require('gulp-autoprefixer');
var reporter = require('gulp-less-reporter');
var connect = require('gulp-connect');
var htmlhint = require('gulp-htmlhint');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var lessBower = require('less-plugin-bower-resolve');
var gutil = require('gulp-util');
var glob = require('glob');
var es = require('event-stream');
var runSequence = require('run-sequence');
var Server = require('karma').Server;
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var git = require('gulp-git');
var ghPages = require('gulp-gh-pages');
var bump = require('gulp-bump');
var fs = require('fs');
var del = require('del');
var todo = require('gulp-todo');
var flatten = require('gulp-flatten');

//++++++++++++++++++++++
//+ Private vars
//++++++++++++++++++++++

var portNumber = 8998;

//++++++++++++++++++++++++
//+ CLI tasks [public]
//++++++++++++++++++++++++

// These are the tasks you should run up from the command line
gulp.task('default', function( callback ) {
	runSequence(
		['clean:build'],
		[
			'todo',
			'copy:package-bundles',
			'copy:html',
			'copy:config',
			'modules:less',
			'modules:js',
			'lint:js',
			'lint:html',
			'serve:dev',
			'watch:html',
			'watch:less',
			'watch:js',
			'test'
		]
	, callback);
});

gulp.task('release:patch', function( callback ) {
	runSequence(
		['test'],
		['bump:patch'],
		['createTag']
	, callback);
});

gulp.task('release:minor', function( callback ) {
	runSequence(
		['test'],
		['bump:minor'],
		['createTag']
	, callback);
});

gulp.task('release:major', function( callback ) {
	runSequence(
		['test'],
		['bump:major'],
		['createTag']
	, callback);
});

gulp.task('publish', function( callback ) {
	runSequence(
		['clean:build'],
		[
			'copy:package-bundles',
			'copy:html',
			'copy:config',
			'modules:less',
			'modules:js'
		],
		['publish:deploy']
	, callback)
});

//++++++++++++++++++++++
//+ Tasks [private]
//++++++++++++++++++++++

//++++++++++++++++++++++
//+ Less
//++++++++++++++++++++++

gulp.task('modules:less', ['clean:css-modules'], function () {
	return gulp.src('./demo/src/**/*.less')
		.pipe(less({
			plugins: [lessBower]
		}))
		.on('error', function(err){
			gutil.log(gutil.colors.red(Error ('Less Error: ') + err.message));
			this.emit('end');
		})
		.pipe(autoprefixer())
		.pipe(csslint('./csslintrc.json'))
		.pipe(csslint.reporter())
		.pipe(gulp.dest('demo/build'));
});

//++++++++++++++++++++++
//+ Javascript
//++++++++++++++++++++++

gulp.task('modules:js', ['clean:js-modules'], function ( done ) {
	glob('./demo/src/**/*.js', function( err, files ) {
		if ( err ) {
			done( err );
		}
		var tasks = files.map( function( entry ) {
			var dest = entry.replace( 'src', 'build' );
			return browserify({
				entries: [entry],
				paths: [
					'./',
					'./node_modules',
					'./bower_components/'
				   ]
				})
				.transform(babelify)
				.bundle()
				.on('error', function(err){
					gutil.log(gutil.colors.red(Error ('Browserify Error: ') + err.message));
					this.emit('end');
				})
				.pipe(source('./'))
				.pipe(gulp.dest(dest));
			});
		es.merge(tasks).on( 'end', done );
	});
});

//++++++++++++++++++++++
//+ Lint
//++++++++++++++++++++++

gulp.task('lint:js', function() {
	return gulp.src(['./demo/src/**/*.js', './components/**/*.js'])
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jscs());
});

gulp.task('lint:html', function() {
	return gulp.src(['./demo/src/**/*.html'])
		.pipe(htmlhint('./htmlhintrc.json'))
		.pipe(htmlhint.reporter())
});

//++++++++++++++++++++++
//+ Copy
//++++++++++++++++++++++

gulp.task('copy:html', function () {
	return gulp.src('./demo/src/**/*.html')
		.pipe(gulp.dest('./demo/build/'));
});

gulp.task('copy:package-bundles', function () {
	return gulp.src([
			'./bower_components/justgiving-bundle-global/dist/css/global.min.css',
			'./bower_components/justgiving-bundle-global/dist/css/global.min.css.map',
			'./bower_components/justgiving-bundle-global/dist/js/global.min.js',
			'./bower_components/justgiving-bundle-global/dist/js/global.min.js.map',
			'./bower_components/justgiving-bundle-head/dist/head.min.js',
			'./bower_components/justgiving-bundle-head/dist/head.min.js.map',
			'./bower_components/dna-styleguide/dist/css/styleguide.min.css',
            './bower_components/dna-styleguide/dist/css/styleguide.min.css.map'
		])
		.pipe(gulp.dest('./demo/build/package/'));
});

gulp.task('copy:config', function () {
	return gulp.src([
		'./bower_components/justgiving-tools/config/**/*',
		'./bower_components/justgiving-tools/config/**/.*',
		'!./bower_components/justgiving-tools/config/lint/js/.jshintrc-angular',
		'!./bower_components/justgiving-tools/config/test/karma.conf.js'
		])
		.pipe(flatten())
		.pipe(gulp.dest('./'));
});

//++++++++++++++++++++++
//+ Clean
//++++++++++++++++++++++

gulp.task('clean:build', function ( callback ) {
	del(['./demo/build/'], callback);
});

gulp.task('clean:js-modules', function ( callback ) {
	del(['./demo/build/**/*.js', '!./demo/build/package/*.*'], callback);
});

gulp.task('clean:css-modules', function ( callback ) {
	del(['./demo/build/**/*.css', '!./demo/build/package/*.*'], callback);
});


//++++++++++++++++++++++
//+ Server
//++++++++++++++++++++++

gulp.task('serve:dev', function() {
	connect.server({
		root: 'demo/build',
		port: portNumber,
		livereload: true
	});
});

gulp.task('serve:reload', function(){
	gulp.src('')
		.pipe(connect.reload());
});

//++++++++++++++++++++++
//+ Test
//++++++++++++++++++++++

// Pre-release test task
gulp.task('test', function(done) {
	Server.start({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, function( result ) {
		if ( result === 0 ){
			done();
		} else if ( result === 1 ) {
			gutil.log(gutil.colors.bgRed(new Error('Failing tests. Please fix tests before continuing ')));
		}
	});
});

// TDD test task
gulp.task('test:dev', function (done) {
	 Server.start({
		configFile: __dirname + '/karma.conf.js',
		autoWatch: true
	}, function() {
		done();
	});
});

//++++++++++++++++++++++
//+ Release
//++++++++++++++++++++++

gulp.task('bump:patch', function() {
	return bumpPackage('patch');
});

gulp.task('bump:minor', function() {
	return bumpPackage('minor');
});

gulp.task('bump:major', function() {
	return bumpPackage('major');
});

gulp.task('createTag', function(){
	createTag();
});

function bumpPackage(importance) {
	return gulp.src(['./package.json', './bower.json'])
		.pipe(bump({type: importance}))
		.pipe(gulp.dest('./'))
		.pipe(git.commit('Gulp: bumped package version'));
}

function createTag() {
	var version = getPackageJsonVersion();
	git.tag(version, 'Created Git tag for version: ' + version, function (error) {
		if (error) {
			gutil.log(gutil.colors.red(Error ('Git tag error : ') + error.message));
			return;
		}
		git.push('origin', 'master', {args: '--tags'});
	});

	gutil.log(gutil.colors.bgGreen(' You must now create a Github release v' + version + ' using tag ' + version + ' '));

	function getPackageJsonVersion () {
		return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
	};
}

//++++++++++++++++++++++
//+ Todo
//++++++++++++++++++++++

gulp.task('todo', function(){
	return gulp.src([
		'./components/**/*.js',
		'./components/**/*.less',
		'./demo/src/**/*.less',
		'./demo/src/**/*.js',
		'./demo/src/**/*.html'
	], { base: './' })
	.pipe(todo())
	.pipe(gulp.dest('./'));
});

//++++++++++++++++++++++
//+ Watch
//++++++++++++++++++++++

gulp.task('watch:less', function () {
	return gulp.watch([
		'bower_components/dna-**/components/**/*.less',
		'components/**/*.less',
		'demo/src/**/*.less'
	], ['modules:less', 'serve:reload']);
});

gulp.task('watch:html', function () {
	return gulp.watch([
		'demo/src/**/*.html'
	], ['copy:html', 'lint:html', 'serve:reload']);
});

gulp.task('watch:js', function () {
	return gulp.watch([
		'bower_components/dna-**/components/**/*.js',
		'components/**/*.js',
		'demo/src/**/*.js'
	], ['modules:js', 'lint:js', 'serve:reload']);
});

//++++++++++++++++++++++
//+ Publish
//++++++++++++++++++++++

gulp.task('publish:branch', function(done) {
	var exists = false;
	git.exec({ args: 'show-ref /refs/heads/gh-pages' }, function(err, stdout) {
		//if (err) return done();
		console.log('gh-pages', stdout, 'err', err);
	});
	git.branch({ args: '--list gh-pages' }, function(err, stdout) {
		//if (err) return done();
		console.log('master', stdout, 'err', err);
	});
	// test for gh-pages branch, create if doesnt exist
	if (!exists) {

	}
	return done();
});

gulp.task('publish:deploy', ['publish:branch'], function() {
	// publish demo/build to gh-pages branch

});
