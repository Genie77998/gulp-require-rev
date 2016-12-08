'use strict';
var _ = require('underscore');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var through = require('through2');
var path = require('path');

var PLUGIN_NAME = 'gulp-rev-collector';

var defaults = {
    revSuffix: '-[0-9a-f]{8,10}-?'
};

function _getManifestData(file, opts) {
    var data;
    var ext = path.extname(file.path);
    if (ext === '.json') {
        var json = {};
        try {
            var content = file.contents.toString('utf8');
            if (content) {
                json = JSON.parse(content);
            }
        } catch (x) {
            this.emit('error', new PluginError(PLUGIN_NAME, x));
            return;
        }
        if (_.isObject(json)) {
            var isRev = 1;
            Object.keys(json).forEach(function(key) {
                if (!_.isString(json[key]) || path.basename(json[key]).replace(new RegExp(opts.revSuffix), '') !== path.basename(key)) {
                    isRev = 0;
                }
            });

            if (isRev) {
                data = json;
            }
        }

    }
    return data;
}



function gre(opts) {
    opts = _.defaults((opts || {}), defaults);

    var manifest = {};
    var mutables = [];
    return through.obj(function(file, enc, cb) {
        if (!file.isNull()) {
            var mData = _getManifestData.call(this, file, opts);
            if (mData) {
                _.extend(manifest, mData);
            } else {
                mutables.push(file);
            }
        }
        cb();
    }, function(cb) {
        mutables.forEach(function(file,key) {
            if (!file.isNull()) {
                var src = file.contents.toString('utf8');
                    var _pathName = path.basename(file.path);
                    var __filenames = "";
                    for (var prop in manifest) {
                        if (manifest.hasOwnProperty(prop)) {
                            if(manifest[prop].indexOf(_pathName) > -1){
                                __filenames = prop;
                            }
                        }
                    }
                    var r2 = /([^\[\]]+)(?=\])/g
                    var _r1 = src.match(r2);
                    var _result = [];
                    if(_r1 && _r1.length > 0){
                        _r1.forEach(function(val){
                            var _s = val.replace(/[\'\"]/g,"").split(',')
                            if(_s.length > 0){
                                _s.forEach(function(_val){
                                    if(/^\.{1,2}\//.test(_val)){
                                        _result.push(_val)
                                    }
                                })
                            }       
                        })
                    }

                    if(_result.length > 0){
                        _result.forEach(function(value){
                            var _ms = '';
                            var _ind = 0;
                            var _isd = 0;
                            var _m = __filenames.split('/');
                            var _t = value.split('/');
                            var rname = _t[_t.length -1];
                            for(var i = 0 ; i < _t.length ; i++){
                                if(_t[i] == "." || _t[i] == ".."){
                                    if(_t[i] == ".."){
                                        _ind++;
                                    }
                                }else{
                                    _isd = i;
                                    break;
                                }
                            }

                            var _res = _m.slice(0,_m.length-1-_ind);
                            var _red = _t.slice(_isd,_t.length);
                            _red.forEach(function(_vv){
                                _res.push(_vv)
                            });

                            var _s = _res.join('/');
                            for (var prop in manifest) {
                                if (manifest.hasOwnProperty(prop)) {
                                    if(manifest[prop].indexOf(_s.split('.')[0]) > -1){
                                        _ms = prop;
                                    }
                                }
                            }
                            if(manifest[_ms] && rname){
                                var _pname = manifest[_ms].split('/');
                                if(_pname.length > 0){
                                    var _tms = _pname[_pname.length-1];
                                    if(_tms){
                                        _tms = _tms.replace('.js','');
                                        var _rsname = value.replace(rname,_tms)
                                        //console.log(_rsname,value);
                                        src = src.replace(value, _rsname);
                                    }
                                }
                            }

                        })
                    }
                file.contents = new Buffer(src);
            }
            this.push(file);
        }, this);

        cb();
    });
}

module.exports = gre;
