IDRegistry.genBlockID("hellstone");
IDRegistry.genItemID("hellore");
IDRegistry.genItemID("hellhelmet");
IDRegistry.genItemID("hellchestplate");
IDRegistry.genItemID("hellleggins");
IDRegistry.genItemID("hellboots");
IDRegistry.genItemID("hellstone_bar");
IDRegistry.genItemID("hell_pickaxe");
IDRegistry.genItemID("hell_shovel");
IDRegistry.genItemID("hell_axe");
IDRegistry.genItemID("hell_sword");

Block.createBlock("hellstone", [
{name: "Hellstone", texture: [["hellstone", 0]], inCreative: true}
], PlexusType);

Item.createItem("hellore", "Hellstone", {name: "hellore", meta: 0});

Item.createItem("hellstone_bar", "Hellstone Bar", {name: "hellbar", meta: 0});

ToolAPI.registerBlockMaterial(BlockID.hellstone, "stone", 3);
Block.registerDropFunction("hellstone", function(coords, id, data, diggingLevel, toolLevel){
			if (diggingLevel > 2) return [[ItemID.hellore, 1, 0]];
			return [];
	}, 3);
	
Callback.addCallback("GenerateNetherChunk", function(chunkX, chunkZ){
	if (Math.random() < 2){
	for (var k = 0; k < 7; k++){
	var coords = GenerationUtils.randomCoords(chunkX, chunkZ, 10, 122);	GenerationUtils.genMinable(coords.x, coords.y, coords.z, {
			id: BlockID.hellstone,
			data: 0,
			size: 1,
			ratio: 1,
			checkerTile: 87,
			checkerMode: false
		});
	}	
}
});


Item.createArmorItem("hellhelmet", "Hellstone Helmet", {name: "helltelmet", meta: 0}, {type: "helmet", armor: 5, durability: 2152, texture: "armor/hell_1.png"});

Item.createArmorItem("hellchestplate", "Hellstone Chestplate", {name: "hellchestplate", meta: 0}, {type: "chestplate", armor: 8, durability: 2152, texture: "armor/hell_1.png"});

Item.createArmorItem("hellleggins", "Hellstone Leggings", {name: "hellleggins", meta: 0}, {type: "leggings", armor: 8, durability: 2152, texture: "armor/hell_2.png"});

Item.createArmorItem("hellboots", "Hellstone Boots", {name: "hellboots", meta: 0}, {type: "boots", armor: 8, durability: 2152, texture: "armor/hell_1.png"});

Item.createItem("hell_pickaxe", "Hellstone Pickaxe", {name: "hellpickaxe", meta: 0}, {stack: 1});

Item.createItem("hell_shovel", "Hellstone Shovel", {name: "hellshovel", meta: 0}, {stack: 1});

Item.createItem("hell_axe", "Hellstone Axe", {name: "hellaxe", meta: 0}, {stack: 1});

Item.createItem("hell_sword", "Hellstone Sword", {name: "hellsword", meta: 0}, {stack: 1});

Recipes.addShapeless({id: ItemID.hellstone_dust, count: 1, data: 0}, [{id: ItemID.hellore, data: 0}, {id: ItemID.hellore, data: 0}, {id: ItemID.hellore, data: 0}, {id: ItemID.hellore, data: 0}, {id: ItemID.hellore, data: 0}, {id: ItemID.hellore, data: 0}, {id: 49, data: 0}, {id: 49, data: 0}]);

Recipes.addFurnace(ItemID.hellstone_dust, ItemID.hellstone_bar, 0);

Recipes.addShaped({id: ItemID.hellhelmet, count: 1, data: 0}, [
"bbb",
"b b"
], ["b", ItemID.hellstone_bar, 0]);

Recipes.addShaped({id: ItemID.hellchestplate, count: 1, data: 0}, [
"b b",
"bbb",
"bbb"
], ["b", ItemID.hellstone_bar, 0]);

Recipes.addShaped({id: ItemID.hellleggins, count: 1, data: 0}, [
"bbb",
"b b",
"b b"
], ["b", ItemID.hellstone_bar, 0]);

Recipes.addShaped({id: ItemID.hellboots, count: 1, data: 0}, [
"b b",
"b b"
], ["b", ItemID.hellstone_bar, 0]);

Recipes.addShaped({id: ItemID.hell_pickaxe, count: 1, data: 0}, [
"bbb",
" b ",
" b "
], ["b", ItemID.hellstone_bar, 0]);

Recipes.addShaped({id: ItemID.hell_shovel, count: 1, data: 0}, [
"b",
"b",
"b"
], ["b", ItemID.hellstone_bar, 0]);

Recipes.addShaped({id: ItemID.hell_axe, count: 1, data: 0}, [
"bb",
"bb",
" b"
], ["b", ItemID.hellstone_bar, 0]);

Recipes.addShaped({id: ItemID.hell_axe, count: 1, data: 0}, [
"bb",
"bb",
"b "
], ["b", ItemID.hellstone_bar, 0]);

Recipes.addShaped({id: ItemID.hell_sword, count: 1, data: 0}, [
"b",
"b",
"b "
], ["b", ItemID.hellstone_bar, 0]);