IDRegistry.genBlockID("elixir_storage");

Block.createBlock("elixir_storage", [
{name: "Elixir Storage", texture: [["elixirstorage", 0]], inCreative: true}
]);

Recipes.addShaped({id: BlockID.elixir_storage, count: 1, data: 0}, [
"bgb",
"bmb",
"bgb"
], ["b", ItemID.glass_ball, 0, "g", ItemID.magic_gear, 0, "m", BlockID.machine_block, 0]);

var StorageGui = new UI.StandartWindow({
	standart: {
		inventory: {"standart": true},
		header: { text: {
			text: "Elixir Storage"}
		},
		background: {standart: true}	
	},
	
	drawing: [
		{type: "bitmap", x: 800, y: 100, bitmap: "elixir_scale", scale: 3} 
	],
	
	elements: {
			"elixir_scale": {type: "scale", x: 800, y: 100, bitmap: "scale_pattern", direction: 1, scale: 3},
			"level": {type: "text", x: 500, y: 100, text: "Level: 1", width: 300, height: 30},
			"elixir": {type: "text", x: 500, y: 150, text: "Elixir: 0", width: 300, height: 30}
		}
	});
	
MechRegistry.registerPrototype(BlockID.elixir_storage, {
	defaultValues: {
		isStoring: true
	},
	
	getGuiScreen: function(){
		return StorageGui;
	},
	
	init: function(){
		this.liquidStorage.setLimit("elixir", 4 * this.data.level);
	},
	
	tick: function(){
		this.liquidStorage.updateUiScale("elixir_scale", "elixir");
		this.container.setText("level", "Level: " + this.data.level);
		this.container.setText("elixir","Elixir: " + Math.round(this.liquidStorage.getAmount("elixir") * 1000) + "/" + 4000 * this.data.level);
		if (getTimer(10)){
			this.transfuseElixir(this.x, this.y - 1, this.z, 5 * this.data.level);
		}
	}
});