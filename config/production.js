

module.exports = {
	port: 26080,
	polkadotNodeWsUrl:"wss://kusama.api.onfinality.io/ws?apikey=0cdc89b4-8dbf-4fd5-af7d-fb19cb52f157",
	polkadotNodeHttpUrl:"https://kusama.api.onfinality.io/rpc?apikey=0cdc89b4-8dbf-4fd5-af7d-fb19cb52f157",
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
					"url":  "amqp://rmrkmonitor:123456@10.128.0.10:5672"
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
