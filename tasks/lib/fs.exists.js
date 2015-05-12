var fs = require('fs');
module.exports = function(path){
	return new Promise(function(resolve, reject) {
		fs.exists(path, function(exists){
			if(exists){
				resolve(exists)
			} else {
				reject(exists)
			}
		})
	})
}