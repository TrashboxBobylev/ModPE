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