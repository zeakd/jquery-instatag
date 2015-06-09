(function(factory) {
	var root = (typeof self == 'object' && self.self == self && self);
	if(typeof define === 'function' && define.amd) {
		define(['jquery'], function($){
			return factory(root, $);
		});
	} else {
		root.Instatag = factory(root, $);
	}
}(function (root, $) {
	var Instatag = function(opts) {
		var defaults = {
			success : function(){

			},
			sort : "recent" // likes, comments, popular
		};
		
		if(!opts || !(opts.accessToken || opts.clientId)) throw new Error("No accessToken or ClientId"); 
        for (var def in defaults) {
            if (typeof opts[def] === 'undefined') {
                opts[def] = defaults[def];
            }
            else if (typeof opts[def] === 'object') {
                for (var deepDef in opts[def]) {
                    if (typeof opts[def][deepDef] === 'undefined') {
                        opts[def][deepDef] = defaults[def][deepDef];
                    }
                }
            }
        }	
		var self = this;
		self.opts = opts;
		self.requests = [];
		self.data = [];

	};
	function _buildUrl(tagName){
		return "https://api.instagram.com/v1/tags/" + encodeURIComponent(tagName) + "/media/recent";
	};
	Instatag.prototype.send = function(){
		var self = this;
		$.each(self.opts.tags, function(idx, tag){
			var instaParams = {
			
			};
			var url = _buildUrl(tag);	
			if(self.opts.accessToken) instaParams["access_token"] = self.opts.accessToken;
			if(self.opts.clientId) instaParams["client_id"] = self.opts.clientId;
			self.requests[self.requests.length] = $.ajax({
			  dataType: "jsonp",
			  url: url,
			  data: instaParams,
			  success: function(response) {
				  console.log("Ajax response", response);
				  self.data = $.merge(self.data, response.data);
			  }
			});
		})	
		$.when.apply($, self.requests).done(function(){
			self.data = self.data.sortWithUniq(cmp.recent);
			self.opts.success(self.data);	
			console.log("all done", self.data);
//			$.each(self.data, function(idx, val){
//				console.log("create time " + idx+ " : ", val["created_time"]);
//			})
			
		})
	};
	Array.prototype.sortWithUniq = function(cmp, uniqKey){
		var sorted = this.sort(cmp);
		return $.map( sorted, function(val, idx) {
			if( idx !== 0 && sorted[idx-1]["id"] !== val["id"]) return val;
		})
												
	}

	var cmp = {
		recent : function(f, b){
			var key = "created_time";
			return b[key] - f[key];
		}
	}
	
	return Instatag;
}));