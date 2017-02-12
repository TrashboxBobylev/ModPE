World.getWorldDir = ModAPI.requireGlobal("Level.getWorldDir");

var plexusAll = [];

var plexus = new GameObject("plexus", {
	init: function(x, y, z){
		this.coords = {
			x: x,
			y: y,
			z: z
		};
		this.saturation = random(10, 100);
		this.purity = random(25, 100);
		this.elixirs = {
			normal: random(160000, 320000),
			black: random(1600, 3200)
		};
		this.corruption = random(8000, 16000);
		plexusAll.push(this);
	},
	
	update: function(){
		Particles.addParticle(this.coords.x+0.5, this.coords.y+0.5, this.coords.z+0.5, Native.ParticleType.spell, 0, 0, 0, convertHex(switchArgs("FF0023", "FF00A2", "FF00B1", "FF0089", "FF00D9")));
	 World.setBlock(this.coords.x, this.coords.y, this.coords.z, BlockID.elixir_plexus);
	},
	
	clear: function(){
		if (Math.random() < this.corruption / 10000){
			this.corruption -= random(this.purity);
			this.elixirs.normal -= random(1 / this.purity);
		}
	},
	
	get: function(x, y, z){
		Game.message(":)");
		if (checkObjEqual(this.coords, {x: x, y: y, z: z})) return this;
	}
});

function getPlexus(x, y, z){
	for (var plexus in GameObjectRegistry.getAllByType("plexus")){
		var plexus1 = GameObjectRegistry.getAllByType("plexus")[plexus];
		if (plexus1.coords.x==x && plexus1.coords.y==y && plexus1.coords.z==z) return plexus1;
	}
}

IDRegistry.genBlockID("elixir_plexus");

var PlexusType = Block.createSpecialType({
	opaque: true,
	lightlevel: 10,
	lightopacity: 0,
	renderlayer: 4
});

Block.createBlock("elixir_plexus", [{ 
			name: "", 
			texture: [
				["glass", 0],
			],
			inCreative: false
		}], PlexusType)

Block.setBlockShape(BlockID.elixir_plexus, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 1/16})

//debug

/*Item.registerUseFunctionForID(280, function(coords, item, block){
	plexus.deploy(coords.relative.x, coords.relative.y, coords.relative.z);
});*/

Callback.addCallback("tick", function(chunkX, chunkZ){
	if (random(100) == 0 && getTimer(40)){
		var coords = randomCoordsOfPlayer(8);
		Game.message(Entity.getDistanceBetweenCoords(coords, Player.getPosition()));
		if (Entity.getDistanceBetweenCoords(coords, Player.getPosition()) < 32){
			plexus.deploy(coords.x, coords.y, coords.z);
		}
	}
});

LiquidRegistry.registerLiquid("elixir", "Liquid Elixir", ["elixir_texture"]);




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



var CheckRegistry = {
	Checks: [],
	addCheck: function(name){
		FileTools.WriteText(World.getWorldDir() + "checks", name + "\n", true);
		CheckRegistry.Checks.push(name)
	},
	loadCheck: function(){
		CheckRegistry.Checks = FileTools.ReadText(World.getWorldDir() + "checks").split("\n");
	},
	getCheck: function(name){
	CheckRegistry.Checks.forEach(function(check){
		if (check==name) return true;
	});
	}
}


var MechRegistry = {
	registerPrototype: function(id, proto){
		if (!proto.defaultValues){
			proto.defaultValues = {
				level: 1,
				timeUpgrade: 0,
				name: ""
			};
		}
		else{
			proto.defaultValues.level = 1;
					proto.defaultValues.timeUpgrade = 0;
		}
		proto.requireElixir = function(mb){
		if (this.liquidStorage.getLiquidStored() == "elixir")	return this.liquidStorage.getLiquid("elixir", mb / 1000);
		};
		proto.getElixirStorage = function(){
			return Math.round(this.liquidStorage.getLimit("elixir") * 1000);
		};
		proto.transfuseElixir = function(x, y, z, mb){
			var target = World.getTileEntity(x, y, z);
			if (target && target.isStoring() && !target.liquidStorage.isFull("elixir")){
				target.liquidStorage.addLiquid("elixir", this.liquidStorage.getLiquid("elixir", mb / 1000));
			}
		};
		proto.isStoring = function(){	
			return this.data.isStoring || false;
		};
		proto.addElixir = function(mb){
			this.liquidStorage.addLiquid("elixir", mb / 1000);
		}
		proto.init_ = proto.init;
		proto.init = function(){
			for (var key in LiquidRegistry.liquids){
				if (key != "elixir") this.liquidStorage.setLimit(key, 0);
			}
			this.liquidStorage.setLimit("elixir", 2 + this.data.level / 0.5);
			this.init_();
		};
		proto.putCorruption = function(countCor){
			var plexus = ElixirPlexusRegistry.getNeasterPlexus(this.x, this.y, this.z);
			plexus.corruption += this.data.level * countCor;
		}
		proto.tick_ = proto.tick;
		proto.tick = function(){
			if(this.data.timeUpgrade < 1){
				this.tick_();
			}
			else{
				this.data.timeUpgrade--;
			}
			if (this.data.timeUpgrade = 0){
				
			}
			if (getTimer(20) && this.data.output){
				var result = this.container.getSlot("slotResult");
				result.count--;
				var source = World.getTileEntity(this.data.output.x, this.data.output.y, this.data.output.z).container.getSlot("slotSource"); 
				if (result.id != 0){
				source.id = result.id;
				source.count++;
				source.data = result.data;}
				this.container.validateAll();
			}
		};
		TileEntity.registerPrototype(id, proto);
	}
}


