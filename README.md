### gulp-require-rev 
a plugin of gulp for requirejs Revision by gulp-rev-collector

### install
```bash
npm install gulp-require-rev
```


### example


gulpfile.js
```js
const gulp = require('gulp')
const rev = require('gulp-rev')
const gre = require('gulp-require-rev')
const buildPath = 'dist'

gulp.task('jsfile:min', () => {
    return gulp.src('./src/**/*.js')
        .pipe(rev())
        .pipe(gulp.dest(buildPath))
        .pipe(rev.manifest({
            path: 'js-manifest.json'
        }))
        .pipe(gulp.dest(buildPath + '/rev'))
});


gulp.task("jsreplace", () => {
    return gulp.src(['./dist/rev/js-manifest.json', './dist/**/*.js'])
        .pipe(gre())
        .pipe(gulp.dest(buildPath));
});
```
### 示例
```html
	构建前代码 
		require([
    		'../lib/common'
		], function (common) {

		})

	{
	  "js/lib/common.js": "js/lib/common-e8fd4f4e2f.js"
	}


	构建后 
		require([
    		'../lib/common-e8fd4f4e2f'
		], function (a) {

		})

```


### License
MIT
