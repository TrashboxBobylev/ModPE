IDRegistry.genItemID("primal_money");
IDRegistry.genItemID("copper_ingot");
IDRegistry.genItemID("zinc_ingot");
IDRegistry.genItemID("brass_ingot");
IDRegistry.genItemID("crystal");
IDRegistry.genBlockID("machine_block");
IDRegistry.genItemID("zinccoated_ingot");
IDRegistry.genItemID("brass_tube");
IDRegistry.genItemID("essence_core");
IDRegistry.genItemID("glass_ball");
IDRegistry.genItemID("hardened_composite");
IDRegistry.genItemID("magic_gear");
IDRegistry.genItemID("crystal_chunk");
IDRegistry.genItemID("crystal_grinder");
IDRegistry.genItemID("iron_dust");
IDRegistry.genItemID("gold_dust");
IDRegistry.genItemID("copper_dust");
IDRegistry.genItemID("zinc_dust");
IDRegistry.genItemID("crystal_dust");
IDRegistry.genItemID("hellstone_dust");
IDRegistry.genItemID("burning_crystal");
IDRegistry.genItemID("heat_plate");
IDRegistry.genItemID("chrono_kernel");

Item.createItem("primal_money", "Money (10 M)", {name: "primalmoney", meta: 0});

Item.registerUseFunction("primal_money", function(coords, item, block){
	MoneyProvider.add(10);
	Player.setCarriedItem(item.id, item.count - 1, item.data);
});

Item.createItem("copper_ingot", "Copper Ingot", {name: "copperingot", meta: 0});

Item.createItem("zinc_ingot", "Zinc Ingot", {name: "zincingot", meta: 0});

Item.createItem("brass_ingot", "Brass Ingot", {name: "brassingot", meta: 0});

Item.createItem("zinccoated_ingot", "Zinc-coated Iron Ingot", {name: "zincironingot", meta: 0});

Item.createItem("brass_tube", "Brass Tube", {name: "brasstube", meta: 0});

Item.createItem("essence_core", "Essence Core", {name: "energycore", meta: 0});

Item.createItem("crystal", "Crystal Gem", {name: "crystal", meta: 0});

Item.createItem("hardened_composite", "Hardened Composite", {name: "hardenedcomposite", meta: 0});

Item.createItem("magic_gear", "Elimesic Gear", {name: "magicgear", meta: 0});

Item.createItem("glass_ball", "Glass Ball", {name: "glassball", meta: 0});

Item.createItem("crystal_chunk", "Crystal Chunk", {name: "crystalchunk", meta: 0});

Item.createItem("crystal_grinder", "Crystal Grinder", {name: "crystalgrinder", meta: 0});

Item.createItem("iron_dust", "Iron Dust", {name: "irondust", meta: 0});

Item.createItem("iron_dust", "Iron Dust", {name: "irondust", meta: 0});

Item.createItem("gold_dust", "Gold Dust", {name: "golddust", meta: 0});

Item.createItem("copper_dust", "Copper Dust", {name: "copperdust", meta: 0});

Item.createItem("zinc_dust", "Zinc Dust", {name: "zincdust", meta: 0});

Item.createItem("crystal_dust", "Crystal Dust", {name: "crystaldust", meta: 0});

Item.createItem("hellstone_dust", "Hellstone Dust", {name: "hellstonedust", meta: 0});

Item.createItem("burning_crystal", "Burning Crystal", {name: "burningcrystal", meta: 0});

Item.createItem("heat_plate", "Hell Heat Plate", {name: "heatplate", meta: 0});

Item.createItem("chrono_kernel", "Chronokernel", {name: "chronokernel", meta: 0});

Recipes.addShapeless({id: ItemID.brass_ingot, count: 3, data: 0}, [
{id: ItemID.copper_ingot, data: 0},
{id: ItemID.copper_ingot, data: 0},
{id: ItemID.zinc_ingot, data: 0}
]);

Block.createBlock("machine_block", [
{name: "Brass Block", texture: [["brassblock", 0]], inCreative: true},
{name: "Brass Tube", texture: [["brassblock", 0]], inCreative: true}
]);

Block.setBlockShape(BlockID.machine_block, {x: 4/16, y: 0, z: 4/16}, {x: 12/16, y: 1, z: 12/16}, 1);

Recipes.addShaped({id: BlockID.machine_block, count: 1, data: 0}, [
"bbb",
"b b",
"bbb"
], ["b", ItemID.brass_ingot, 0]);

Recipes.addShaped({id: ItemID.brass_tube, count: 12, data: 0}, [
"b b",
"b b",
"b b"
], ["b", ItemID.brass_ingot, 0]);

Recipes.addShaped({id: ItemID.zinccoated_ingot, count: 8, data: 0}, [
"bbb",
"bib",
"bbb"
], ["b", 265, 0, "i", ItemID.zinc_ingot, 0]);

Recipes.addShaped({id: ItemID.essence_core, count: 1, data: 0}, [
" b ",
"bib",
" b "
], ["b", ItemID.zinccoated_ingot, 0, "i", ItemID.crystal, 0]);

Recipes.addShaped({id: ItemID.crystal, count: 1, data: 0}, [
"bbb",
"bbb",
"bbb"
], ["b", ItemID.crystalshard, 0]);

Recipes.addShaped({id: ItemID.glass_ball, count: 4, data: 0}, [
"bbb",
"b b",
"bbb"
], ["b", 20, 0]);

Recipes.addShaped({id: ItemID.hardened_composite, count: 3, data: 0}, [
"bbb",
"ddd",
"ccc"
], ["b", ItemID.brass_ingot, 0, "d", ItemID.zinccoated_ingot, 0, "c", ItemID.copper_ingot, 0]);

Recipes.addShaped({id: ItemID.chrono_kernel, count: 3, data: 0}, [
"hbh",
"b b",
"hbh"
], ["b", ItemID.magic_gear, 0, "h", ItemID.hardened_composite, 0]);

Recipes.addShaped({id: ItemID.crystal_chunk, count: 7, data: 0}, [
" bb",
"bbb",
"bb "
], ["b", ItemID.crystalshard, 0]);

Recipes.addShaped({id: ItemID.crystal_grinder, count: 1, data: 0}, [
"bbb",
"bcb",
"bbb"
], ["b", ItemID.crystal_chunk, 0, "c", ItemID.magic_gear, 0]);

Recipes.addFurnace(ItemID.iron_dust, 265, 0);

Recipes.addFurnace(ItemID.gold_dust, 266, 0);

Recipes.addFurnace(ItemID.copper_dust, ItemID.copper_ingot, 0);

Recipes.addFurnace(ItemID.zinc_dust, ItemID.zinc_ingot, 0);