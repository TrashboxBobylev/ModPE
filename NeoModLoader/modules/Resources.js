var resources = {
	drawable: {
		gui: {
			button: {
				normal: null, 
				pressed: null
			},
			window: null,
			panel: null
		}, 
		color: {
			transparent: new android.graphics.drawable.ColorDrawable(android.graphics.Color.TRANSPARENT), 
			black: new android.graphics.drawable.ColorDrawable(android.graphics.Color.BLACK),
			dark: new android.graphics.drawable.ColorDrawable(android.graphics.Color.argb(127, 0, 0, 0)), 
		}
	},
	font: null
};

var Resources = {
	get: function(path) {
		var bytes = ModPE.getBytesFromTexturePack(path);
		if (bytes == null)
			return false;
		return bytes;
	},
	getString: function(path) {
		var bytes = ModPE.getBytesFromTexturePack(path);
		if (bytes == null)
			return false;
		return new java.lang.String(bytes);
	}, 
	getImage: function(path) {
		var bytes = ModPE.getBytesFromTexturePack(path);
		if (bytes == null)
			return false;
		return android.graphics.BitmapFactory.decodeByteArray(bytes, 0, bytes.length);
	}, 
	get9Patch: function(path, widthDp, heightDp, widthPadding, heightPadding) {
		var bytes = ModPE.getBytesFromTexturePack(path);
		if (bytes == null)
			return false;
		var bitmap =  android.graphics.BitmapFactory.decodeByteArray(bytes, 0, bytes.length);
		var scaledBitmap = android.graphics.Bitmap.createScaledBitmap(bitmap, Math.round(dp2pixel(widthDp)), Math.round(dp2pixel(heightDp)), false); // scale image to a bigger size and based on density
		var NO_COLOR = 0x00000001;
		var buffer = java.nio.ByteBuffer.allocate(84).order(java.nio.ByteOrder.nativeOrder());
		buffer.put(0x01); //was translated
		for (var i = 1;i <= 2;i++) buffer.put(0x02); //divx & divy size
		buffer.put(0x09); //color size
		for (var i = 1;i <= 7;i++) buffer.putInt(0); //skip + padding + skip 4 bytes
		buffer.putInt(dp2pixel(widthPadding));
		buffer.putInt(dp2pixel(widthDp - widthPadding));
		buffer.putInt(dp2pixel(heightPadding));
		buffer.putInt(dp2pixel(heightDp - heightPadding));
		for (var i = 1;i <= 9;i++) buffer.putInt(NO_COLOR);

		return new android.graphics.drawable.NinePatchDrawable(ctx.getResources(), scaledBitmap, buffer.array(), new android.graphics.Rect(), ""); // convert to NinePatch
	}
};

File.writeBytes(new java.io.File(Paths.tmp, "font.ttf"), Resources.get("font.ttf"));
resources.font = android.graphics.Typeface.createFromFile(new java.io.File(Paths.tmp, "font.ttf"));
new java.io.File(Paths.tmp, "font.ttf")["delete"]();

resources.drawable.gui.button.normal = Resources.get9Patch("gui/button/normal.png", 16, 16, 4, 4);
resources.drawable.gui.button.pressed = Resources.get9Patch("gui/button/pressed.png", 16, 16, 4, 4);
resources.drawable.gui.window = Resources.get9Patch("gui/window.png", 32, 32, 8, 8);
resources.drawable.gui.panel = Resources.get9Patch("gui/panel.png", 28, 28, 6, 6);
