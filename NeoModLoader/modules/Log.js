Log = {
	info:function(text) {
		File.write(log, File.read(log) + "\n[INFO] [NML] " + text);
	},
	warning:function(text) {
		File.write(log, File.read(log) + "\n[WARNING] [NML] " + text);
	},
	error:function(text) {
		File.write(log, File.read(log) + "\n[ERROR] [NML] " + text);
	}
};

var log;
var date = java.lang.String.valueOf(android.text.format.DateFormat.format("yyyy-MM-dd_HH.mm.ss", new java.util.Date()));

for (var i = 0;;i++)
	if (!new java.io.File(Paths.logs + date + "-" + i + ".log").exists()) {
		log = new java.io.File(Paths.logs, date + "-" + i + ".log");
		break;
	}
File.write(log, "[INFO] NML initialization");
