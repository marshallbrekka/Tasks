(function(lib) {
	var view = lib.util.extendNamespace('view');
	
	/**
	 * creates the button for uploading a new icon
	 * @param {function(data)} loadedCallback called the form finishes submitting
	 */
	view.IconUploader = function(loadedCallback) {
		var self = this;
		this.init = false;
		this.loadedCallback = loadedCallback;
		this.container = $('<div class="create">+</div>').click(function(e){e.stopPropagation()});
		this.iframe = $('<iframe/>');
		this.iframe.load(function(){
			self.load();
		});	
		
		this.container.append(this.iframe);
	}
	
	
	
	
	view.IconUploader.prototype.createContents = function() {
		var self = this;
		var styles = '<style type="text/css"> body, form, input {margin:0;padding:0;border:0; overflow:hidden;} input {width:60px; height:60px; display:block;}</style>';
		this.form = $('<form enctype="multipart/form-data" action="' + lib.appUrl + '/php/TicketManager.php?action=add&type=icon" method="POST">');
		this.input = $('<input name="uploaded" type="file" />');
		this.input.change(function(){
			self.form.submit();
			self.submit();
		});
		this.form.append(this.input);
		
		this.iframe.contents().find('body').html("").append(styles, this.form);
		
	}
	
	view.IconUploader.prototype.submit = function() {
		this.iframe.hide();
		this.container.addClass('loading');
	}
	
	view.IconUploader.prototype.load = function() {
		if(this.init) {
			var val = this.iframe.get(0).contentWindow.icon;
			this.createContents();
			this.loadedCallback(val);
		} else {
			this.init = true;
			this.createContents();
		}
		this.container.removeClass('loading');
		this.iframe.show();
		
	}
	
	
})(TicketManager);