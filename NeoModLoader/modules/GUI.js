var GUI = {
	Button: function() {
		var textColor = "#FFDDDDDD";

		var button = new android.widget.Button(context);
		button.setTextSize(16);
		button.setOnTouchListener(
			new android.view.View.OnTouchListener(
				function(v, motionEvent) {
					if (button.isClickable())
						GUIUtils.onTouch(v, motionEvent);
					return false;
				}
			)
		);
		button.setAllCaps(false);
		button.setBackground(resources.drawable.gui.button.normal.getConstantState().newDrawable());
		button.setTag(false); // is pressed?
		button.setTextColor(android.graphics.Color.parseColor(textColor));
		button.setPadding(8 * Display.dpi, 8 * Display.dpi, 8 * Display.dpi, 8 * Display.dpi);
		GUI.stylizeText(button);

		return button;
	},
	TextView: function() {
		var textColor = "#FFDDDDDD";

		var textView = new android.widget.TextView(context);
		textView.setTextSize(16);
		textView.setAllCaps(false);
		textView.setTextColor(android.graphics.Color.parseColor(textColor));
		GUI.stylizeText(textView);

		return textView;
	},
	Panel: function(x, y, width, height, isCenter, outsideTouchable) {
		if (isCenter == undefined)
			isCenter = false;
		if (outsideTouchable == undefined)
			outsideTouchable = false;
		var darkWindow;
		if (!outsideTouchable) {
			darkWindow = new android.widget.PopupWindow(GUI.TextView(), -1, -1);
			darkWindow.setBackgroundDrawable(resources.drawable.color.dark);
		}

		var panel = new android.widget.FrameLayout(context);
		var padding = dp2pixel(6);
		panel.setBackgroundDrawable(resources.drawable.gui.panel);
		panel.setPadding(padding, padding, padding, padding);

		var window = new android.widget.PopupWindow(panel, width, height);

		ui(
			function() {
				if (!outsideTouchable)
					darkWindow.showAtLocation(context.getWindow().getDecorView(), Layout.Gravity.center, 0, 0);
				window.showAtLocation(context.getWindow().getDecorView(), isCenter ? Layout.Gravity.center : Java.Gravity.topLeft, x, y);
			}
		);

		var controls = {
			dismiss: function() {
				darkWindow.dismiss();
				window.dismiss();
			}, 
			addView: function(view, x, y, width, height) {
				if (view.view != undefined)
					view = view.view;

				var layoutParams = android.widget.FrameLayout.LayoutParams(width, height);
				view.setLayoutParams(layoutParams);
				view.setX(x);
				view.setY(y);
				panel.addView(view);
			}
		};

		return controls;
	},
	ScrollList: function() {
		var list = new android.widget.ScrollView(context);
		var listLayout = new android.widget.LinearLayout(context);
		listLayout.setOrientation(1);
		list.addView(listLayout);

		var controls = {
			addItem: function(item) {
				//var layoutParams = android.widget.FrameLayout.LayoutParams(-1, -2);
				//item.setLayoutParams(layoutParams);
				listLayout.addView(item);
			},
			view: list
		};

		return controls;
	},
	stylizeText: function(textView) {
		textView.setTypeface(resources.font);
		textView.setPaintFlags(textView.getPaintFlags() | android.graphics.Paint.SUBPIXEL_TEXT_FLAG);
		textView.setLineSpacing(4 * Display.dpi, 1);
		var something = Math.round((textView.getLineHeight() - (4 * Display.dpi)) / 8);
		textView.setShadowLayer(1, something, something, android.graphics.Color.parseColor("#FF393939"));
	}
};

var GUIUtils = {
	onTouch: function(v, motionEvent) {
		var textColor = "#FFDDDDDD";

		var action = motionEvent.getActionMasked();

		if (action == android.view.MotionEvent.ACTION_DOWN) //button pressed
			GUIUtils.changeToPressedState(v);

		if (action == android.view.MotionEvent.ACTION_CANCEL || action == android.view.MotionEvent.ACTION_UP) //button released
			GUIUtils.changeToNormalState(v, textColor);

		if (action == android.view.MotionEvent.ACTION_MOVE) {
			var rect = new android.graphics.Rect(v.getLeft(), v.getTop(), v.getRight(), v.getBottom());
			if (rect.contains(v.getLeft() + motionEvent.getX(), v.getTop() + motionEvent.getY())) {
				// pointer inside the view
				if (v.getTag() == false) {
					// restore pressed state
					v.setTag(true); // is pressed?

					GUIUtils.changeToPressedState(v);
				}
			} else {
				// pointer outside the view
				if (v.getTag() == true) {
					// restore pressed state
					v.setTag(false); // is pressed?

					GUIUtils.changeToNormalState(v, textColor);
				}
			}
		}
	},
	changeToNormalState: function(button, textColor) {
		button.setBackground(resources.drawable.gui.button.normal);
		button.setTextColor(android.graphics.Color.parseColor(textColor));
		var something = Math.round((button.getLineHeight() - (4 * Display.dpi)) / 8);
		button.setShadowLayer(1, something, something, android.graphics.Color.parseColor("#FF393939"));
	}, 
	changeToPressedState: function(button) {
		button.setBackground(resources.drawable.gui.button.pressed);
		button.setTextColor(android.graphics.Color.parseColor("#FFFFFF9C"));
		var something = Math.round((button.getLineHeight() - (4 * Display.dpi)) / 8);
		button.setShadowLayer(1, something, something, android.graphics.Color.parseColor("#FF3E3E28"));
	}
};
