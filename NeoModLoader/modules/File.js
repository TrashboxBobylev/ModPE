var File = {
	read: function(file) {
		if (!file.exists())
			file.createNewFile();
		var fileInput = new java.io.FileInputStream(file);
		var output = "";
		var data = fileInput.read();
		while (data != -1)
		{
			output += String.fromCharCode(data);
			data = fileInput.read();
		}
		fileInput.close();
		return output;
	},
	readBytes: function(file) {
		if (!file.exists())
			file.createNewFile();
		var fileInput = new java.io.FileInputStream(file);
		var output = [];
		var data = fileInput.read();
		while (data != -1)
		{
			output.push(data);
			data = fileInput.read();
		}
		fileInput.close();
		return output;
	},
	write: function(file, text) {
		if (!file.getParentFile().exists())
			file.getParentFile().mkdirs();
		file.createNewFile();
		var fileOutput = new java.io.FileOutputStream(file);
		var outputWriter = new java.io.OutputStreamWriter(fileOutput);
		outputWriter.write(text);
		outputWriter.close();
		fileOutput.close();
	}, 
	writeBytes: function(file, bytes) {
		if (!file.getParentFile().exists())
			file.getParentFile().mkdirs();
		file.createNewFile();
		var fileOutput = new java.io.FileOutputStream(file);
		fileOutput.write(bytes);
		fileOutput.close();
	}
};

var Paths = {};
Paths.minecraft = new java.io.File("/sdcard/games/com.mojang/minecraftpe");
Paths.mods = new java.io.File(Paths.minecraft, "mods");
Paths.configs = new java.io.File(Paths.minecraft, "configs");
Paths.logs = new java.io.File(Paths.minecraft, "logs");
Paths.tmp = new java.io.File("/sdcard/games/com.mojang/minecraftpe/tmp");

Paths.minecraft.mkdirs();
Paths.mods.mkdirs();
Paths.configs.mkdirs();
Paths.logs.mkdirs();
Paths.tmp.mkdirs();
