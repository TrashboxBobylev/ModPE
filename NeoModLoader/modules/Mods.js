var NMLVersion = new Version("0.0.4");

function Version(str) {
	if (typeof str == "string") {
		var spl = str.split(".");
		this.major = spl[0] - 0;
		this.minor = spl[1] - 0;
		this.build = spl[2] - 0;
	} else {
		this.major = 0;
		this.minor = 0;
		this.build = 0;
	}

	this.setVersion = function(str) {
		var spl = str.split(".");
		this.major = spl[0] - 0;
		this.minor = spl[1] - 0;
		this.build = spl[2] - 0;
		return this;
	};

	this.getMajor = function() {
		return this.major;
	};

	this.getMinor = function() {
		return this.minor;
	};

	this.getBuild = function() {
		return this.build;
	};

	this.smallerThan = function(ver) {
		if (this.major < ver.major)
			return true;
		else if (this.major == ver.major && this.minor < ver.minor)
			return true;
		else if (this.major == ver.major && this.minor == ver.minor && this.build < ver.build)
			return true;
		else
			return false;
	};

	this.equalsTo = function(ver) {
		if (this.major == ver.major && this.minor == ver.minor && this.build == ver.build)
			return true;
		else
			return false;
	};

	this.biggerThan = function(ver) {
		if (this.major > ver.major)
			return true;
		else if (this.major == ver.major && this.minor > ver.minor)
			return true;
		else if (this.major == ver.major && this.minor == ver.minor && this.build > ver.build)
			return true;
		else
			return false;
	};

	this.toString = function() {
		return this.major + "." + this.minor + "." + this.build;
	};
};

var mods = [];
var cachedMods = [];
var hooks = [];
var commands = {};

var buttonWindow;

function Mod(directory) {
	this.directory = directory;

	if (!new java.io.File(directory, "mod.js").isFile()) {
		Log.error("Mod \"" + directory.getName() + "\" cannot be loaded. mod.js is missing");
		return;
	}

	if (!new java.io.File(directory, "pemod.info").isFile()) {
		Log.error("Mod \"" + directory.getName() + "\" cannot be loaded. pemod.info is missing");
		return;
	}

	var info = Config.parse(new java.io.File(directory, "pemod.info"));
	if (!info.hasOwnProperty("id") || !info.hasOwnProperty("name")) {
		Log.error("Mod \"" + directory.getName() + "\" cannot be loaded. pemod.info is incomplete");
		return;
	}

	if (Mods.isModLoaded(info["id"]))
		Log.error("Mod cannot be loaded. Mod with id \"" + info.id + "\"already loaded.");

	this.name = info.name;
	Loading.setState("\nLoading mods...\nLoading " + this.name + "...");
	this.id = info.id;
	this.description = info["description"] === undefined ? "No description available." : info.description;
	this.version = info["version"] === undefined ? undefined : new Version(info.version);
	this.authors = info["authors"] === undefined ? undefined : info.authors;
	this.dependencies = info["dependencies"] === undefined ? [] : info.dependencies;
	this.hooks = [];
	this.logo = java.io.File(this.directory, "logo.png").exists() ? android.graphics.BitmapFactory.decodeFile(java.io.File(this.directory, "logo.png")) : null;

	if (!new java.io.File(Paths.configs, this.id + ".cfg").exists);
	Config.save(new java.io.File(Paths.configs, this.id + ".cfg"), {});
	this.config = Config.parse(new java.io.File(Paths.configs, this.id + ".cfg"));
	this.scope = new API(this);

	if (new java.io.File(directory, "resources.zip").exists())
		net.zhuowerzhang.mcpelauncher.ScriptManager.modPkgTexturePack.addPackage(new io.File(directory, "resources.zip"));

	cachedMods.push(this);
}

function API(mod) {
	this.File = File;
	this.Mods = Mods;
	this.GUI = GUI;
	this.Resources = Resources;

	this.print = function(s) {ui(function() {try {android.widget.Toast.makeText(context, "[" + mod.name + "]: " + s, 500).show();} catch (err) {print(err);}});};

	this.Log = {
		info:function(text) {
			File.write(log, File.read(log) + "\n[INFO] [" + mod.name + "] " + text);
		},
		warning:function(text) {
			File.write(log, File.read(log) + "\n[WARNING] [" + mod.name + "] " + text);
		},
		error:function(text) {
			File.write(log, File.read(log) + "\n[ERROR] [" + mod.name + "] " + text);
		}
	};

	this.Config = {
		get:function(name) {
			return mod.config[name];
		}, 
		set:function(name, value) {
			mod.config[name] = value;
			Config.save(new java.io.File(Paths.configs, mod.id + ".cfg"), mod.config);
		}
	};

	this.ModPE = ModPE;
	this.Level = Level;
	this.Player = Player;
	this.Entity = Entity;
	this.Item = Item;
	this.Block = Block;
	this.Server = Server;

	this.Game = {
		addCommand: Game.addCommand,
		hook : function(hookName, func) {
			mod.hooks.push([hookName, func]);
		}
	};
}

