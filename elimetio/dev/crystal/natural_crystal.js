

IDRegistry.genBlockID("crystalblock");
IDRegistry.genBlockID("crystalshard");
IDRegistry.genItemID("crystalshard");

Block.createBlock("crystalblock", [{name: "crystal", texture: [["crystalblock", 0]], inCreative: true}], PlexusType);

Block.createBlock("crystalshard", [{name: "crystal", texture: [["emptyblock", 0], ["emptyblock", 0], ["crystalshard", 0]]}], PlexusType);

Item.createItem("crystalshard", "crystal shard", {name: "crystalshard", meta: 0}, PlexusType);

//Block.setBlockShape(BlockID.crystalshard, {x: 7/16, y: 1, z:0}, {x: 9/16, y: 1, z: 0});
ToolAPI.registerBlockMaterialAsArray("stone", [BlockID.crystalblock, BlockID.crystalshard]);
Block.setDestroyLevel("crystalshard", 3);
Block.setDestroyLevel("crystalblock", 1)
Block.registerDropFunction("crystalblock", function(coords, id, data, diggingLevel, toolLevel){
	return [[ItemID.crystalshard, 1, 0]];
});

Block.registerDropFunction("crystalshard", function(coords, id, data, diggingLevel, toolLevel){
	if (true){
		return [[ItemID.crystalshard, 1, 0]];
	}
});



Item.registerUseFunction("crystalshard", function(coords, item, tile){
	var place = coords.relative;
	var tile1 = World.getBlock(place.x, place.y, place.z);
	var tile2 = World.getBlock(place.x, place.y - 1, place.z);
	
	if (GenerationUtils.isTransparentBlock(tile1.id) && tile2.id == BlockID.crystalblock){
		World.setBlock(place.x, place.y, place.z, BlockID.crystalshard);
		World.addTileEntity(place.x, place.y, place.z);
		Player.setCarriedItem(item.id, item.count - 1, item.data);
	}
});

var CrystalRender = new Render();
CrystalRender.setPart("body", [
{
type: "box",
uv: {x: 0, y: 0},
size: {x: 8, y: 8, z: 8},
coords: {x: 0, y: 0, z: 0}
}], {add: true, width: 32, height: 64})

Item.registerUseFunctionForID(265, function(coords, item, block){
	for (var k = 0; k < 5; k++){	GenerationUtils.genMinable(coords.x, coords.y, coords.z, {
			id: BlockID.crystalblock,
			data: 0,
			size: 8,
			ratio: .3,
			checkerTile: 1,
			checkerMode: false
		});
		}
		for (var i = 0; i < 3; i++){
			var place = GenerationUtils.randomCoords(coords.x, coords.z, 10, 50);
	var tile1 = World.getBlock(place.x, place.y, place.z);
	var tile2 = World.getBlock(place.x, place.y - 1, place.z);
	
	if (GenerationUtils.isTransparentBlock(tile1.id) && tile2.id == BlockID.crystalblock){
		GenerationUtils.lockInBlock(BlockID.crystalshard, 0, 0, false);
		GenerationUtils.setLockedBlock(place.x, place.y, place.z);
		}
	}
});

Callback.addCallback("GenerateChunkUnderground", function(chunkX, chunkZ){
	if (Math.random() < 2){
		var coords = GenerationUtils.randomCoords(chunkX, chunkZ, 10, 50);
	for (var k = 0; k < 2; k++){
	var coords = GenerationUtils.randomCoords(chunkX, chunkZ, 10, 50);	GenerationUtils.genMinable(coords.x, coords.y, coords.z, {
			id: BlockID.crystalblock,
			data: 0,
			size: 1,
			ratio: 1,
			checkerTile: 0,
			checkerMode: false
		});
		}
		
}
});
