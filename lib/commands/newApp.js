'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = newApp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _unzip = require('unzip');

var _unzip2 = _interopRequireDefault(_unzip);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _queueAsync = require('queue-async');

var _queueAsync2 = _interopRequireDefault(_queueAsync);

function newApp(_options, _callback) {

  var options = _extends({
    name: _options.name
  }, _options);
  var zipFile = 'fl-base-webapp.zip';
  var oldFolder = 'fl-base-webapp-master';
  var newFolder = options.name;
  // redirected from https://github.com/founderlab/fl-cli/archive/master.zip
  var url = 'https://codeload.github.com/founderlab/fl-base-webapp/zip/master';
  var writer = _fs2['default'].createWriteStream(zipFile);
  var pkgPath = newFolder + '/package.json';
  var envPath = newFolder + '/.env';

  function callback(err) {
    var queue = new _queueAsync2['default']();
    queue.defer(function (callback) {
      // delete zip
      _fs2['default'].access(zipFile, _fs2['default'].F_OK, function (err) {
        if (err) return callback(err);
        _fs2['default'].unlink(zipFile, function (err) {
          if (err) return callback(err);
          console.log('--Zip deleted.');
          callback(null);
        });
      });
    });
    queue.defer(function (callback) {
      // delete old folder
      _fs2['default'].access(oldFolder, _fs2['default'].F_OK, function (err) {
        if (err) {
          // err means successfully renamed
          return callback(null);
        } // otherwise delete the old folder
        (0, _rimraf2['default'])(oldFolder, function (err) {
          if (err) return callback(err);
          console.log('--Folder ' + oldFolder + ' deleted.');
          callback(new Error('Failed when renaming ' + oldFolder + ' to ' + newFolder + ', ' + newFolder + ' already exists.'));
        });
      });
    });
    if (err && err.message === 'replacement failure') {
      queue.defer(function (callback) {
        // delete new folder
        _fs2['default'].access(newFolder, _fs2['default'].F_OK, function (err) {
          if (err) return callback(err); // otherwise delete the old folder
          (0, _rimraf2['default'])(newFolder, function (err) {
            if (err) return callback(err);
            console.log('--Folder ' + newFolder + ' deleted.');
            callback(new Error('Failed when modifying .env or package.json.'));
          });
        });
      });
    }
    queue.await(_callback);
  }

  function replaceString(fileName, oldStr, newStr, callback) {
    _fs2['default'].access(fileName, _fs2['default'].W_OK | _fs2['default'].R_OK, function (err) {
      if (err) return callback(new Error('replacement failure'));
      _fs2['default'].readFile(fileName, function (err, data) {
        //read old file
        if (err) return callback(new Error('replacement failure'));
        var txt = data.toString();
        var replacedTxt = txt.replace(oldStr, newStr);
        _fs2['default'].writeFile(fileName + '_tmp', replacedTxt, function (err) {
          //write tmp file
          if (err) return callback(new Error('replacement failure'));
          _fs2['default'].unlink(fileName, function (err) {
            //delete old file
            if (err) return callback(new Error('replacement failure'));
            _fs2['default'].rename(fileName + '_tmp', fileName, function (err) {
              // rename tmp file
              if (err) return callback(new Error('replacement failure'));
              console.log('--' + fileName + ' modified.');
              return callback(null);
            });
          });
        });
      });
    });
  }

  // download, unzip, rename
  _https2['default'].get(url, function (res) {
    res.on('data', function (d) {
      writer.write(d);
    });
    res.on('end', function () {
      console.log('--Zip downloaded.');
      var stream = _fs2['default'].createReadStream(zipFile).pipe(_unzip2['default'].Extract({ path: './' }));
      stream.on('close', function () {
        console.log('--Zip extracted to folder ' + oldFolder + '.');
        _fs2['default'].rename(oldFolder, newFolder, function (err) {
          if (err) return callback(err);
          console.log('--Folder renamed to ' + newFolder + '.');
          var queue = new _queueAsync2['default']();
          queue.defer(function (callback) {
            //modify package.json
            replaceString(pkgPath, /FounderLab_replaceme/g, options.name, callback);
          });
          queue.defer(function (callback) {
            //modify .env
            replaceString(envPath, /FounderLab_replaceme/g, options.name.toLowerCase().replace(/\W/g, '_'), callback);
          });
          queue.await(callback);
        });
      });
    });
  });
}

module.exports = exports['default'];