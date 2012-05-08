(function(lib){
	var view = lib.util.extendNamespace('view');
	
	/**
	 * creates an icon box
	 * @param {function} [params.callback] the click callback
	 * @param {int} [params.icon] the project icon
	 * @param {string} params.klass the class for the icon
	 * @param {bool} [params.disabled=false] set if the icon is disabled
	 */
	view.IconBox = function(params) {
		var self = this;
		this.disabled = params.disabled === undefined ? false : params.disabled;
		var style = params.icon !== undefined ? ' style="background:url(img/icons/' + params.icon + '.png)"' : '';
		var icon = $('<a' + style + '/>');
		if(this.disabled) {
			params.klass += ' disabled';
		}	
		this.container = $('<div class="icon ' + params.klass + '"/>');
		if(params.callback) {
			icon.click(function(){
				if(!self.disabled) {
					params.callback();
				}
				
			});
		}
		
		this.container.append(icon);
		
	}
	
	view.IconBox.prototype.disable = function() {
		this.disabled = true;
		this.container.addClass('disabled');
	}
	
	view.IconBox.prototype.enable = function() {
		this.disabled = false;
		this.container.removeClass('disabled');
	}
    
    /**
     * sets if the icon appears  disabled
     * @param {bool} bool if true sets to disabled
     */
    view.IconBox.prototype.setDisabled = function(bool) {
        if(bool) this.disable();
        else this.enable();
    }
	
	
	
})(TicketManager);