function loadMod(directory) {
	if (directory.isDirectory()) {
		var modFile = new java.io.File(directory, "mod.js");
		if (modFile.isFile()) {
			var mod = new Mod(directory);
			return true;
		}
	}
}

function loadMods() {
	Loading.setState("Loading mods...");

	mods = [];
	mods["NML"] = {
		id: "NML",
		description: "First mod loader for MCPE",
		name: "NeoModLoader",
		version: NMLVersion,
		authors: "NeoKat",
		scope: {},
		hooks: [],
		logo: Resources.getImage("logo.png")
	};
	mods.push(mods.NML);
	var list = Paths.mods.listFiles();
	list.forEach(loadMod);
}

function showModList() {
	var padding = dp2pixel(6);

	var s = {};

	s.window = {
		x: (Display.height / 16) - padding,
		y: (Display.height / 16) - padding, 
		width: Display.width - (Display.height / 8),
		height: Display.height - (Display.height / 8),
		widthP: (Display.width - (Display.height / 8)) + (padding * 2),
		heightP: (Display.height - (Display.height / 8)) + (padding * 2)
	};

	s.title = {
		width: s.window.width,
		height: s.window.height / 12
	};

	s.closeButton = {
		x: (s.window.width / 4) + (s.window.width / 32),
		y: s.window.height - (s.window.height / 6),
		width: s.window.width - (s.window.width / 4) - (s.window.width / 32),
		height: s.window.height / 6
	};

	s.configButton = {
		y: s.window.height - (s.window.height / 6),
		width: s.window.width / 4,
		height: s.window.height / 12
	};

	s.modList = {
		y: s.title.height,
		width: s.window.width / 4,
		height: s.window.height - (s.title.height + s.closeButton.height)
	};

	s.modInfo = {
		x: s.modList.width + (s.window.width / 32),
		y: s.title.height,
		width: s.window.width - (s.modList.width + (s.window.width / 32)),
		height: s.window.height - (s.title.height + s.closeButton.height)
	};

	var panel = GUI.Panel(0, 0, s.window.widthP, s.window.heightP, true);

	var modInfo = GUI.ScrollList();

	var modInfoImage = new android.widget.ImageView(context);
	modInfoImage.setImageBitmap(null);
	modInfoImage.setScaleType(android.widget.ImageView.ScaleType.FIT_START);
	modInfoImage.setLayoutParams(android.widget.LinearLayout.LayoutParams(-2, s.modList.height / 6));
	modInfoImage.setVisibility(View.GONE);

	var modInfoText = GUI.TextView();
	modInfo.addItem(modInfoImage);
	modInfo.addItem(modInfoText);
	panel.addView(modInfo, s.modInfo.x, s.modInfo.y, s.modInfo.width, s.modInfo.height);

	var title = GUI.TextView();
	title.setText(lang.modsListTitle);
	title.setGravity(Layout.Gravity.center);
	panel.addView(title, 0, 0, s.title.width, s.title.height);

	var closeButton = GUI.Button();
	closeButton.setText(lang.close);
	closeButton.setOnClickListener(function() {showModsButton();panel.dismiss();});
	panel.addView(closeButton, s.closeButton.x, s.closeButton.y, s.closeButton.width, s.closeButton.height);

	var configButton = GUI.Button();
	configButton.setText(lang.modsListConfig);
	configButton.setOnClickListener(function() {});
	configButton.setClickable(false);
	configButton.setVisibility(View.GONE);
	panel.addView(configButton, 0, s.configButton.y, s.configButton.width, s.configButton.height);

	var modList = GUI.ScrollList();
	mods.forEach(
		function(mod) {
			modName = mod.name + "\n";
			if (mod.version !== undefined)
				modName += mod.version;

			var listItem = GUI.Button();
			listItem.setGravity(Layout.Gravity.left);
			listItem.setText(modName);
			listItem.setOnClickListener(
				function() {
					modInfoText.setText(getModInfo(mod));
					modInfoImage.setImageBitmap(mod.logo);
					if (mod.logo != null) modInfoImage.setVisibility(View.VISIBLE);
					else modInfoImage.setVisibility(View.GONE);
				}
			);
			modList.addItem(listItem);
		}
	);
	panel.addView(modList, 0, s.modList.y, s.modList.width, s.modList.height);

	hideModsButton();
}

function getModInfo(mod) {
	var text = (mod.logo == null ? "" : "\n") + mod.name + "\n" + lang.descID + ": '" + mod.id + "'\n";
	if (mod.hasOwnProperty("authors"))
		text += lang.descAuthors + ": '" + mod.authors + "'\n";
	if (mod.hasOwnProperty("description"))
		text += "\n" + mod.description;

	return text;
}

