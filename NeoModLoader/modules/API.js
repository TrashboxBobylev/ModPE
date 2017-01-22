var Display = new (function() {
	var metrics = ctx.getResources().getDisplayMetrics();

	this.width = metrics.widthPixels > metrics.heightPixels ? metrics.widthPixels : metrics.heightPixels, 
	this.height = metrics.heightPixels < metrics.widthPixels ? metrics.heightPixels : metrics.widthPixels, 
	this.dpi = metrics.density
})();

function dp2pixel(dp) {
	return dp * Display.dpi;
}

var Layout = {
	Gravity: {
		top: 48,
		left: 3,
		bottom: 80,
		right: 5,
		center: 17,
		topLeft: 51,
		topRight: 53,
		bottomLeft: 83,
		bottomRight: 85
	},
	LayoutParams: {
		fillParent: -1,
		wrapContent: -2
	},
	
};

var View = {
	VISIBLE: 0,
	INVISIBLE: 4,
	GONE: 8
};

Config = {
	parse: function(file) {
		return JSON.parse(File.read(file));
	}, 
	save:function(file, inp) {
		File.write(file, JSON.compile(inp));
	}
};

Mods = {
	getAPI:function(id) {
		if (!Mods.isModLoaded(id) || !mods[id].scope.hasOwnProperty("API"))
			return {};
		return mods[id].scope.API;
	}, 
	getVersion: function(id) {
		if (!Mods.isModLoaded(id) || !mods[id].hasOwnProperty("version"))
			return new Version();
		return mods[id].version;
	}, 
	isModLoaded:function(id) {
		if (mods.hasOwnProperty(id))
			return true;
		return false;
	}
};

var JSON = {
	parse: function(json) {
		return new org.mozilla.javascript.json.JsonParser(jsContext, {}).parseValue(json);
	},
	compile: function(object) {
		return org.mozilla.javascript.NativeJSON.stringify(jsContext, {}, object, null, null);
	}
};
