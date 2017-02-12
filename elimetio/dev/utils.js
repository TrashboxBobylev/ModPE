var MINECRAFT_HOUR_TIME = 1000;

var BASE_TOOL_MATERIAL = {
	level: 4,
	damage: 5,
	durability: 3400,
	efficiency: 14
}

ToolAPI.registerTool_ = ToolAPI.registerTool;

ToolAPI.registerTool = function(id, material, blocks, prototype){
	if (prototype.tick) {
	 Callback.addCallback("tick", function(){
			if (Player.getCarriedItem().id == id) prototype.tick();
	 });
	};
	ToolAPI.registerTool_(id, material, blocks, prototype);
}

function pass(){
	var d = 0;
}

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
				checkerTile: 1,
				checkerMode: gen.checker.mode
			});
		}
	});
	ToolAPI.registerBlockMaterial(BlockID[name], "stone");
	var furn = proto.getFurnResult();
	Recipes.addFurnace(ItemID[name], furn.result, furn.count);
	Block.registerDropFunction(name, function(coords, id, data, diggingLevel, toolLevel){
			if (diggingLevel > proto.getLevel()) return [[ItemID[name], 1, 0]];
			return [];
	}, proto.getLevel());
}

function switchArgs(){
	return arguments[random(arguments.length)];
}

var ToolsModule = {

	CoreAPIMembers: [],
	
	pushMethodsOf: function(parent, object){
		for (let member in object){
			if (typeof object[member] == "function"){
				let arg = object[member].toString().match(/\([\w_,\s]{0,}\)/)[0]
				ToolsModule.CoreAPIMembers.push(parent + "." + member + arg + ";\n")
				 FileTools.WriteText("coreengine_dump",parent + "." + member + arg + ";\n");
			}
			else if (typeof object[member] != "object"){
				ToolsModule.CoreAPIMembers.push(parent + "." + member + ";\n")
				 FileTools.WriteText("coreengine_dump",parent + "." + member + ";\n");
			}
			else{
				if (parent.split(".").length <= 4){
				ToolsModule.pushMethodsOf(parent + "." + member,object[member])
				}
			}
		}
	},
	
	CEDumpCreate: function(){
		ToolsModule.pushMethodsOf("",GameObjectRegistry)
		ToolsModule.pushMethodsOf("",new GameObject({}).deploy())
		let dump;
		for (let members in ToolsModule.CoreAPIMembers){
			dump = dump + ToolsModule.CoreAPIMembers[members]
		}
		Game.dialogMessage(dump)
		FileTools.WriteText("coreengine_dump", dump);
	}
}

//Callback.addCallback("PostLoaded", function(){ToolsModule.CEDumpCreate()})

function getTileEntityInArea(x, y, z, radius){
	var coords = {x: x, y: y, z: z}
	var allTiles = TileEntity.tileEntityList;
	var allTileInArea = [];
	for (var tile in allTiles){
		if (Entity.getDistanceBetweenCoords(coords, {x: allTiles[tile].x, y: allTiles[tile].y, z: allTiles[tile].z}) <= radius){
			allTileInArea.push(allTiles[tile]);
		}
	}
	return allTileInArea;
}

function clone(obj){
	var clone_obj = {};
	for (var member in obj){
		if (typeof obj != "object"){
			clone_obj[member] = obj[member];
		}
		else{
			clone_obj[member] = clone(obj[member]);
		}
	}
	return clone_obj;
}

function pass(){
	var a;
}

var connectstaff_mode = {
	name: "input"
};

