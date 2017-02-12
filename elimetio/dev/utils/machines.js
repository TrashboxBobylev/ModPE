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