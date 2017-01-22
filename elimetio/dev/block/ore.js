defineOre("moneyore", {
	getVariations: function(){
		return [
			{
				name: "money ore",
				texture: [
					["moneyore", 0]
				],
				inCreative: true
			}
		];
	},
	getItem: function(){
		return {
			name: "money ore",
			texture: {
				name: "moneychunk",
				meta: 0
			}
		};
	},
	getGenerationParams: function(){
		return {
			minX: 10,
			maxY: 64,
			counts: 8,
			size: 3,
			ratio: .5,
			checker: {
				id: 0,
				mode: false
			}
		};
	},
	getLevel: function(){
		return 1;
	},
	getFurnResult: function(){
		return {
			result: ItemID.primal_money,
			count: 0
		}
	}
});

defineOre("zincore", {
	getVariations: function(){
		return [
			{
				name: "zinc ore",
				texture: [
					["zincore", 0]
				],
				inCreative: true
			}
		];
	},
	getItem: function(){
		return {
			name: "zinc ore",
			texture: {
				name: "zincchunk",
				meta: 0
			}
		};
	},
	getGenerationParams: function(){
		return {
			minX: 10,
			maxY: 64,
			counts: 8,
			size: 3,
			ratio: .3,
			checker: {
				id: 0,
				mode: false
			}
		};
	},
	getLevel: function(){
		return 1;
	},
	getFurnResult: function(){
		return {
			result: ItemID.zinc_ingot,
			count: 0
		}
	}
});

defineOre("copperore", {
	getVariations: function(){
		return [
			{
				name: "copper ore",
				texture: [
					["copperore", 0]
				],
				inCreative: true
			}
		];
	},
	getItem: function(){
		return {
			name: "copper ore",
			texture: {
				name: "copperchunk",
				meta: 0
			}
		};
	},
	getGenerationParams: function(){
		return {
			minX: 10,
			maxY: 64,
			counts: 8,
			size: 3,
			ratio: .5,
			checker: {
				id: 0,
				mode: false
			}
		};
	},
	getLevel: function(){
		return 1;
	},
	getFurnResult: function(){
		return {
			result: ItemID.copper_ingot,
			count: 0
		}
	}
});