function showModsButton() {
	var layout = new android.widget.LinearLayout(context);
	buttonWindow = new android.widget.PopupWindow(layout, Layout.LayoutParams.wrapContent, Layout.LayoutParams.wrapContent);
	buttonWindow.setBackgroundDrawable(resources.drawable.color.transparent);

	var button = GUI.Button();
	button.setText(lang.modsButton);
	button.setOnClickListener(function() {showModList();});
	layout.addView(button);

	ui(
		function() {
			buttonWindow.showAtLocation(context.getWindow().getDecorView(), Layout.Gravity.top, 0, 0);
		}
	);
}

function hideModsButton() {
	buttonWindow.dismiss();
}

function initMods() {
	Loading.setState("Initializing mods...");
	var unmetMods = [];
	while (unmetMods.length != cachedMods.length) {
		unmetMods = [];
		while (cachedMods.length > 0) {
			var mod = cachedMods.shift();
			Loading.setState("\nInitializing mods...\nInitializing " + mod.name + "...");
			var dependenciesMet = true;
			mod.dependencies.forEach(
				function(item, index, array) {
					if (!Mods.isModLoaded(item))
						dependenciesMet = false;
				}
			);
			if (dependenciesMet) {
				var modFile = new java.io.File(mod.directory, "mod.js");
				jsContext.evaluateReader(mod.scope, new java.io.FileReader(modFile), modFile.getName(), 0, null);
				mods[mod.id] = mod;
				mods.push(mod);
			} else {
				unmetMods.push(mod);
			}
		}
		cachedMods = unmetMods;
	}
}

this.Game = {
		addCommand: function(command, func) {
			commands[command] = func;
		},
		registerBlock: function(id, block) {
			
		}
	};

var Hooks = {
	call: function(hookName, args) {
		mods.forEach(
			function(mod) {
				if (mod.scope.hasOwnProperty(hookName))
					mod.scope[hookName].apply(mod.scope, args);
				mod.hooks.forEach(
					function(hook) {
						if (hook[0] == hookName)
							hook[1].apply(mod.scope, args);
					}
				);
			}
		);
	}
};

function attackHook(attacker, victim) {
	Hooks.call(arguments.callee.name, arguments);
}

function chatHook(str) {
	if (str.startsWith("/")) {
		var spl = str.slice(1).split(" ");
		if (commands.hasOwnProperty(spl[0]))
			commands[spl.shift()].apply(undefined, spl);
	} else {
		Hooks.call(arguments.callee.name, arguments);
	}
}

function continueDestroyBlock(x, y, z, side, progress) {
	Hooks.call(arguments.callee.name, arguments);
}

function destroyBlock(x, y, z, side) {
	Hooks.call(arguments.callee.name, arguments);
}

function projectileHitEntityHook(projectile, targetEntity) {
	Hooks.call(arguments.callee.name, arguments);
}

function eatHook(hearts, saturationRatio) {
	Hooks.call(arguments.callee.name, arguments);
}

function entityAddedHook(entity) {
	Hooks.call(arguments.callee.name, arguments);
}

function entityHurtHook(attacker, victim, halfhearts) {
	Hooks.call(arguments.callee.name, arguments);
}

function entityRemovedHook(entity) {
	Hooks.call(arguments.callee.name, arguments);
}

function explodeHook(entity, x, y, z, power, onFire) {
	Hooks.call(arguments.callee.name, arguments);
}

function serverMessageReceiveHook(str) {
	Hooks.call(arguments.callee.name, arguments);
}

function deathHook(attacker, victim) {
	Hooks.call(arguments.callee.name, arguments);
}

function playerAddExpHook(player, experienceAdded) {
	Hooks.call(arguments.callee.name, arguments);
}

function playerExpLevelChangeHook(player, levelsAdded) {
	Hooks.call(arguments.callee.name, arguments);
}

function redstoneUpdateHook(x, y, z, newCurrent, someBooleanIDontKnow, blockId, blockData) {
	Hooks.call(arguments.callee.name, arguments);
}

function newLevel() {
	Hooks.call(arguments.callee.name, arguments);
}

function startDestroyBlock(x, y, z, side) {
	Hooks.call(arguments.callee.name, arguments);
}

function projectileHitBlockHook(projectile, blockX, blockY, blockZ, side) {
	Hooks.call(arguments.callee.name, arguments);
}

function modTick() {
	Hooks.call(arguments.callee.name, arguments);
}

function useItem(x, y, z, itemid, blockid, side, itemDamage, blockDamage) {
	Hooks.call(arguments.callee.name, arguments);
}

loadMods();
initMods();
showModsButton();
