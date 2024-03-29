/*
 Name: autoComplete
 Author: Raymond Camden & Andy Matthews
 Contributors: Jim Pease (@jmpease)
 Website: http://raymondcamden.com/
 http://andyMatthews.net
 Packed With: http://jsutility.pjoneil.net/
 Version: 1.4.3
 */
(function(e) {"use strict";
	var t = {
		method : "GET",
		icon : "arrow-r",
		cancelRequests : !1,
		target : e(),
		source : null,
		callback : null,
		link : null,
		minLength : 0,
		transition : "fade",
		matchFromStart : !0
	}, n = {}, r = function(t, n, r) {
		var s = [];
		n && e.each(n, function(t, n) {
			e.isPlainObject(n) ? s.push("<li data-icon=" + r.icon + '><a data-transition="' + r.transition + "\" data-autocomplete='" + JSON.stringify(n) + "'>" + n.label + "</a></li>") : s.push("<li data-icon=" + r.icon + '><a data-transition="' + r.transition + '">' + n + "</a></li>")
		});
		e(r.target).html(s.join("")).listview("refresh");
		r.callback !== null && e.isFunction(r.callback) && i(r);
		s.length > 0 ? t.trigger("targetUpdated.autocomplete") : t.trigger("targetCleared.autocomplete")
	}, i = function(t) {
		e("li a", e(t.target)).bind("click.autocomplete", function(e) {
			e.stopPropagation();
			e.preventDefault();
			t.callback(e)
		})
	}, s = function(e, t) {
		t.html("").listview("refresh").closest("fieldset").removeClass("ui-search-active");
		e.trigger("targetCleared.autocomplete")
	}, o = function(t) {
		var i = e(this), o = i.attr("id"), u, a, f = i.jqmData("autocomplete"), l, c;
		if (f) {
			u = i.val();
			if (u.length < f.minLength)
				s(i, e(f.target));
			else if (e.isArray(f.source)) {
				a = f.source.sort().filter(function(t) {
					f.matchFromStart ? (l, c = new RegExp("^" + u, "i")) : (l, c = new RegExp(u, "i"));
					e.isPlainObject(t) ? l = t.label : l = t;
					return c.test(l)
				});
				r(i, a, f)
			} else
				typeof f.source == "function" ? f.source(u, function(e) {
					r(i, e, f)
				}) : e.ajax({
					type : f.method,
					url : f.source,
					data : {
						term : u
					},
					beforeSend : function(e) {
						if (f.cancelRequests) {
							if (n[o])
								n[o].abort();
							else {
								f.target.html('<li data-icon="none"><a href="#">Searching...</a></li>').listview("refresh");
								f.target.closest("fieldset").addClass("ui-search-active")
							}
							n[o] = e
						}
					},
					success : function(e) {
						r(i, e, f)
					},
					complete : function(e, t) {
						f.cancelRequests && (n[o] = null)
					},
					dataType : "json"
				})
		}
	}, u = {
		init : function(n) {
			var r = this;
			r.jqmData("autocomplete", e.extend({}, t, n));
			var i = r.jqmData("autocomplete");
			return r.unbind("keyup.autocomplete").bind("keyup.autocomplete", o).next(".ui-input-clear").bind("click", function(t) {
				s(r, e(i.target))
			})
		},
		update : function(t) {
			var n = this.jqmData("autocomplete");
			n && this.jqmData("autocomplete", e.extend(n, t));
			return this
		},
		clear : function() {
			var t = this.jqmData("autocomplete");
			t && s(this, e(t.target));
			return this
		},
		destroy : function() {
			var t = this.jqmData("autocomplete");
			if (t) {
				s(this, e(t.target));
				this.jqmRemoveData("autocomplete");
				this.unbind(".autocomplete")
			}
			return this
		}
	};
	e.fn.autocomplete = function(e) {
		if (u[e])
			return u[e].apply(this, Array.prototype.slice.call(arguments, 1));
		if ( typeof e == "object" || !e)
			return u.init.apply(this, arguments)
	}
})(jQuery); 