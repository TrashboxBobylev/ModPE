World.getWorldDir = ModAPI.requireGlobal("Level.getWorldDir");

var ElixirPlexusRegistry = {
	ElixirPlexus: function(coords){
		this.saturation = random(10, 100);
		this.purity = random(20, 100);
		this.elixirs = {
			normal: random(160000, 320000),
			black: random(16, 32)
		};
		this.corruption = 1;
		this.coords = coords;
		this.showEffect = function(x, y, z){
			if (true){		Particles.addParticle(x+0.5, y+0.5, z+0.5, Native.ParticleType.spell, 0, 0, 0, convertHex("ffff00ff"));
			}
		};
		this.updateElixirStats = function(){
			if (getTimer(60)){
				if (random(2)){
					this.elixirs.normal += 100
					this.elixirs.enriched--;
				}
				if (random(16)){
					this.elixirs.normal -= 100
					this.elixirs.enriched++;
				}
			}
		};
		this.update = function(){
 	this.showEffect(this.coords.x, this.coords.y, this.coords.z);
 	this.updateElixirStats();
 	World.setBlock(this.coords.x, this.coords.y, this.coords.z, BlockID.elixir_plexus);
		};
		this.save = function(){
					return {
						saturation: this.saturation,
						purity: this.purity,
						elixirs: this.elixirs,
						corruption: this.corruption,
						coords: this.coords
					};
				};
		this.read = function(data){
					if (!data){
						return;
					}
					else{
						var plexus = new ElixirPlexusRegistry.ElixirPlexus(data.coords);
						for (var date in data){
							plexus[date] = data[date];
						}
					}
				};
		Updatable.addUpdatable(this);
			ElixirPlexusRegistry.plexusAll.push(this);
		UpdatableSaver.registerPrototype("ELIXIR_PLEXUS", {save: this.save, read: this.read});
		UpdatableSaver.attachSaverPrototype(this, "ELIXIR_PLEXUS");
	},
	plexusAll: [],
	getPlexus: function(coords){
		var plexusAll = ElixirPlexusRegistry.plexusAll;
		for (var plexus in plexusAll){
			if (checkObjEqual(plexusAll[plexus].coords, coords)){
				return plexusAll[plexus];
			}
		}
		return null;
	},
	getNearestPlexus: function(x, y, z){
		var plexus = ElixirPlexusRegistry.plexusAll[0];
		var coords = {x: x, y: y, z: z};
		for (var id in ElixirPlexusRegistry.plexusAll){
			Game.message(id);
			if (Entity.getDistanceBetweenCoords(plexusAll[id].coords, coords) < Entity.getDistanceBetweenCoords(plexus.coords, coords)) plexus = plexusAll[id];
		}
		return plexus;
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

Item.registerUseFunctionForID(280, function(coords, item, block){
	new ElixirPlexusRegistry.ElixirPlexus(coords.relative);
});

Callback.addCallback("tick", function(chunkX, chunkZ){
	if (random(200) == 0 && getTimer(40)){
		var coords = randomCoordsOfPlayer(8);
		Game.message(Entity.getDistanceBetweenCoords(coords, Player.getPosition()));
		if (Entity.getDistanceBetweenCoords(coords, Player.getPosition()) < 32){
			new ElixirPlexusRegistry.ElixirPlexus(coords);
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
		if (this.liquidStorage.getLiquidStored() == "elixir")	this.liquidStorage.getLiquid("elixir", mb / 1000);
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
			"tubes": {type: "slot", x: 500, y: 200}
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
		while (!target){
			coords.y += 1;
			target = ElixirPlexusRegistry.getPlexus(coords);
		}
		this.buildTube({x: this.x, y: this.y + 1, z: this.z}, coords.y);
		return target;
	},
	
	buildTube: function(coords, width){
		for (let index = coords.y; index < width; index++){
			World.setBlock(coords.x, index, coords.z, BlockID.machine_block, 1);
		}
	},
	
	extractElixir: function(){
		if (getTimer(Math.round(MINECRAFT_HOUR_TIME / this.data.timeProduce))){
	this.data.target.elixirs.normal -= 1 / (this.data.target.saturation / 100);
	if(Math.random() < (this.data.target.purity / 100)) this.liquidStorage.addLiquid("elixir", (1 / 1000));
		}
	},
	
	destroy: function(){
		for (var i = this.y; i < this.data.target.coords.y; i++){
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


var STORING_MACHINES = [
		BlockID.elixir_collector,
		BlockID.elixir_storage
	]


