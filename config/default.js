'use strict';

module.exports = {
	port: 26080,
//	polkadotNodeUrl:"ws://192.168.1.28:9944",
	polkadotNodeUrl:"ws://104.198.42.65:9944",
	blockChain:{

	},
	rabbitMq: {
		"vhosts": {
			"/": {
				"connection": {
					"url": 	"amqp://tydmonitor:123456@127.0.0.1:5672"
				},
				/*
				"exchanges": [
					"demo_ex"
				],
				*/
				"queues": [
					"tyd-queue"
				],
				/*
				"bindings": [
					"demo_ex[a.b.c] -> demo_q"
				],
				*/

				"publications": {
					"tx_monitor_pub": {
						"queue": "tyd-queue",
					}
				},
				"subscriptions": {
					"tx_monitor_sub": {
						"queue": "tyd-queue",
						"prefetch": 1,
						"contentType": "application/json"
					}
				}
			}
		}
	}
}
