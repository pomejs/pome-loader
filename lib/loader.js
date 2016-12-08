/**
 * Loader Module
 */

var fs = require('fs');
var LoadUtility = require('./LoderUtility');

/**
 * Load modules under the path.
 * If the module is a function, loader would treat it as a factory function
 * and invoke it with the context parameter to get a instance of the module.
 * Else loader would just require the module.
 * Module instance can specify a name property and it would use file name as
 * the default name if there is no name property. All loaded modules under the
 * path would be add to an empty root object with the name as the key.
 *
 * @param  {String} mpath    the path of modules. Load all the files under the
 *                           path, but *not* recursively if the path contain
 *                           any sub-directory.
 * @param  {Object} context  the context parameter that would be pass to the
 *                           module factory function.
 * @return {Object}          module that has loaded.
 */
module.exports.load = function(mpath, context) {
	if(!mpath) {
		throw new Error('opts or opts.path should not be empty.');
	}

	try {
		mpath = fs.realpathSync(mpath);
	} catch(err) {
		throw err;
	}

	if(!LoadUtility.IsDir(mpath)) {
		throw new Error('path should be directory.');
	}

	return LoadUtility.LoadPath(mpath, context);
};