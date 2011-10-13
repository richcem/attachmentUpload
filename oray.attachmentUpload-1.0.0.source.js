/**
 * 上传附件插件
 * 
 * @param {Object} jQuery
 */
(function($){
	$.oray = $.oray || {version: '@VERSION'};
	
	$.oray.attachmentUpload = {
		conf: {
			url: null, //上传地址
			disableTag: '_disabled',
			optionTag: '_option',
			domain: null,
			formid: null,
			
			// OR对象,如：OR.Common
			ICommon : {},
			
			upload: function(form){
				var error = false;
				var self = this;
				
				attachmentQueue = [];
				form.find('[type=file]:enabled').each(function(key, file){
					var file = $(file);
					var id = file.attr('_name');
					var isOption = file.filter('[' + self.optionTag + ']').length;
			
					// 如果已经上传过了，不再上传
					if (attachment[id]) {
						return;
					}
			
					if (file.val() == '' && !isOption) {
						file.focus();
						error = true;
						return OR.Common.showMessage('请上传' + file.attr('title'), false);
					}
					
					// 可选附件支持
					if (isOption && file.val() == '') {
						return;
					}
					
					attachmentQueue.push(file);
				});
				
				if (error) {return;}
				
				attachmentNum = attachmentQueue.length;
		
				if (!attachmentNum) {
					self.saveAttachment(form);
					return;
				}
				
				OR.Common.showMessage('正在上传身份证明资料', true, 0);
				$.each(attachmentQueue, function(key, file){
					$.ajaxUpload({
						url: self.url,
						file: file[0],
						data: [{name: 'callback', value: 'document.domain="' + document.domain + '";window.top.$.oray.attachmentUpload.conf.callback(%s,"' + key + '")'}],
						dataType: "x-callback", // 随便构造一种类型，跳过某些操作
						beforeSend: function(){
							form.find('[type=file][_name=' + file.attr('_name') + ']').attr('disabled', true);
						},
						complete: function(){}
					});
				});
			},
			
			/**
			 * 保存附件
			 */
			saveAttachment: function(form){
				OR.Common.ajax({
					url: form.attr('action'),
					type: form.attr('method'),
					data: form.serializeArray(),
					dataType: "json",
					beforeSend: function(){
						OR.Common.showMessage(OR.Common.L.POSTDATA, true, 0);
						form.disabled();
					},
					success: function(ret){
						OR.Common.showMessage(ret.message, ret.success);
						if (ret.success) {
							if (ret.data) {
								$('#form-pending [name=data]').val(ret.data);
							}
							setTimeout(function(){$('#form-pending').submit()}, 1000);
						} else {
							form.enabled(':input:not([_disabled])');
						}
					}
				});
			},
			
			/**
			 * 上传后的回调函数
			 * 
			 * @param {Object} ret
			 * @param {string} key
			 */
			callback: function(ret, key){
				var conf = this;
				var file = attachmentQueue[key];
				var form = $(conf.formid);
				
				if (ret.success) {
					attachmentNum --;
					attachment[file.attr('_name')] = ret.name;
					if (attachmentNum < 1) {
						var val = '';
						$.each(attachment, function(i, v) {
							val += i + '|' + v + '\n';
						});
						form.find('[name=attachment]').val(val);
						conf.saveAttachment(form);
					} 
				}else {
					form.find('[type=file][_name=' + file.attr('_name') + ']:not([_disabled])').removeAttr('disabled').focus();
					OR.Common.showMessage(file.attr('title') + '错误：' + ret.message, false);
				}
			}
		},
	};
	
	var OR = OR || {};
	var attachment = {},
		attachmentQueue = [],
		attachmentNum = 0;
		
	/**
	 * 附件上传对象
	 * 
	 */
	function attachmentUpload(trigger, conf){
		var self = this;
		
		OR.Common = conf.ICommon || {};
		
		trigger.bind('submit', function(e){
			self.upload(this);
		});
			
		$.extend(self, {
			upload: function(e){
				conf.upload(trigger);
			},
		});
	}
	
	/**
	 * Init
	 * 
	 */
	$.fn.attachmentUpload = function(conf){
		var api = this.data('attachmentUpload');
		
		if (api) {return api;}
		
		conf = $.extend(true, $.oray.attachmentUpload.conf, conf, {formid: this.selector});
		
		// 跨域支持
		if (conf.domain) {
			document.domain = conf.domain;
		}
		
		this.each(function(){
			api = new attachmentUpload($(this), conf);
			$(this).data('attachmentUpload', api);
		});
		
		return conf.api ? api : this;
	};
	
})(jQuery);
