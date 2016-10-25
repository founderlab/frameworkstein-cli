'use strict';

exports.__esModule = true;

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

function replaceString(fileName, oldStr, newStr, callback) {
  _fs2['default'].access(fileName, _fs2['default'].W_OK | _fs2['default'].R_OK, function (err) {
    if (err) return callback(new Error('String replacement failure: ' + err));

    _fs2['default'].readFile(fileName, function (err, data) {
      //read old file
      if (err) return callback(new Error('String replacement failure: ' + err));
      var txt = data.toString();
      var replacedTxt = txt.replace(oldStr, newStr);

      _fs2['default'].writeFile(fileName + '_tmp', replacedTxt, function (err) {
        //write tmp file
        if (err) return callback(new Error('String replacement failure: ' + err));

        _fs2['default'].unlink(fileName, function (err) {
          //delete old file
          if (err) return callback(new Error('String replacement failure: ' + err));

          _fs2['default'].rename(fileName + '_tmp', fileName, function (err) {
            // rename tmp file
            if (err) return callback(new Error('String replacement failure: ' + err));
            return callback(null);
          });
        });
      });
    });
  });
}

function newApp(_options, _callback) {

  var options = _extends({}, _options);

  var repoName = options.type === 'mobile' ? 'fl-base-mobile-app' : 'fl-base-webapp';
  var repoZipUrl = 'https://codeload.github.com/founderlab/' + repoName + '/zip/master';

  var zipFilename = repoName + '.zip';
  var oldFolder = repoName + '-master';
  var newFolder = options.name;
  var writer = _fs2['default'].createWriteStream(zipFilename);
  var replace = [{ filePath: newFolder + '/shared/modules/app/containers/Navbar.js', name: options.name }, { filePath: newFolder + '/package.json', name: options.name }, { filePath: newFolder + '/.env', name: options.name.toLowerCase().replace(/\W/g, '_') }];

  function callback(err) {
    var queue = new _queueAsync2['default']();

    queue.defer(function (callback) {
      // delete zip
      _fs2['default'].access(zipFilename, _fs2['default'].F_OK, function (err) {
        if (err) return callback(err);
        _fs2['default'].unlink(zipFilename, function (err) {
          if (err) return callback(err);
          if (options.verbose) console.log('--Zip deleted.');
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
        _rimraf2['default'](oldFolder, function (err) {
          if (err) return callback(err);
          if (options.verbose) console.log('--Folder ' + oldFolder + ' deleted.');
          callback(new Error('Failed when renaming ' + oldFolder + ' to ' + newFolder + ', ' + newFolder + ' already exists.'));
        });
      });
    });

    if (err && err.message === 'String replacement failure: ' + err) {
      queue.defer(function (callback) {
        // delete new folder
        _fs2['default'].access(newFolder, _fs2['default'].F_OK, function (err) {
          if (err) return callback(err); // otherwise delete the old folder
          _rimraf2['default'](newFolder, function (err) {
            if (err) return callback(err);
            if (options.verbose) console.log('--Folder ' + newFolder + ' deleted.');
            callback(new Error('Failed when modifying .env or package.json.'));
          });
        });
      });
    }

    queue.await(_callback);
  }

  // download, unzip, rename
  _https2['default'].get(repoZipUrl, function (res) {
    res.on('data', function (d) {
      return writer.write(d);
    });

    res.on('end', function () {
      if (options.verbose) console.log('--Zip downloaded.');
      var stream = _fs2['default'].createReadStream(zipFilename).pipe(_unzip2['default'].Extract({ path: './' }));

      stream.on('close', function () {
        if (options.verbose) console.log('--Zip extracted to folder ' + oldFolder + '.');

        _fs2['default'].rename(oldFolder, newFolder, function (err) {
          if (err) return callback(err);
          if (options.verbose) console.log('--Folder renamed to ' + newFolder + '.');
          var queue = new _queueAsync2['default']();

          // Set the app name in a few files
          replace.forEach(function (_ref) {
            var filePath = _ref.filePath;
            var name = _ref.name;

            queue.defer(function (callback) {
              replaceString(filePath, /FounderLab_replaceme/g, name, function (err) {
                if (err) return callback(err);
                if (options.verbose) console.log('--' + filePath + ' modified.');
                callback();
              });
            });
          });

          queue.await(callback);
        });
      });
    });
  });
}

module.exports = exports['default'];