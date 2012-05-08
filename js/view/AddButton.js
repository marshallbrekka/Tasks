(function(lib){
    var view = lib.util.extendNamespace('view');
    
	view.AddButton = function(addCallback, cancelCallback) {
        this.container = $('<li/>');
        this.add = true;
        var self = this;
        this.addCallback = addCallback;
        this.cancelCallback = cancelCallback;
        
        this.icon = new view.IconBox({
            klass : 'add',
            callback : function(){
                self.toggleIcon();
            }
        });
        this.container.append(this.icon.container);
    }
    
    view.AddButton.prototype.toggleIcon = function(cb) {
        var div = this.icon.container;
        if(this.add) {
            this.add = false;
            div.removeClass('add');
            div.addClass('cancel');
            this.addCallback();
        } else {
            this.add = true;
            div.removeClass('cancel');
            div.addClass('add');
            this.cancelCallback();
        }
		if(cb) cb();
    }
	
    
    
})(TicketManager);