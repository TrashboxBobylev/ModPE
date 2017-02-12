IDRegistry.genBlockID("chronorouter");

Block.createBlock("chronorouter", [{name: "Chronorouter", texture: [["brassblock", 0], ["chronoblock", 1], ["chronoblock", 0]], inCreative: true}]);

Recipes.addShaped({id: BlockID.chronorouter, count: 1, data: 0}, [
	"v",
	"k",
	"m"
], ["v", 256, -1, "k", ItemID.chrono_kernel, 0, "m", BlockID.machine_block, 0]);

var RouterGUI = new UI.StandartWindow({
	standart: {
		inventory: {"standart": true},
		header: { text: {
			text: "Chronorouter"}
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
			"slotSource": {type: "slot", x: 500, y: 200}
		}
	});

/*MechRegistry.registerPrototype(BlockID.chronorouter, {
	defaultValues: {
		isStoring: false
	},
	
	getGuiScreen: function(){
		return RouterGUI;
	},
	
	init: function(){
	
	},

	tick: function(){
		var chest = World.getContainer(this.x, this.y-1, this.z);
		var source = this.container.getSlot("slotSource");
		if (chest && this.getElixirStorage() > 1) for (var slot in chest.slots){
			chest.refreshSlots();
			if (source.slot == chest.slots[slot].id && source.slot == chest.slots[slot].data && chest.slots[slot].count <= 64 - source.count || chest.slots[slot].id == 0){
				source.count--;
				chest.slots[slot].id = source.id;
				chest.slots[slot].data = source.data;
				chest.slots[slot].count++;
				this.requireElixir(0.0125);	this.container.validateAll();
				chest.applyChanges();
				chest.validateAll();
				break;
			}
		}
	}
});*/