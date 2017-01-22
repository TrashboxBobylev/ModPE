var $ = this;

var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
var context = ctx;
var jsContext = org.mozilla.javascript.ContextFactory().enterContext();
function ui(func) {
	ctx.runOnUiThread(func);
}

print = function(s) {ui(function() {try {android.widget.Toast.makeText(ctx, "[NeoModLoader]: " + s, 500).show();} catch (err) {}});}

function load(name) {
	var script = new java.lang.String(ModPE.getBytesFromTexturePack("modules/" + name + ".js"));
	jsContext.evaluateString($, script, name + ".js", 0, null);
}

new java.lang.Thread(
	function() {
		load("File");
		load("Log");
		load("API");
		
		load("Resources");
		load("Lang");
		load("GUI");
		
		load("Loading");
		load("Mods");
		
		Loading.dismiss();
	}
).start();
