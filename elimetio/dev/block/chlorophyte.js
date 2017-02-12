IDRegistry.genItemID("chloropfyte_ore");
IDRegistry.genBlockID("chloropfyte");
IDRegistry.genItemID("chlorophyte_crystal");
IDRegistry.genItemID("chloro_pickaxe");
IDRegistry.genItemID("chloro_axe");
IDRegistry.genItemID("chloro_shovel");
IDRegistry.genItemID("chloro_sword");
IDRegistry.genItemID("chloro_plate");
IDRegistry.genItemID("chloro_saw");

Block.createBlock("chloropfyte", [{name: "Chlorophyte Ore", texture: [["chlorophyteore", 0]], inCreative: true}]);

Item.createItem("chloropfyte_ore", "Chlorophyte Ore", {name: "leaveshard"});

Item.createItem("chlorophyte_crystal", "Planted Crystal", {name: "plantedcrystal"});

ToolAPI.registerBlockMaterial(BlockID.chloropfyte, "stone", 3);
Block.registerDropFunction("chloropfyte", function(coords, id, data, diggingLevel, toolLevel){
			if (diggingLevel > 2) return [[ItemID.chloropfyte_ore, 1, 0]];
			return [];
	}, 3);
	
Callback.addCallback("GenerateChunk", function(chunkX, chunkZ){
	if (Math.random() < 2){
	for (var k = 0; k < 3; k++){
	var coords = GenerationUtils.randomCoords(chunkX, chunkZ, 10, 120);	
	if (World.getBiome(coords.x, coords.z) == 21) GenerationUtils.genMinable(coords.x, coords.y, coords.z, {
			id: BlockID.chlorophyte,
			data: 0,
			size: 1,
			ratio: 1,
			checkerTile: 1,
			checkerMode: false
		});
	}	
}
});

Recipes.addFurnace(ItemID.chloropfyte_ore, ItemID.chlorophyte_crystal, 0);

Item.createItem("chloro_pickaxe", "Chlorophyte Pickaxe", {name: "chloropickaxe"}, {stack: 1});

Item.createItem("chloro_axe", "Chlorophyte Axe", {name: "chloroaxe"}, {stack: 1});

Item.createItem("chloro_shovel", "Chlorophyte Shovel", {name: "chloroshovel"}, {stack: 1});

Item.createItem("chloro_sword", "Chlorophyte Sword", {name: "chlorosword"}, {stack: 1});

Item.createItem("chloro_plate", "Chlorophyte Grownted Plate", {name: "chloroplate"});

Item.createItem("chloro_saw", "Chlorophyte Saw", {name: "saw"});

Recipes.addShaped({id: ItemID.chloro_plate, count: 3, data: 0}, [
	"ccc",
	"hhh",
	"ccc"
], ["c", ItemID.chlorophyte_crystal, 0, "h", ItemID.hardened_composite, 0]);

Recipes.addShaped({id: ItemID.chloro_sword, count: 1, data: 0}, [
	"c",
	"c",
	"c"
], ["c", ItemID.chlorophyte_crystal]);

Recipes.addShaped({id: ItemID.chloro_pickaxe, count: 1, data: 0}, [
	"ccc",
	" c ",
	" c "
], ["c", ItemID.chlorophyte_crystal, 0]);

Recipes.addShaped({id: ItemID.chloro_shovel, count: 1, data: 0}, [
	"c",
	"c",
	"c"
], ["c", ItemID.chlorophyte_crystal, 0]);

Recipes.addShaped({id: ItemID.chloro_axe, count: 1, data: 0}, [
	"cc",
	"cc",
	"c"
], ["c", ItemID.chlorophyte_crystal, 0]);

Recipes.addShaped({id: ItemID.chloro_saw, count: 2, data: 0}, [
	"ccc",
	"c c",
	"ccc"
], ["c", ItemID.chlorophyte_crystal, 0]);