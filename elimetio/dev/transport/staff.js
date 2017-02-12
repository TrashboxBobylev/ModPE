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