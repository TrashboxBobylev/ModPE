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
