/**
 * Reference code：RePlurk (http://userscripts.org/scripts/show/39186)
 * softcup
 * http://jetpackgallery.mozillalabs.com/jetpacks/325
 **/
var manifest = {
	settings: [{
		name: "replurk",
		type: "text",
		label: '<span style="white-space:nowrap;">轉噗文字</span>',
		default: "%link% ([原噗]) %nickname% %plurkcontent%"
	}]
};

jetpack.future.import("storage.settings");

var rePlurk = function (doc) {
	var
		version   = "0.1.4.1",
		include   = ["http://www.plurk.com/"],
		exclude   = ["http://www.plurk.com/_comet/", "http://www.plurk.com/User/", "http://www.plurk.com/i18n/"],
		tabDoc    = jetpack.tabs.focused.contentDocument,
		tabJs     = jetpack.tabs.focused.contentWindow.wrappedJSObject;

	var o_expand = null;

	function isPlurk(href) {
		for (var i = 0, c = include.length; i < c; i++) {
			if (href.indexOf(include[i]) === 0) {
				return true;
			}
		}
	};

	function doRePlurk(owner_id, raw, link) {
		if (typeof tabJs.Plurks == "undefined") return;

		var nick = tabJs.SiteState.getUserById(owner_id).nick_name;
		var txt  = jetpack.storage.settings.replurk;
		txt = txt.replace("%nickname%", (nick ? ("@" + nick + ": ") : "") ).replace("%link%", link).replace("%plurkcontent%", raw);

		$(tabDoc).find("#input_big").val(txt);
		tabJs.Plurks._removeExpand();
		tabJs.MaxChar.updateBig();		
	};

	if (!isPlurk(doc.location.href)) return;
	if (typeof tabJs.Plurks == "undefined") return;
	
	o_expand = tabJs.Plurks.expand;
	tabJs.Plurks.expand = function(div) {
		o_expand(div);

		var ib = $(tabDoc).find("#input_big");
		if ( (ib.length > 0) && (typeof tabJs.getPD == "function") ) {
			var plurk = tabJs.getPD(div).obj;
			// jetpack.notifications.show("id: " + plurk.id);
			var link = "http://plurk.com/p/" + (plurk.plurk_id).toString(36);
			var raw = plurk.content_raw;
			var owner_id = plurk.owner_id;

			var pl = $(tabDoc).find("div.info_box div.perma_link");
			if (pl.length > 0) {
				if ($(tabDoc).find("div.info_box a.RePlurk").length <= 0) {
					pl.after('<a href="#" style="float: right;" class="RePlurk">轉噗</a>');
				}
				$(tabDoc).find("div.info_box a.RePlurk").unbind("click").click(function () {
					doRePlurk(owner_id, raw, link);
				});
			}
		}
	}
};

jetpack.tabs.onReady(rePlurk);