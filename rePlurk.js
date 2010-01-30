/**
 * 程式參考：RePlurk (http://userscripts.org/scripts/show/39186)
 * softcup
 **/
var rePlurk = function (doc) {
	var
		version   = 0.1.1,
		include   = ["http://www.plurk.com/"],
		exclude   = ["http://www.plurk.com/_comet/", "http://www.plurk.com/User/", "http://www.plurk.com/i18n/"],
		tabDoc = jetpack.tabs.focused.contentDocument
		tabJs = jetpack.tabs.focused.contentWindow.wrappedJSObject;

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

		$(tabDoc).find("#input_big").val(link + " ([原噗]) " + ((nick) ? ("@" + nick + ": ") : "") + raw);
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
			var link = "http://plurk.com/p/" + (plurk.plurk_id).toString(36);
			var raw = plurk.content_raw;
			var owner_id = plurk.owner_id;

			var pl = $(tabDoc).find("div.info_box div.perma_link");
			if ( (pl.length > 0) && ($(tabDoc).find("div.info_box a.RePlurk").length <= 0) ) {
				pl.after('<a href="#" style="float: right;" class="RePlurk">轉噗</a>');
				$(tabDoc).find("div.info_box a.RePlurk").click(function () {
					doRePlurk(owner_id, raw, link);
				});
			}
		}
	}
};

jetpack.tabs.onReady(rePlurk);
