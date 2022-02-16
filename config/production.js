

module.exports = {
	port: 26080,
	polkadotNodeWsUrl:"wss://service.elara.patract.io/Kusama/34ad2c3b7e7dc805a98e3372748a1eb7",
	polkadotNodeHttpUrl:"https://service.elara.patract.io/Kusama/34ad2c3b7e7dc805a98e3372748a1eb7",
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
					"url":  "amqp://rmrkmonitor:123456@127.0.0.1:5672"
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
	}
}