var MoneyProvider = {
	__money: 0,
	
	__bank: 1000000,
	
	init: function(){
		MoneyProvider.__money = parseInt(FileTools.ReadText(FileTools.root + "games/com.mojang/minecraftWorlds/" + World.getWorldDir() + "money.dat"));
	},
	
	refresh: function(){
		Game.message(ChatColor.GREEN + "Your bank: " + MoneyProvider.__money + " M");
		FileTools.WriteText(FileTools.root + "games/com.mojang/minecraftWorlds/" + World.getWorldDir() + "money.dat", MoneyProvider.__money);
	},
	
	add: function(count){
		if ((MoneyProvider.__money + count) < MoneyProvider.__bank) MoneyProvider.__money += count;
		MoneyProvider.refresh();
	},
	
	spend: function(count){
		if ((MoneyProvider.__money - count) > 0) MoneyProvider.__money -= count;
		MoneyProvider.refresh();
	}
}


var RecipeReg = {
	recipeData: {},
	
	registerRecipesFor: function(name, data, validateKeys){
		if (validateKeys){
			var newData = {};
			for (var key in data){
				newData[eval(key)] = data[key];
			}
			data = newData;
		}
		this.recipeData[name] = data;
	},
	
	addRecipeFor: function(name, source, result){
		this.requireRecipesFor(name, true)[source] = result;
	},
	
	requireRecipesFor: function(name, createIfNotFound){
		if (!this.recipeData[name] && createIfNotFound){
			this.recipeData[name] = {};
		}
		return this.recipeData[name];
	},
	
	getRecipeResult: function(name, sourceKey){
		var data = this.requireRecipesFor(name);
		if (data){
			return data[sourceKey];
		}
	}
}


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


defineOre("moneyore", {
	getVariations: function(){
		return [
			{
				name: "money ore",
				texture: [
					["moneyore", 0]
				],
				inCreative: true
			}
		];
	},
	getItem: function(){
		return {
			name: "money ore",
			texture: {
				name: "moneychunk",
				meta: 0
			}
		};
	},
	getGenerationParams: function(){
		return {
			minX: 10,
			maxY: 64,
			counts: 8,
			size: 3,
			ratio: .5,
			checker: {
				id: 0,
				mode: false
			}
		};
	},
	getLevel: function(){
		return 1;
	},
	getFurnResult: function(){
		return {
			result: ItemID.primal_money,
			count: 0
		}
	}
});

defineOre("zincore", {
	getVariations: function(){
		return [
			{
				name: "zinc ore",
				texture: [
					["zincore", 0]
				],
				inCreative: true
			}
		];
	},
	getItem: function(){
		return {
			name: "zinc ore",
			texture: {
				name: "zincchunk",
				meta: 0
			}
		};
	},
	getGenerationParams: function(){
		return {
			minX: 10,
			maxY: 64,
			counts: 8,
			size: 3,
			ratio: .3,
			checker: {
				id: 0,
				mode: false
			}
		};
	},
	getLevel: function(){
		return 1;
	},
	getFurnResult: function(){
		return {
			result: ItemID.zinc_ingot,
			count: 0
		}
	}
});

