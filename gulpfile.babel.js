import webpack from 'webpack';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import opn from 'opn';
import childProcess from 'child_process';
import {IP, PORT} from './client/scripts/config';
import clientConfig from './webpack.config.prod.babel';
import serverConfig from './webpack.config.server.babel';
import dllConfig from './webpack.dll.config.babel';

const $ = gulpLoadPlugins();
const exec = childProcess.exec;

// webpack gulp 配置可参考 https://github.com/webpack/webpack-with-common-libs/blob/master/gulpfile.js

//复制替换文件，分开发、线上
//备选插件 https://www.npmjs.com/package/gulp-copy-rex
gulp.task('copy:dev', () => {
  const paths = [
    {src: 'client/scripts/config/index.dev.js', dest: 'client/scripts/config/index.js'},
    {src: 'client/scripts/store/configureStore.dev.js', dest: 'client/scripts/store/index.js'},
    {src: 'client/scripts/containers/Root.dev.js', dest: 'client/scripts/containers/Root.js'},
  ];
  return $.copy2(paths);
});

//正式环境
gulp.task('copy:prod', () => {
  const paths = [
    {src: 'client/scripts/config/index.prod.js', dest: 'client/scripts/config/index.js'},
    {src: 'client/scripts/store/configureStore.prod.js', dest: 'client/scripts/store/index.js'},
    {src: 'client/scripts/containers/Root.prod.js', dest: 'client/scripts/containers/Root.js'},
    {src: 'client/favicon.ico', dest: 'dist/favicon.ico'},
  ];
  return $.copy2(paths);
});

//清理临时和打包目录
gulp.task('clean', () => {
  return gulp.src(['dist', 'zip'])
    .pipe($.clean({force: true}));
});

// webpack 插件 DllPlugin
gulp.task('dll', () => {
  const compiler = webpack(dllConfig);
  // run webpack
  compiler.run((err, stats) => {
    if (err) {
      throw new $.util.PluginError('webpack:dll', err);
    }
    $.util.log('[webpack:dll]', stats.toString({
      colors: true
    }));
  });
});

//开发环境，启动服务
gulp.task('server', ['copy:dev'], () => {
  $.nodemon({
    restartable: 'rs',
    ignore: ['.git', 'node_modules/**/node_modules'],
    exec: 'npm run start',
    watch: ['server', 'webpack.config.dev.babel.js'], // 设置监听的文件
    verbose: true,
    env: {
      'NODE_ENV': 'development',
      'BABEL_DISABLE_CACHE': 1
    },
    ext: 'js json'
  });

  // Chrome is google chrome on OS X, google-chrome on Linux and chrome on Windows.
  // app 在 OS X 中是 google chrome, 在 Windows 为 chrome ,在 Linux 为 google-chrome
  opn(`http://${IP}:${PORT}/`, {app: 'google chrome'});

  gulp.watch(['client/config/index.dev.js', 'client/containers/Root.dev.js', 'client/store/configureStore.dev.js'], ['copy:dev']);
});

// 线上的服务
gulp.task('server:prod', () => {
  exec('npm run start:prod');
});


// 编译打包 client
gulp.task('build:client', () => {
  const compiler = webpack(clientConfig);
  // run webpack
  compiler.run((err, stats) => {
    if (err) {
      throw new $.util.PluginError('webpack:client', err);
    }
    $.util.log('[webpack:client]', stats.toString({
      colors: true
    }));
  });
});

// 编译打包
gulp.task('build:server', () => {
  const compiler = webpack(serverConfig);
  // run webpack
  compiler.run((err, stats) => {
    if (err) {
      throw new $.util.PluginError('webpack:server', err);
    }
    $.util.log('[webpack:server]', stats.toString({
      colors: true
    }));
  });
});

// 编译打包
gulp.task('build', ['clean', 'copy:prod'], () => {
  exec('npm run env:prod', (err, stdout, stderr) => {
    gulp.start('build:client');
    gulp.start('build:server');
  });
});


//默认任务
gulp.task('default', () => {
  gulp.start('build');
});
