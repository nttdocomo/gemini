var grunt = require('grunt');
module.exports = function(file){
	return new Promise(function(resolve, reject) {
		grunt.util.spawn({
			cmd: 'git',
			args: ['ls-files', '-s', file]
		},function(error, result, code){
			if(error){
				reject(error)
			} else {
				console.log(result.stdout)
				resolve(result.stdout)
			}
		})
	})
}