defineOre("copperore", {
	getVariations: function(){
		return [
			{
				name: "copper ore",
				texture: [
					["copperore", 0]
				],
				inCreative: true
			}
		];
	},
	getItem: function(){
		return {
			name: "copper ore",
			texture: {
				name: "copperchunk",
				meta: 0
			}
		};
	},
	getGenerationParams: function(){
		return {
			minX: 10,
			maxY: 64,
			counts: 8,
			size: 3,
			ratio: .5,
			checker: {
				id: 0,
				mode: false
			}
		};
	},
	getLevel: function(){
		return 1;
	},
	getFurnResult: function(){
		return {
			result: ItemID.copper_ingot,
			count: 0
		}
	}
});


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


IDRegistry.genBlockID("elixir_collector");

Block.createBlock("elixir_collector", [
{name: "Elixir Collector", texture: [["elixirstorage", 1]], inCreative: true}
]);

Recipes.addShaped({id: BlockID.elixir_collector, count: 1, data: 0}, [
"t",
"c",
"m"
], ["t", ItemID.brass_tube, 0, "c", ItemID.essence_core, 0, "m", BlockID.machine_block, 0]);

var CollectorGui = new UI.StandartWindow({
	standart: {
		inventory: {"standart": true},
		header: { text: {
			text: "Elixir Collector"}
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

MechRegistry.registerPrototype(BlockID.elixir_collector, {
	defaultValues: {
		target: null,
		baseProduce: 20,
		isStoring: true
	},
	
	getGuiScreen: function(){
		return CollectorGui;
	},
	
	init: function(){
		this.liquidStorage.setLimit("elixir", 0.4 * this.data.level);
		this.data.timeProduce = this.data.baseProduce * this.data.level;
		Game.message(MINECRAFT_HOUR_TIME / this.data.timeProduce);
	},
	
	tick: function(){
		this.liquidStorage.updateUiScale("elixir_scale", "elixir");
		
		if (getTimer(200 / this.data.level)) this.data.target = this.getPlexus();
		if (this.data.target) this.extractElixir();
		this.container.setText("level", "Level: " + this.data.level);
		this.container.setText("elixir","Elixir: " + Math.round(this.liquidStorage.getAmount("elixir") * 1000) + "/" + 400 * this.data.level);
		
		if (getTimer(10)){
			this.transfuseElixir(this.x, this.y - 1, this.z, 5 * this.data.level);
		}
	},
	
	getPlexus: function(){
		var target;
		var coords = {x: this.x, y: this.y, z: this.z};
		if (getTimer(40)) {while (!target){
			coords.y += 1;
			target = getPlexus(coords.x, coords.y, coords.z)
		}}
		this.buildTube({x: this.x, y: this.y + 1, z: this.z}, coords.y);
		return target;
	},
	
	buildTube: function(coords, width){
		for (let index = coords.y; index < width; index++){
			if (World.getBlockID(coords.x, index, coords.z) != BlockID.elixir_collector) World.setBlock(coords.x, index, coords.z, BlockID.machine_block, 1);
		}
	},
	
	extractElixir: function(){
		if (getTimer(Math.round(MINECRAFT_HOUR_TIME / this.data.timeProduce))){
	this.data.target.elixirs.normal -= 1 / (this.data.target.saturation / 100);
	if(Math.random() < (this.data.target.purity / 100)) this.liquidStorage.addLiquid("elixir", (1 / 1000));
		}
	},
	
	destroy: function(){
		if(this.data.target) for (var i = this.y; i < this.data.target.coords.y; i++){
			World.setBlock(this.y, this.y, this.z, 0);
			World.drop(this.x, i, this.z, ItemID.brass_tube, 1, 0);
		}
	}
});



IDRegistry.genBlockID("elixir_storage");

Block.createBlock("elixir_storage", [
{name: "Elixir Storage", texture: [["elixirstorage", 0]], inCreative: true}
]);

Recipes.addShaped({id: BlockID.elixir_storage, count: 1, data: 0}, [
"bgb",
"bmb",
"bgb"
], ["b", ItemID.glass_ball, 0, "g", ItemID.magic_gear, 0, "m", BlockID.machine_block, 0]);

var StorageGui = new UI.StandartWindow({
	standart: {
		inventory: {"standart": true},
		header: { text: {
			text: "Elixir Storage"}
		},
		background: {standart: true}	
	},
	
	drawing: [
		{type: "bitmap", x: 800, y: 100, bitmap: "elixir_scale", scale: 3} 
	],
	
	elements: {
			"elixir_scale": {type: "scale", x: 800, y: 100, bitmap: "scale_pattern", direction: 1, scale: 3},
			"level": {type: "text", x: 500, y: 100, text: "Level: 1", width: 300, height: 30},
			"elixir": {type: "text", x: 500, y: 150, text: "Elixir: 0", width: 300, height: 30}
		}
	});
	
MechRegistry.registerPrototype(BlockID.elixir_storage, {
	defaultValues: {
		isStoring: true
	},
	
	getGuiScreen: function(){
		return StorageGui;
	},
	
	init: function(){
		this.liquidStorage.setLimit("elixir", 4 * this.data.level);
	},
	
	tick: function(){
		this.liquidStorage.updateUiScale("elixir_scale", "elixir");
		this.container.setText("level", "Level: " + this.data.level);
		this.container.setText("elixir","Elixir: " + Math.round(this.liquidStorage.getAmount("elixir") * 1000) + "/" + 4000 * this.data.level);
		if (getTimer(10)){
			this.transfuseElixir(this.x, this.y - 1, this.z, 5 * this.data.level);
			this.translocate(2*this.data.level);
		}
	},
	
	translocate: function(mb){
		var liquid;
		var tiles = getTileEntityInArea(this.x, this.y, this.z, Math.round(this.getElixirStorage()/800) + 1);
		for (var tile in tiles){
			if (!tiles[tile].isStoring()){
				liquid = this.requireElixir(mb);
				if (liquid != undefined) tiles[tile].addElixir(liquid*1000);
				if (liquid != undefined) Particles.line(Native.ParticleType.spell2, {x: this.x+0.5, y: this.y+0.5, z: this.z+0.5}, {x: tiles[tile].x+0.5, y: tiles[tile].y+0.5, z: tiles[tile].z+0.5}, 1, {x: 0, y: 0, z: 0}, convertHex("7004B6"));
			}
		}
	}
});


IDRegistry.genBlockID("macerator");

Block.createBlockWithRotation("macerator", [
{name: "Crystallonium Macerator", texture: [["brassblock", 0],
 ["macerator", 2], 
 ["macerator", 1], 
 ["macerator", 0], 
 ["macerator", 1], 
 ["macerator", 1]], inCreative: true}]);
 
Recipes.addShaped({id: BlockID.macerator, count: 1, data: 0}, [
"dgd",
"dmd",
"sbs"
], ["d", 264, 0, "m", ItemID.magic_gear, 0, "g", ItemID.crystal_grinder, 0, "s", 4, 0, "b", BlockID.machine_block, 0]);
 
var MachineGUI = new UI.StandartWindow({
	standart: {
		inventory: {"standart": true},
		header: { text: {
			text: "Elimestic Machine"}
		},
		background: {standart: true}	
	},
	
	drawing: [
		{type: "bitmap", x: 800, y: 100, bitmap: "elixir_scale", scale: 3},
		{type: "bitmap", x: 500, y: 215, bitmap: "progress_background", scale: 4} 
	],
	
	elements: {
			"elixir_scale": {type: "scale", x: 800, y: 100, bitmap: "scale_pattern", direction: 1, scale: 3},
			"name": {type: "text", x: 350, y: 50, text: "Machine", width: 300, height: 30},
			"level": {type: "text", x: 350, y: 100, text: "Level: 1", width: 300, height: 30},
			"elixir": {type: "text", x: 350, y: 150, text: "Elixir: 0", width: 300, height: 30},
			"progress": {type: "scale", x: 500, y: 215, bitmap: "progress_scale", direction: 0, scale: 4},
			"slotSource": {type: "slot", x: 440, y: 215},
		"slotResult": {type: "slot", x: 590, y: 215}
		}
});

RecipeReg.registerRecipesFor("macerator", {
	1: {id: 4, count: 1, data: 0},
	4: {id: 12, count: 1, data: 0},
	13: {id: 318, count: 1, data: 0},
	369: {id: 377, count: 5, data: 0},
	35: {id: 287, count: 2, data: 0},
	352: {id: 351, count: 5, data: 15},
	14: {id: ItemID.gold_dust, count: 2, data: 0},
	15: {id: ItemID.iron_dust, count: 2, data: 0},
	41: {id: ItemID.gold_dust, count: 9, data: 0},
	42: {id: ItemID.iron_dust, count: 9, data: 0},
	145: {id: ItemID.iron_dust, count: 32, data: 0},
	265: {id: ItemID.iron_dust, count: 1, data: 0},
	266: {id: ItemID.gold_dust, count: 1, data: 0},
	"ItemID.copper_ore": {id: ItemID.copper_dust, count: 2, data: 0},
	"ItemID.zinc_ore": {id: ItemID.zinc_dust, count: 2, data: 0},
	"ItemID.crystalshard": {id: ItemID.crystal_dust, count: 1, data: 0},
	"ItemID.crystal": {id: ItemID.crystal_dust, count: 2, data: 10}
});

MechRegistry.registerPrototype(BlockID.macerator, {
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
		this.container.setText("name", "Crystal Macerator");
		this.container.setText("elixir","Elixir: " + Math.round(this.liquidStorage.getAmount("elixir") * 1000) + "/" + 200 * this.data.level);
		
		var sourceSlot = this.container.getSlot("slotSource");
		var result = RecipeReg.getRecipeResult("macerator", sourceSlot.id);
		if (result){
			if (this.getElixirStorage() > 1){ 
				this.requireElixir(0.0125);
				this.data.progress++;
			}
			if (this.data.progress >= (400 / this.data.level)){
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
		this.container.setScale("progress", this.data.progress / (400 * this.data.level));
	}
});


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


var STORING_MACHINES = [
		BlockID.elixir_collector,
		BlockID.elixir_storage
	]


ToolAPI.addToolMaterial("hell_tools", BASE_TOOL_MATERIAL);

var hell_sword_material = clone(BASE_TOOL_MATERIAL);

hell_sword_material.durability = 2775;

ToolAPI.addToolMaterial("hell_sword", hell_sword_material);

var chloro_sword_material = clone(BASE_TOOL_MATERIAL);

chloro_sword_material.durability = 4200;

ToolAPI.addToolMaterial("chloro_sword", chloro_sword_material);

ToolAPI.registerTool(ItemID.hell_pickaxe, "hell_tools", ["stone"],  {
	damage: 1,
	
	onAttack: function(carriedItem, victim){
		Entity.setFire(victim, 35);
	}
});

ToolAPI.registerTool(ItemID.hell_shovel, "hell_tools", ["dirt"],  {
	damage: 1,
	
	onAttack: function(carriedItem, victim){
		Entity.setFire(victim, 35);
	}
});

ToolAPI.registerTool(ItemID.hell_axe, "hell_tools", ["plant", "wood"],  {
	damage: 0,
	
	onAttack: function(carriedItem, victim){
		Entity.setFire(victim, 35);
	}
});

ToolAPI.registerSword(ItemID.hell_sword, "hell_sword", {
	damage: 5,
	
	onAttack: function(carriedItem, victim){
		Entity.setFire(victim, 45);
	}
});

ToolAPI.registerSword(ItemID.chloro_sword, "chloro_sword", {
	damage: 4
});

ToolAPI.registerTool(ItemID.chloro_pickaxe, "hell_tools", ["stone"], {
	damage: 4,
	
	tick: regenerateChloro
});

ToolAPI.registerTool(ItemID.chloro_axe, "hell_tools", ["wood"], {
	damage: 2,
	
	tick: regenerateChloro
});

ToolAPI.registerTool(ItemID.chloro_shovel, "hell_tools", ["dirt"], {
	damage: 4,
	
	tick: regenerateChloro
});

function regenerateChloro(){
	var pos = Player.getPosition();
	var item = Player.getCarriedItem()
	if (World.canSeeSky(pos.x, pos.y, pos.z) && item.data > 0){
		Player.setCarriedItem(item.id, item.count, getTimer(20) ? item.data-- : pass());
	}
}


IDRegistry.genItemID("connection_staff");

Item.createItem("connection_staff", "Connection Staff", {name: "connectstaff"});

Recipes.addShaped({id: ItemID.connection_staff, count: 1, data: 0}, [
	" cm",
	"ccc",
	"cc "
], ["c", ItemID.hardened_composite, 0, "m", ItemID.crystal, 0]);

Item.registerUseFunction("connection_staff", function(coords, item, block){
	var tile = World.getTileEntity(coords.x, coords.y, coords.z);
	if (connectstaff_mode.name == "input" && tile){
		connectstaff_mode.input = tile;
		connectstaff_mode.name = "output";
		Game.message("Machine at coords " + coords.x + ", " + coords.y + ", " + coords.z + " set as input");
		tile = null;
	}
	if (connectstaff_mode.name == "output" && tile){
		connectstaff_mode.input.data.output = {x: tile.x, y: tile.y, z: tile.z};
		connectstaff_mode.name = "input";
		Game.message("Machine at coords " + coords.x + ", " + coords.y + ", " + coords.z + " set as output");
		tile = null;
	}
});

Callback.addCallback("LevelLoaded", function(){
	connectstaff_mode.name = "input";
});


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


