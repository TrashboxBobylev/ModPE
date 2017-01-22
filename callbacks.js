//Код на каллбаки by TrashboxBobylev
//Позволяет создавать, изменять и вызывать каллбаки

var CallbacksList = {
	Tick: [],
	UseItem: [],
	DestroyBlock: [],
	Commands: [],
	Chat: [],
	LevelLoaded: [],
	LevelLeave: [],
	Redstone: []
}

var CallbacksAPI = {
	addCallback: function(name, func){
		if (!CallbacksList[name]) CallbacksList[name] = [];
		CallbacksList[name].push();
	},
	
	invokeCallback: function(){
		
	}
}