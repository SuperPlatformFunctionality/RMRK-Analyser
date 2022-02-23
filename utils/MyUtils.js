let fs = require("fs");
let path = require("path");
const process = require("process");

let appendStrToFile = function(theStr, fileName) {
    fs.appendFile(path.join(__dirname, fileName), "\r\n" + theStr, function(err) {
        if(err) {
            console.error("writeStrToFile append str to file " + fileName + "error:", err);
        }
    });
}

//调用的时候应该使用await
let sleepForMillisecond = function(duration, isDisplayConsole) {
    isDisplayConsole = (isDisplayConsole == null) ? false : isDisplayConsole;
    if (isDisplayConsole) {
        console.log("sleep for ", duration , " millisecond")
    }
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, duration);
    });
};

let getRandomNumbericString = function(len) {
	let chars = '0123456789';
	let maxPos = chars.length;
	let code = '';
	for (let i = 0; i < len; i++) {
		code += chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return code;
}


let byteFormat = function(bytes) {
	return (bytes/1024/1024).toFixed(2)+'MB';
};
let displayCurMemoryUsage = function(preMsg) {
	let mem = process.memoryUsage();
	console.log(preMsg + "\n" +
				'rss:' + byteFormat(mem.rss) + "," +
				'heapTotal:' + byteFormat(mem.heapTotal) + "," +
				'heapUsed:' + byteFormat(mem.heapUsed) + "," +
				'external:' + byteFormat(mem.external) + "," +
				'arrayBuffers:' + byteFormat(mem.arrayBuffers));
}

let MyUtils = {
	appendStrToFile,
	sleepForMillisecond,
	getRandomNumbericString,
	displayCurMemoryUsage
}

module.exports = MyUtils;

