injectAjax = {};
(function(H, $) {
	H.getScript = function(url) {
		var args = arguments;
		if (args[0]) {
			$.get(args[0], function() {}, "text").then(
				function(data) {
					var script = document.createElement('script');
					script.text = data;
					document.getElementsByTagName('head')[0].appendChild(script);
				},
				function() {
					if (args[1]) {
						injectAjax.getScript(args[1]);
					}
				}
			);
		}
	},
	H.getTemp = function(url, id) {
		$.get(url, function(data) {
			var script = document.createElement('script');
			script.text = data;
			script.type = "text/template";
			script.id = id;
			document.getElementsByTagName('head')[0].appendChild(script);
		}, "text");
	}
})(injectAjax, jQuery);

jQuery(document).ready(function() {
	if (location.host == "wx.qq.com") {
		injectAjax.getScript("http://localhost/helper4wx/src/wx.js", "http://localhost/helper4wx/src/wx.js");
		//injectAjax.getTemp("", "");
	}
});