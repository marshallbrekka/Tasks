(function(lib){
    var view = lib.util.extendNamespace('view');
    
    view.Page = function(parent, elements) {
        this.parent = parent;
        this.container = $('<div class="page"/>');
        for(var i = 0; i < elements.length; i++) {
            this.container.append(elements[i].container);
        }
    }
    
    view.Page.prototype.hide = function(cb) {
        var height = this.container.outerHeight();
        this.parent.height(height);
        this.container.fadeOut(200, cb);
    }
    
    view.Page.prototype.show = function(cb) {
        var height = this.container.outerHeight();
        var self = this;
        this.parent.animate({height : height + 'px'}, 200, function() {
            self._showHelper(cb);
        });
    }
    
    view.Page.prototype._showHelper = function(cb) {
        this.container.fadeIn(200, cb);
        this.parent.css('height', 'auto');
    }
    
    
})(TicketManager);
