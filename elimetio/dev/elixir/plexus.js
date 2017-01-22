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
