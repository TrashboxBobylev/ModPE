var MINECRAFT_HOUR_TIME = 1000;

function random() {
	switch (arguments.length){
	case 1: 
		return Math.round(Math.random() * arguments["0"]);
	case 2:
		return Math.round(Math.random() * (arguments["1"] - arguments["0"]) + arguments["0"]);
	}
}

function convertHex(str){
	return parseInt(str, 16);
}

function checkObjEqual(obj1, obj2){
		for (var prop1 in obj1){
			if (obj1[prop1] !==obj2[prop1]){
				return false;
			}
		}
	return true;
}

function getTimer(time){
 return World.getWorldTime() % time == 0 ? true: false;
}

function randomCoordsOfPlayer(distance){
	var pc = Player.getPosition();
	return {x: random(pc.x, pc.x + distance), y: random(pc.y - 1, pc.y + 1), z: random(pc.z, pc.z + distance)};
}

function defineOre(name, proto){
	IDRegistry.genBlockID(name);
	IDRegistry.genItemID(name);
	Block.createBlock(name, proto.getVariations());
	Item.createItem(name, proto.getItem().name, proto.getItem().texture, proto.getItem().params);
	var gen = proto.getGenerationParams();
		Callback.addCallback("GenerateChunkUnderground", function(chunkX, chunkZ){
		for (var i = 0; i < gen.counts; i++){
			var coords = GenerationUtils.randomCoords(chunkX, chunkZ, gen.minY, gen.maxY);
			GenerationUtils.genMinable(coords.x, coords.y, coords.z, {
				id: BlockID[name],
				data: 0,
				size: gen.size,
				ratio: gen.ratio,
				checkerTile: gen.checker.id,
				checkerMode: gen.checker.mode
			});
		}
	});
	ToolAPI.registerBlockMaterial(BlockID[name], "stone");
	var furn = proto.getFurnResult();
	Recipes.addFurnace(ItemID[name], furn.result, furn.count);
	Block.registerDropFunction(name, function(coords, id, data, diggingLevel, toolLevel){
			return [[ItemID[name], 1, 0]];
	}, proto.getLevel());
}