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