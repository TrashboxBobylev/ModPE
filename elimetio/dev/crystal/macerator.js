IDRegistry.genBlockID("macerator");

Block.createBlockWithRotation("macerator", [
{name: "Crystallonium Macerator", texture: [["brassblock", 0],
 ["macerator", 2], 
 ["macerator", 1], 
 ["macerator", 0], 
 ["macerator", 1], 
 ["macerator", 1]], inCreative: true}]);
 
Recipes.addShaped({id: BlockID.macerator, count: 1, data: 0}, [
"dgd",
"dmd",
"sbs"
], ["d", 264, 0, "m", ItemID.magic_gear, 0, "g", ItemID.crystal_grinder, 0, "s", 4, 0, "b", BlockID.machine_block, 0]);
 
var MachineGUI = new UI.StandartWindow({
	standart: {
		inventory: {"standart": true},
		header: { text: {
			text: "Elimestic Machine"}
		},
		background: {standart: true}	
	},
	
	drawing: [
		{type: "bitmap", x: 800, y: 100, bitmap: "elixir_scale", scale: 3},
		{type: "bitmap", x: 500, y: 215, bitmap: "progress_background", scale: 4} 
	],
	
	elements: {
			"elixir_scale": {type: "scale", x: 800, y: 100, bitmap: "scale_pattern", direction: 1, scale: 3},
			"name": {type: "text", x: 350, y: 50, text: "Machine", width: 300, height: 30},
			"level": {type: "text", x: 350, y: 100, text: "Level: 1", width: 300, height: 30},
			"elixir": {type: "text", x: 350, y: 150, text: "Elixir: 0", width: 300, height: 30},
			"progress": {type: "scale", x: 500, y: 215, bitmap: "progress_scale", direction: 0, scale: 4},
			"slotSource": {type: "slot", x: 440, y: 215},
		"slotResult": {type: "slot", x: 590, y: 215}
		}
});

RecipeReg.registerRecipesFor("macerator", {
	1: {id: 4, count: 1, data: 0},
	4: {id: 12, count: 1, data: 0},
	13: {id: 318, count: 1, data: 0},
	369: {id: 377, count: 5, data: 0},
	35: {id: 287, count: 2, data: 0},
	352: {id: 351, count: 5, data: 15},
	14: {id: ItemID.gold_dust, count: 2, data: 0},
	15: {id: ItemID.iron_dust, count: 2, data: 0},
	41: {id: ItemID.gold_dust, count: 9, data: 0},
	42: {id: ItemID.iron_dust, count: 9, data: 0},
	145: {id: ItemID.iron_dust, count: 32, data: 0},
	265: {id: ItemID.iron_dust, count: 1, data: 0},
	266: {id: ItemID.gold_dust, count: 1, data: 0},
	"ItemID.copper_ore": {id: ItemID.copper_dust, count: 2, data: 0},
	"ItemID.zinc_ore": {id: ItemID.zinc_dust, count: 2, data: 0},
	"ItemID.crystalshard": {id: ItemID.crystal_dust, count: 1, data: 0},
	"ItemID.crystal": {id: ItemID.crystal_dust, count: 2, data: 10}
});

MechRegistry.registerPrototype(BlockID.macerator, {
	defaultValues: {
		isStoring: false,
		progress: 0
	},
	
	getGuiScreen: function(){
		return MachineGUI;
	},
	
	init: function(){
		this.liquidStorage.setLimit("elixir", 0.2 * this.data.level);
	},
	
	tick: function(){
		this.liquidStorage.updateUiScale("elixir_scale", "elixir");
		this.container.setText("level", "Level: " + this.data.level);
		this.container.setText("name", "Crystal Macerator");
		this.container.setText("elixir","Elixir: " + Math.round(this.liquidStorage.getAmount("elixir") * 1000) + "/" + 200 * this.data.level);
		
		var sourceSlot = this.container.getSlot("slotSource");
		var result = RecipeReg.getRecipeResult("macerator", sourceSlot.id);
		if (result){
			if (this.getElixirStorage() > 1){ 
				this.requireElixir(0.0125);
				this.data.progress++;
			}
			if (this.data.progress >= (400 / this.data.level)){
				var resultSlot = this.container.getSlot("slotResult");
				if (resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count <= 64 - result.count || resultSlot.id == 0){
					sourceSlot.count--;
					resultSlot.id = result.id;
					resultSlot.data = result.data;
					resultSlot.count += result.count;
					this.container.validateAll();
					this.data.progress = 0;
				}
			}
		}
		else {
			this.data.progress = 0;
		}
		this.container.setScale("progress", this.data.progress / (400 * this.data.level));
	}
});