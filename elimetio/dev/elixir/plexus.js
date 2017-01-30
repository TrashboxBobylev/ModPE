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
	if (random(500) == 0 && getTimer(40)){
		var coords = randomCoordsOfPlayer(8);
		Game.message(Entity.getDistanceBetweenCoords(coords, Player.getPosition()));
		if (Entity.getDistanceBetweenCoords(coords, Player.getPosition()) < 32){
			plexus.deploy(coords.x, coords.y, coords.z);
		}
	}
});

LiquidRegistry.registerLiquid("elixir", "Liquid Elixir", ["elixir_texture"]);
