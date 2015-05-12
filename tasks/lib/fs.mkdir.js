var fs = require('fs'),
path = require('path');
module.exports.mkdir = function(path){
	return new Promise(function(resolve, reject) {
		fs.mkdir(path, function(err){
			if(err){
				reject(err)
			} else {
				resolve()
			}
		})
	})
}
fs.mkdirParent = function(dirPath, mode, callback) {
	//Call the standard fs.mkdir
	fs.mkdir(dirPath, mode, function(error) {
		//When it fail in this way, do the custom steps
		if (error && error.errno === -4058) {
			console.log(error)
			//Create all the parents recursively
			fs.mkdirParent(path.dirname(dirPath), mode, callback);
			//And then the directory
			fs.mkdirParent(dirPath, mode, callback);
		}
		//Manually run the callback since we used our own callback to do all these
		callback && callback(error);
	});
};
module.exports.mkdirParent = function(dirPath, mode){
	return new Promise(function(resolve, reject) {
		fs.mkdirParent(dirPath, mode, function(err){
			if(err){
				reject(err)
			} else {
				resolve()
			}
		})
	})
}