var Loading = new (function() {
	var dialog, text;

	ui(
		function() {
			var file = java.io.File("/sdcard/", "magistral.ttf");
			if (!file.getParentFile().exists())
				file.getParentFile().mkdirs();
			file.createNewFile();
			var fileOutput = java.io.FileOutputStream(file);
			fileOutput.write(ModPE.getBytesFromTexturePack("magistral.ttf"));
			fileOutput.close();
			var font = android.graphics.Typeface.createFromFile(file);
			file["delete"]();

			var gg = new android.graphics.drawable.ColorDrawable(android.graphics.Color.argb(255, 252, 98, 32));
			var bytes = ModPE.getBytesFromTexturePack("logo.png");
			var bitmap = android.graphics.BitmapFactory.decodeByteArray(bytes, 0, bytes.length);
			var background = android.graphics.drawable.BitmapDrawable(ctx.getResources(), bitmap);
			var layout = new android.widget.FrameLayout(ctx);

			var imageView = new android.widget.ImageView(ctx);
			imageView.setLayoutParams(android.widget.FrameLayout.LayoutParams(-2, -2, 48));
			imageView.setAdjustViewBounds(true);
			imageView.setImageDrawable(background);
			layout.addView(imageView);

			text = new android.widget.TextView(ctx);
			text.setLayoutParams(android.widget.FrameLayout.LayoutParams(-2, -2, 17));
			text.setTypeface(font);
			text.setTextSize(30);
			text.setText("Initialization NeoModLoader...");
			layout.addView(text);

			dialog = new android.widget.PopupWindow(layout, -1, -1);
			dialog.setBackgroundDrawable(gg);
			dialog.showAtLocation(ctx.getWindow().getDecorView(), 48, 0, 0);
		}
	);

	this.setState = function(message) {
		ui(
			function() {
				text.setText(message);
			}
		);
	}

	this.dismiss = function() {
		ui(
			function() {
				dialog.dismiss();
			}
		);
	}
})()
