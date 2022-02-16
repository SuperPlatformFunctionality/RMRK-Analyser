let fs = require("fs");
const JSONStream = require("JSONStream");

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
	return new Promise((resolve, reject) => {
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

let JsonBackupTools = {
	loadPromiseNfts,
	loadPromiseCollections,
	loadPromiseBases,
	loadPromiseLastBlock
}

module.exports = JsonBackupTools;

