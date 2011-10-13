/**
 * 上传附件插件
 * 
 * @param {Object} jQuery
 */
(function($){
	$.oray = $.oray || {version: '@VERSION'};
	
	$.oray.attachmentUpload = {
		conf: {},
	};
	
	/**
	 * 附件上传对象
	 * 
	 */
	function attachmentUpload(trigger, conf){
		
	}
	
	$.fn.attachmentUpload = function(conf){
		var api = this.data('attachmentUpload');
		
		if (api) {return api;}
		
		conf = $.extend(true, {}, $.oray.attachmentUpload.conf, conf);
		
		this.each(function(){
			api = new attachmentUpload($(this), conf);
			$(this).data('attachmentUpload', api);
		});
		
		return conf.api ? api : this;
	};
	
})(jQuery);
