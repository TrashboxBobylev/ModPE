IDRegistry.genBlockID("chloro_sawmill");

Block.createBlockWithRotation("chloro_sawmill", [
{name: "Chlorophyte Sawmill", texture: [
	["brassblock", 0],
	["sawmill", 2],
	["sawmill", 1],
	["sawmill", 0],
	["sawmill", 1],
	["sawmill", 1]
], inCreative: true}]);

Recipes.addShaped({id: BlockID.chloro_sawmill, count: 1, data: 0}, [
	"psp",
	"pgp",
	"ama"
], ["p", ItemID.chloro_plate, 0, "s", ItemID.chloro_saw, 0, "g", ItemID.magic_gear, 0, "a", 6, -1, "m", BlockID.machine_block, 0]);

RecipeReg.registerRecipesFor("sawmill", {
	17: {id: 5, count: 6, data: 0},
	5: {id: 280, count: 16, data: 0}
});

MechRegistry.registerPrototype(BlockID.chloro_sawmill, {
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
		this.container.setText("name", "Chlorophyte Sawmill");
		this.container.setText("elixir","Elixir: " + Math.round(this.liquidStorage.getAmount("elixir") * 1000) + "/" + 200 * this.data.level);
		
		var sourceSlot = this.container.getSlot("slotSource");
		var result = RecipeReg.getRecipeResult("sawmill", sourceSlot.id);
		if (result){
			if (this.getElixirStorage() > 1){ 
				this.requireElixir(0.0125);
				this.data.progress++;
			}
			if (this.data.progress >= (300 / this.data.level)){
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
		this.container.setScale("progress", this.data.progress / (300 * this.data.level));
	}
});