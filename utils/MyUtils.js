

let fs = require("fs");
let path = require("path");

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

let MyUtils = {
	appendStrToFile,
	sleepForMillisecond,
	getRandomNumbericString
}

module.exports = MyUtils;

