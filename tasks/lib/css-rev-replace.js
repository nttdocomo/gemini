var path = require("path"),
fs = require('fs'),
fsWriteFile = require('./fs.writeFile'),
fsExists = require('./fs.exists'),
gitRev = require('./revision'),
mkdir = require('./fs.mkdir');
module.exports = function (content,file,workDir,repoPath,options) {
	var currentPath = file.src[0].match(/(.*)\/(.+\.(?:css))/)[1],
	backgroundImages = content.match(/\burl\s*\(\s*["']?([^"'\r\n,]+?)["']?\s*\)/ig);
	//console.log(currentPath)
	backgroundImages = backgroundImages.filter(function(url){
		url = url.match(/\burl\s*\(\s*["']?([^"'\r\n,]+)["']?\s*\)/);
		url = url[1];
		//console.log(url)
		if(!(/(http|ftp|https):\/\/[\w-]+(\.[\w-]*)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/.test(url))){
			return true
		} else {
			for (var i in file.alias) {
				//console.log(i)
				//console.log((new RegExp('^'+i)).test(url))
				if((new RegExp('^'+i)).test(url)){
					return true
				}
			};
		}
		return false;
	})
	backgroundImages = backgroundImages.map(function(url){
		url = url.match(/\burl\s*\(\s*["']?([^"'\r\n,]+)["']?\s*\)/);
		url = url[1];
		if(/(http|ftp|https):\/\/[\w-]+(\.[\w-]*)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/.test(url)){
			for (var i in file.alias) {
				var repo = file.alias[i];
				url = url.replace(i,repo).replace(/\?.*/,'');
				var relativePath = url.replace(/((^[a-z0-9]+\/)([a-z0-9]+\/)*).+/,'$1')
				//console.log(relativePath)
				//将地址解析成系统格式
				var ownFolderPath = path.resolve(repoPath,relativePath);
				url = path.join(ownFolderPath,url.match(/(?:.+\/)+(.+\.(?:png|jpg|gif|eot|ttf|woff|svg)).*/)[1])
			};
		} else {
			ownFolderPath = url.replace(/\?.*/,'');
			url = path.resolve(currentPath,url);
		}
		return url;
	});
	/*if(backgroundImages.length){
		console.log('yes')
	} else {
		console.log('no')
	}*/
	return Promise.resolve().then(function(){
		return backgroundImages.reduce(function(sequence, image) {
	    	// 使用 reduce 把这些 Promise 接龙
	    	// 以及将章节内容添加到页面
	    	//console.log(path.relative(repoPath,image))
	    	return sequence.then(function() {
	    		// 等待当前 sequence 中所有章节和本章节的数据到达
	    		//var path.relative(repoPath,image);
				//从资源的绝对地址根据仓库绝对地址
	    		return gitRev(image.replace(/\\/g,'/').replace(/(.*(.+\.(?:png|jpg|gif|eot|ttf|woff|svg))).*/,'$1')).then(function(sha){
	    			//console.log(path.relative(repoPath,image) + '?t=' + entry.oid())
	    			return {
	    				image:image,
	    				sha:sha.match(/\w{40}/)[0]
	    			}
	    		},function(err){
	    			console.log(err)
	    			//console.log(path.relative(repoPath,image).replace(/\\/g,'/'))
	    		});
	    	}).then(function(chapter) {
	    		//console.log(chapter.image.match(/.*\\(.+\.(?:png|jpg|gif|eot|ttf|woff|svg))/)[1])
	    		if(chapter){
	    			//console.log(chapter.image)
	    			content = content.replace(new RegExp('('+chapter.image.match(/.*\\(.+\.(?:png|jpg|gif|eot|ttf|woff|svg))/)[1]+')(\\\?t\\\=\\w{7,})*','g'),'$1?t=' + chapter.sha.substr(0, 7))
	    		}
	    	},function(err){
	    		console.log(err)
	    	});
	    }, Promise.resolve());
	}).then(function(){
		//!content && console.log(content);
		//console.log(file.src[0] + '!!!!!save')
		var dirname = path.dirname(file.dest)
		return fsExists(dirname).catch(function(){
			return mkdir.mkdirParent(path.relative(workDir,dirname)).catch(function(err){
				console.log(err.errno)
			});
		}).then(function(){
			return fsWriteFile(file.dest,content);
		})
	})
}