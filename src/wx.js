//javascript:void((function(){src='http://localhost/wx.js?t='+Math.random();element=document.createElement('script');element.setAttribute('src',src);document.body.appendChild(element);})())
console.log(">>> web weixin helper start success... ...");
wx_helper = {};
$("#wx_helper_box").remove();

(function(H, $) {
	H.boxHTML = '<div><button id="wxh_show" style="float:left">群发助手</button></div><div style="clear:both"></div><div id="wxh_main" style="background-color:#E9E9E9;padding:5px;display:none;border:2px dotted #6B747A;"><div style="float:left;"><span id="wxh_friends_tab" style="cursor:pointer;background-color:#999;color:#fff">选择联系人</span>&nbsp;&nbsp;&nbsp;&nbsp;<span id="wxh_groups_tab" style="cursor:pointer">选择群组</span></div><div style="clear:both"></div><div style="height:300px;float:left;width:300px;border:1px solid #999;overflow:auto"><div id="wxh_friends_list"></div><div id="wxh_groups_list" style="display:none"></div></div><div style="clear:both"></div><div style="margin:5px;"><select style="width:290px;height:22px;margin:5px" id="wxh_templates"><option>选择群发模板</option></select><div style="clear:both"></div><textarea id="wxh_text" style="float:left;height:80px;width:240px;"></textarea><button id="wxh_send" style="margin-top:40px">群发</button></div><div style="clear:both"></div></div>';
	H.templates = ["恭喜发财,大吉大利!", "哈喽啊,{{名字}}! 介绍个好东西给你~", "我在这儿,欢迎来往,O(∩_∩)O哈哈~"];
	H.addrList = {
		groups : [],
		publics : [],
		friends : []
	};
	H.taskList = [];
	H.ready = false;
	H.openChat = function(username) {
		var def = new $.Deferred();
		var a = $("#con_item_" + username);
		a.click();
		setTimeout(function() {
			var sent = $("input[username=" + username + "]");
			sent.click();
			setTimeout(function() {
				def.resolve();
			}, 500);
		}, 500);
		return def.promise();
	};

	H.sendChat = function(txt) {
		var def = new $.Deferred();
		$("#textInput").val(txt);
		$("#chat_editor .chatSend").click();
		setTimeout(function() {
			def.resolve();
		}, 500);
		return def.promise();
	};

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
	};

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
	};

	H.addBox = function() {
		var def = new $.Deferred();
		var dv = document.createElement("div");
		dv.id = "wx_helper_box"
		$(dv).css({
			width : "320px",
			position : "absolute",
			top : "10px",
			left : "0px",
			zIndex : 100001,
			fontSize : "14px"
		});

		$(dv).html(H.boxHTML);
		$("body").append(dv);
		setTimeout(function() {
			def.resolve();
		}, 0);
		return def.promise();
	};

	H.syncBox = function() {
		var def = new $.Deferred();
		var $fd = $("#wxh_friends_list");
		var $gp = $("#wxh_groups_list");
		var f = "";
		var g = "";
		for (var i = 0; i < H.addrList.friends.length; i++) {
			f += buildTr(H.addrList.friends[i])
		}
		for ( i = 0; i < H.addrList.groups.length; i++) {
			g += buildTr(H.addrList.groups[i])
		}
		if (f) {
			f = '<table style="font-size:12px;text-align:left"><thead><tr><th><input id="wxh_friends_chkall" type="checkbox"/></th><th style="color:black">全选所有联系人</th></tr></thead><tbody>' + f + '</tbody></table>';
			$fd.html(f);
		}
		if (g) {
			g = '<table style="font-size:12px;text-align:left"><thead><tr><th><input id="wxh_groups_chkall" type="checkbox"/></th><th style="color:black">全选所有群组</th></tr></thead><tbody>' + g + '</tbody></table>';
			$gp.html(g);
		}
		function buildTr(addr) {
			var s = '<tr><td>';
			s += '<input type="checkbox" username="' + addr.username + '" nickname="' + addr.nickname + '"></td>'
			s += '<td>' + addr.nickname + '</td></tr>';
			return s;
		}

		var t = ""
		for ( i = 0; i < H.templates.length; i++) {
			t += '<option>' + H.templates[i] + '</option>';
		}
		$("#wxh_templates").append(t);

		setTimeout(function() {
			def.resolve();
		}, 0)
		return def.promise();
	};

	H.bindBox = function() {
		var def = new $.Deferred();
		var box = $("#wx_helper_box");
		box.on("click", "#wxh_show", function() {
			$("#wxh_main").toggle(200);
		});
		box.on("click", "#wxh_friends_tab", function() {
			$("#wxh_groups_list").hide();
			$("#wxh_friends_list").show();
			$("#wxh_friends_tab").css({
				backgroundColor : "#999",
				color : "#fff"
			});
			$("#wxh_groups_tab").css({
				backgroundColor : "#fff",
				color : "#999"
			});
		});
		box.on("click", "#wxh_groups_tab", function() {
			$("#wxh_friends_list").hide();
			$("#wxh_groups_list").show();
			$("#wxh_friends_tab").css({
				backgroundColor : "#fff",
				color : "#999"
			});
			$("#wxh_groups_tab").css({
				backgroundColor : "#999",
				color : "#fff"
			});
		});
		box.on("click", "#wxh_friends_chkall", chkAll);
		box.on("click", "#wxh_groups_chkall", chkAll);
		function chkAll(evt) {
			var ipt = evt.target;
			var $tbd = $(ipt).parent().parent().parent().next();
			var chks = $tbd.find("input[type=checkbox]");
			if (ipt.checked) {
				chks.attr("checked", true);
			} else {
				chks.attr("checked", false);
			}
		}


		box.on("change", "#wxh_templates", function(evt) {
			var str = evt.target.options[evt.target.selectedIndex].innerHTML;
			if (evt.target.selectedIndex === 0) {
				$("#wxh_text").val("");
			} else {
				$("#wxh_text").val(str);
			}
		});
		box.on("click", "#wxh_send", H.multiSend);
		setTimeout(function() {
			def.resolve();
		}, 0);
		return def.promise();
	};

	H.boot = function() {
		H.loadAddr().done(function() {
			H.addBox().done(function() {
				H.syncBox().done(function() {
					H.bindBox().done(function() {
						H.ready = true;
					});
				});
			});
		});
	};

	H.multiSend = function() {
		if (!H.ready) {
			return;
		}
		if ($("#wxh_text").val().trim() === "") {
			alert("先写点什么吧~");
			return;
		}
		H.taskList = [];
		var str = $("#wxh_text").val().trim();
		var hasName = false;
		if(str.indexOf("{{名字}}")>-1){
			hasName = true;
		}
		var addrs = $("#wx_helper_box tbody input[type=checkbox]");
		var nickList = [];
		addrs.each(function(idx, el) {
			var $el = $(el)
			if ($el.attr("checked")) {
				var task = {};
				task.username = $el.attr("username");
				task.nickname = $el.attr("nickname");
				nickList.push(task.nickname);
				task.text = str.split("{{名字}}").join(task.nickname);
				H.taskList.push(task);
			}
		});
		if (H.taskList.length == 0) {
			alert("发送给谁呢?");
			return;
		} else {
			var cfm = "发送给:" + nickList.join(", ") + ", 共" + nickList.length + "个好友或群组,确定么?";
			if(!hasName){
				cfm += "(发送会耗时一段时间,不要操作网页:)";
			}else{
				cfm += '(注意:"{{名字}}"通配符将替换成你在通讯录中给Ta起的"备注名"噢!!)';
			}
			if (window.confirm(cfm)) {
				H.exec();
			} else {
				H.taskList = [];
			}

		}
	};

	H.exec = function() {
		if (H.taskList == 0) {
			console.log("exec complete!");
		} else {
			var task = H.taskList.pop();
			H.send(task.username, task.text).done(function() {
				H.exec();
			});
		}
	}
	H.boot();
})(wx_helper, jQuery);

