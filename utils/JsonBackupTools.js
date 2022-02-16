let fs = require("fs");
const JSONStream = require("JSONStream");
const moment = require("moment");

const loadPropertyPromise = function(appendFilePath, pattern) {
	return new Promise((resolve, reject) => {
		try {
			let propertyValue = 0;
			const readStream = fs.createReadStream(appendFilePath);
			const parseStream = JSONStream.parse(pattern);
			parseStream.on("data", function(value) {
				propertyValue = value;
			});

			readStream.pipe(parseStream);
			readStream.on("finish", async () => {
				resolve(propertyValue);
			});

			readStream.on("end", async () => {
				resolve(propertyValue);
			});

			readStream.on("error", (error) => {
				reject(error);
			});
		} catch (error) {
			console.error(error);
			reject(error);
		}
	});
}

const loadObjPromise = function(appendFilePath, pattern) {
	return new Promise(function(resolve, reject) {
		try {
			let backUpObj = {}
			const readStream = fs.createReadStream(appendFilePath);
			const parseStream = JSONStream.parse(pattern);
			parseStream.on("data", function(objItem) {
//				console.log(objItem, typeof objItem);
				if (objItem) {
					backUpObj[objItem.key] = objItem.value;
				}
			});

			readStream.pipe(parseStream);
			readStream.on("finish", async () => {
				resolve(backUpObj);
			});

			readStream.on("end", async () => {
				resolve(backUpObj);
			});

			readStream.on("error", (error) => {
				reject(error);
			});
		} catch (error) {
			console.error(error);
			reject(error);
		}
	});
}

const loadPromiseNfts = async function(appendFilePath) {
	return await loadObjPromise(appendFilePath, "nfts.$*");
}

const loadPromiseCollections = async function(appendFilePath) {
	return await loadObjPromise(appendFilePath, "collections.$*");
}

const loadPromiseBases = async function(appendFilePath) {
	return await loadObjPromise(appendFilePath, "bases.$*");
}

const loadPromiseLastBlock = async function(appendFilePath) {
	return await loadPropertyPromise(appendFilePath, "lastBlock");
}


const writeObjToFilePromise = async function(outputFilePath, jsonObj) {

	return new Promise(function(resolve, reject) {
		let fileContent = JSON.stringify(jsonObj);
//	const writeStream = fs.createWriteStream(outputFilePath);
//	const transformStream = JSONStream.stringify();
//	transformStream.pipe(writeStream);
//	extracted.forEach(transformStream.write);
//	transformStream.end();

		const ws = fs.createWriteStream(outputFilePath);
		ws.on("finish", async (e) => {
			resolve(true);
		});

		ws.on("end", async (e) => {
			resolve(true);
		});

		ws.on("error", async function(error) {
			console.error("writeObjToFilePromise", error);
			reject(error);
		});
//		let startTs = moment().unix();
		ws.write(fileContent, function(e) {
			console.log(e,"write stream flushed...\n");
		});
//		let loadingDuration = moment().unix() - startTs;
//		console.log("inner calling..., ", loadingDuration , "seconds\n");
		ws.end();
	})

}

let JsonBackupTools = {
	loadPromiseNfts,
	loadPromiseCollections,
	loadPromiseBases,
	loadPromiseLastBlock,
	writeObjToFilePromise
}

module.exports = JsonBackupTools;

