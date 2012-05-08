(function(lib){
    var view = lib.util.extendNamespace('view');
    
    
    /**
     * the description box
     * @param {bool} [config.edit=false] true if it should accept text input
     * @param {string} [config.text] the text
     * @param {function} [config.callback] only used when config.edit=true, calls every time the form changes
     */
    view.DescriptionBox = function(config) {
		var self = this;
        this.callback = config.callback;
		this.container = $('<div class="description"/>');
		if(config.edit) {
			this.label = $('<textarea/>');
            var valFn = function(){
                self.getValue();
            }
			this.label.keypress(valFn).keyup(valFn);
		} else {
            var val = config.text !== undefined ? config.text : '';
			this.label = $('<span>' + val + '</span>');
		}
        this.container.append(this.label);
	}
    
    view.DescriptionBox.prototype.getValue = function() {
        var val = this.label.val();
        if(val.length > 58) {
            val = val.substr(0, 58);
            this.label.val(val);
        }
        this.callback(val);
    }
    
    view.DescriptionBox.prototype.reset = function() {
        this.label.val('');
    }
	
    
})(TicketManager);

