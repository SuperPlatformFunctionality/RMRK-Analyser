

module.exports = {
	port: 26080,
	polkadotNodeWsUrl:"ws://10.128.0.120:9944",
//	polkadotNodeWsUrl:"wss://kusama.api.onfinality.io/ws?apikey=26067ef8-9907-4259-96e2-59c63ed8d1a8",
	polkadotNodeHttpUrl:"http://10.128.0.120:9933",
//	polkadotNodeHttpUrl:"https://kusama.api.onfinality.io/rpc?apikey=26067ef8-9907-4259-96e2-59c63ed8d1a8",
	ss58Format:2, //0-polkadot, 2-kusama, 42-substract network
	persistenceFilePathRelative:"nft-status.json",
	rmrkBackupInterval:30, //minutes
	blockChain:{

	},
	dbUrl:"mysql://root:root@127.0.0.1:3306/initial_world_nft",
	rabbitMq:{
		"vhosts": {
			"/": {
				"connection": {
					"url": 	"amqp://rmrkmonitor:123456@127.0.0.1:5672"
				},
				/*
				"exchanges": [
					"demo_ex"
				],
				*/
				"queues": [
					"rmrk-queue"
				],
				/*
				"bindings": [
					"demo_ex[a.b.c] -> demo_q"
				],
				*/
				"publications": {
					"tx_monitor_pub": {
						"queue": "rmrk-queue",
					}
				},
				"subscriptions": {
					"tx_monitor_sub": {
						"queue": "rmrk-queue",
						"prefetch": 1,
						"contentType": "application/json"
					}
				}
			}
		}
	},
	SalesmanHost:"http://127.0.0.1:27080"
}
