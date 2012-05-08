(function(lib){
    var view = lib.util.extendNamespace('view');

    /**
     * creates a popup to display notes
     * @param {string} [params.notes] the text
     * @param {function} [params.callback] if you provide a callback it defaults to the edit state
     */
    view.Popup = function(params) {
        this.notes = params.notes == undefined ? '' : params.notes;
        this.body = $('body');
        this.makeOverlay();
        this.makeContent();
        this.makeMain(params.callback);
        this.addEvents(params.callback);
        
    }
	
    
    view.Popup.prototype.makeOverlay = function() {
		this.overlay = $('<div id="popupOverlay"></div>');
		this.body.prepend(this.overlay);
	}
	
	view.Popup.prototype.removeOverlay = function() {
		this.overlay.remove();
		this.overlay = null;
	}

	view.Popup.prototype.makeContent = function() {
		this.content = $('<div id="popupContent"></div>');
		this.body.prepend(this.content);
	}

	view.Popup.prototype.removeContent = function() {
		this.content.remove();
		this.content = null;
	}

	view.Popup.prototype.makeMain = function(edit) {
		var div = $('<div/>');
		if(edit !== undefined) {
			var h6 = $('<h6>Enter notes below<h6>');
			div.append(h6);
			this.input = $('<textarea rows="10">' + this.notes + '</textarea>');
			div.append(this.input);
			this.close = $('<a href="#cancel">Cancel</a>');
			this.save = $('<a href="#save">Save</a>');
			div.append(this.save);
			div.append(this.close);
		} else {
			div.append('<p>' + this.notes + '</p>');
			this.close = $('<a href="#close">Close</a>');
			div.append(this.close);

		}
		this.content.append(div);
	}

	view.Popup.prototype.addEvents = function(edit) {
        var self = this;
		this.close.click(function() {
			self.removeOverlay();
			self.removeContent();
		});
		if(edit != undefined) {
			this.save.click(function() {
				var data = self.input.val();
				self.removeOverlay();
				self.removeContent();
				edit(data);
			});
		}
	}



})(TicketManager);