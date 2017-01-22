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