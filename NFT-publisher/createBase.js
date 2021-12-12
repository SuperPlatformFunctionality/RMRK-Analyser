let demoBase = {
	"symbol": "initial_world_initial_cat",
	"type": "svg", //current only "svg" is supported
//	"id":"what??", //should be calculated...
//	"issuer":"xxxxx", //should be calculated...
	"themes":{

	},
	"parts": [
		{
			"id": "main_body",
			"type": "fixed",
			"src": "ipfs://ipfs/hash",
			"z": 0,
			"themable":true //有什么用?貌似是可以使用themes中的主题替换svg图标的中占位符,用来达到替换theme的功能
		},
		{
			"id": "gem_1_slot",
			"type": "slot",
			"src": "ipfs://ipfs/default-art-hash", 						//optional, defalut image shown in the slot
			"z": 1,                                                    	//z值大的,layer压在上面
			"equippable": ["id-of-genesis-trait-crystals-LEGENDARY"] 	//whitelist collections id than can be equipped here
		}
	]
}
