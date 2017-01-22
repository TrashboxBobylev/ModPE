IDRegistry.genBlockID("elixir_collector");

Block.createBlock("elixir_collector", [
{name: "Elixir Collector", texture: [["elixirstorage", 1]], inCreative: true}
]);

Recipes.addShaped({id: BlockID.elixir_collector, count: 1, data: 0}, [
"t",
"c",
"m"
], ["t", ItemID.brass_tube, 0, "c", ItemID.essence_core, 0, "m", BlockID.machine_block, 0]);

var CollectorGui = new UI.StandartWindow({
	standart: {
		inventory: {"standart": true},
		header: { text: {
			text: "Elixir Collector"}
		},
		background: {standart: true}	
	},
	
	drawing: [
		{type: "bitmap", x: 800, y: 100, bitmap: "elixir_scale", scale: 3} 
	],
	
	elements: {
			"elixir_scale": {type: "scale", x: 800, y: 100, bitmap: "scale_pattern", direction: 1, scale: 3},
			"level": {type: "text", x: 500, y: 100, text: "Level: 1", width: 300, height: 30},
			"elixir": {type: "text", x: 500, y: 150, text: "Elixir: 0", width: 300, height: 30},
			"tubes": {type: "slot", x: 500, y: 200}
		}
	});

MechRegistry.registerPrototype(BlockID.elixir_collector, {
	defaultValues: {
		target: null,
		baseProduce: 20,
		isStoring: true
	},
	
	getGuiScreen: function(){
		return CollectorGui;
	},
	
	init: function(){
		this.liquidStorage.setLimit("elixir", 0.4 * this.data.level);
		this.data.timeProduce = this.data.baseProduce * this.data.level;
		Game.message(MINECRAFT_HOUR_TIME / this.data.timeProduce);
	},
	
	tick: function(){
		this.liquidStorage.updateUiScale("elixir_scale", "elixir");
		
		if (getTimer(200 / this.data.level)) this.data.target = this.getPlexus();
		if (this.data.target) this.extractElixir();
		this.container.setText("level", "Level: " + this.data.level);
		this.container.setText("elixir","Elixir: " + Math.round(this.liquidStorage.getAmount("elixir") * 1000) + "/" + 400 * this.data.level);
		
		if (getTimer(10)){
			this.transfuseElixir(this.x, this.y - 1, this.z, 5 * this.data.level);
		}
	},
	
	getPlexus: function(){
		var target;
		var coords = {x: this.x, y: this.y, z: this.z};
		while (!target){
			coords.y += 1;
			target = ElixirPlexusRegistry.getPlexus(coords);
		}
		this.buildTube({x: this.x, y: this.y + 1, z: this.z}, coords.y);
		return target;
	},
	
	buildTube: function(coords, width){
		for (let index = coords.y; index < width; index++){
			World.setBlock(coords.x, index, coords.z, BlockID.machine_block, 1);
		}
	},
	
	extractElixir: function(){
		if (getTimer(Math.round(MINECRAFT_HOUR_TIME / this.data.timeProduce))){
	this.data.target.elixirs.normal -= 1 / (this.data.target.saturation / 100);
	if(Math.random() < (this.data.target.purity / 100)) this.liquidStorage.addLiquid("elixir", (1 / 1000));
		}
	},
	
	destroy: function(){
		if(this.data.target) for (var i = this.y; i < this.data.target.coords.y; i++){
			World.setBlock(this.y, this.y, this.z, 0);
			World.drop(this.x, i, this.z, ItemID.brass_tube, 1, 0);
		}
	}
});