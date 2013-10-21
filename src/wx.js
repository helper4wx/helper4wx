//javascript:void((function(){src='http://localhost/wx.js?t='+Math.random();element=document.createElement('script');element.setAttribute('src',src);document.body.appendChild(element);})())
console.log(">>> web weixin helper start success... ...");
wx_helper = {};
(function(H, $) {
	H.addrList = {
		groups: [],
		publics: [],
		friends: []
	};
	H.openChat = function(username) {
		var def = new $.Deferred();
		var a = $("#con_item_" + username);
		a.click();
		setTimeout(function() {
			var sent = $("input[username=" + username + "]");
			sent.click();
			setTimeout(function() {
				def.resolve();
			}, 2000);
		}, 2000);
		return def.promise();
	}

	H.sendChat = function(txt) {
		var def = new $.Deferred();
		$("#textInput").val(txt);
		$("#chat_editor .chatSend").click();
		setTimeout(function() {
			def.resolve();
		}, 2000);
		return def.promise();
	}

	H.loadAddr = function() {
		var def = new $.Deferred();
		$(".addrButton").click();
		var addrLoaded = false;

		function chkAddrLoaded() {
			if ($("#contactListContainer").text().trim() !== "") {
				addrLoaded = true;
				readAddr();
				def.resolve();
			} else {
				setTimeout(chkAddrLoaded, 0);
				console.log("loading... ...")
			}
		}

		function readAddr() {
			var sets = $("#contactListContainer div.groupDetail").toArray();
			if (sets.length > 0) {
				var friends_set = sets.pop();
				var addrs = $(friends_set).find("a.friendDetail");
				addrs.each(function(idx, el) {
					H.addrList.friends.push(buildAddr(el));
				});
			}
			for (var i = 0; i < sets.length; i++) {
				var set = sets[i];
				var addrs = $(set).find("a.friendDetail");
				if (addrs.length > 0) {
					var firstName = $(addrs[0]).attr("username");
					if (firstName.indexOf("@chatroom") > 0) {
						addrs.each(function(idx, el) {
							H.addrList.groups.push(buildAddr(el));
						});
					} else {
						addrs.each(function(idx, el) {
							H.addrList.publics.push(buildAddr(el));
						});
					}
				}
			}
		}

		function buildAddr(el) {
			var addr = {};
			addr.el = el;
			addr.username = $(addr.el).attr("username");
			addr.nickname = $(addr.el).find(".nickName").text().trim();
			addr.imgsrc = $(addr.el).find("img").attr("src");
			addr.imgsrc2 = $(addr.el).find("img").attr("hide_src");
			return addr;
		}

		chkAddrLoaded();
		return def.promise();
	}

	H.send = function(username, txt) {
		var def = new $.Deferred();
		H.openChat(username).pipe(function() {
			return H.sendChat(txt);
		}).done(function() {
			setTimeout(function() {
				console.log("send success")
				def.resolve();
			}, 1000);
		})
		return def.promise();
	}
	H.addButton = function(){
		var dv = document.createElement("div");
		$(dv).css()
		$(dv).html("abc");
		$(body).appnd(dv);
	}
	H.boot = function(){
		H.loadAddr().then(H.addButton());
	}
	H.boot();
})(wx_helper, jQuery);






