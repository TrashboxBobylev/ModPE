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
		for (var hook in CallbacksList[arguments[0]]){
			CallbacksList[arguments[0]][hook].call(null, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7]);
		}
	}
}