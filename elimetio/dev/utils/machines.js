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