let config =  require("../config");
const mqConfig = config.rabbitMq;
const Broker = require('rascal').BrokerAsPromised;

let listeners = [];
let addListener = function(fn) {
	console.log("new rabbit listener added...");
    listeners.push(fn);
}

let invokeAllListeners = async function(msgObj) {
    for(let i = 0 ; i < listeners.length ; i++) {
        let tempFn = listeners[i];
        await tempFn(msgObj);
    }
}

async function initConsumer() {
	try {
		const broker = await Broker.create(mqConfig);
		broker.on('error', (err, { vhost, connectionUrl }) => {
			console.error('Broker error', err, vhost, connectionUrl);
		});

		// Consume a message
		const subscription = await broker.subscribe('tx_monitor_sub');
		subscription.on('message', async function(message, content, ackOrNack) { //可以使用async函数,研究下rascal库里面怎么调用这个的,为什么可以支持async函数,里面await了吗?
			if(content instanceof Object) {
				await invokeAllListeners(content);
			} else {
				console.log("unknown type of message");
			}
			ackOrNack();
		}).on('error', console.error);
	} catch(err) {
		console.error(err);
	}
}

initConsumer();

let RabbitMqConsumer = {
	addListener
}
exports.addListener = addListener;
