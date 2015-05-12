var fs = require('fs');
module.exports = function(f,content){
	return new Promise(function(resolve, reject) {
		fs.writeFile(f, content, function(err){
			if(err){
				reject(err)
			} else {
				resolve()
			}
		})
	})
}