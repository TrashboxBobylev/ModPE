IDRegistry.genBlockID("hellstone_furnace");

Block.createBlockWithRotation("hellstone_furnace", [
{name: "Hellstone Furnace", texture: [["brassblock", 0],
 ["hellstonefurnace", 0], 
 ["hellstonefurnace", 0], 
 ["hellstonefurnace", 1], 
 ["hellstonefurnace", 0], 
 ["hellstonefurnace", 0]], inCreative: true}]);
 
Recipes.addShaped({id: ItemID.burning_crystal, count: 1, data: 0}, [
"bbb",
"bcb",
"bbb"
], ["b", ItemID.hellore, 0, "c", ItemID.crystal, 0]);

Recipes.addShaped({id: ItemID.heat_plate, count: 3, data: 0}, [
"bbb",
"ccc",
"ccc"
], ["b", ItemID.hellstone_bar, 0, "c", ItemID.zinccoated_ingot, 0]);

Recipes.addShaped({id: BlockID.hellstone_furnace, count: 1, data: 0}, [
"cpc",
"hgh",
"hmh"
], ["p", ItemID.heat_plate, 0, "c", ItemID.burning_crystal, 0, "h", ItemID.hellstone_bar, 0, "g", ItemID.magic_gear, 0, "m", BlockID.machine_block, 0]);
 
MechRegistry.registerPrototype(BlockID.hellstone_furnace, {
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
		this.container.setText("name", "Hellstone Furnace");
		this.container.setText("elixir","Elixir: " + Math.round(this.liquidStorage.getAmount("elixir") * 1000) + "/" + 200 * this.data.level);
		
		var sourceSlot = this.container.getSlot("slotSource");
		var result = Recipes.getFurnaceRecipeResult(sourceSlot.id, null);
		if (result){
			if (this.getElixirStorage() > 1){ 
				this.requireElixir(0.0125);
				this.data.progress++;
			}
			if (this.data.progress >= (400 / this.data.level)){
				var resultSlot = this.container.getSlot("slotResult");
				if (resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count < 64 || resultSlot.id == 0){
					sourceSlot.count--;
					resultSlot.id = result.id;
					resultSlot.data = result.data;
					resultSlot.count++;
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