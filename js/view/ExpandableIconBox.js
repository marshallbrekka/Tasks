(function(lib){
    var view = lib.util.extendNamespace('view');
    
    /**
     * creates an icon box
     * @param {function} acceptCallback 
     * @param {function} cancelCallback
     */
    view.ExpandableIconBox = function(acceptCallback, cancelCallback, openCallback) {
        var self = this;
        this.opened = false;
        this.disabled = false;
        this.left = $('<a class="left"/>');
        this.divider = $('<span/>');
        this.right = $('<a class="right"/>');
            
        this.container = $('<div class="icon expandable"/>');
        
        
        this.container.append(this.left, this.divider, this.right);
        this.divider.css({opacity:0});
        this.right.hide();
        
        this.left.click(function() {
            if(self.opened) {
                self.close();
                cancelCallback();
            } else {
                self.open();
                openCallback();
            }
            
        });
        
        this.right.click(function(){
            if(!self.disabled) {
                acceptCallback();
                self.close();
            }
            
            
        });
        
    }
    
    view.ExpandableIconBox.prototype.open = function() {
        
        this.opened = true;
        var self = this;
        this.container.addClass('expanded').animate({width:'109px'},100, function() {
            self._openHelper();
        });

        
    }
    
    view.ExpandableIconBox.prototype._openHelper = function() {
        this.right.fadeIn(200);
        this.divider.animate({opacity:.24}, 200);
    }
    
    view.ExpandableIconBox.prototype.close = function() {
        this.opened = false;
        var self = this;
        this.container.removeClass('expanded');
        this.right.fadeOut(200);
        this.divider.animate({opacity:0},200, function() {
            self._closeHelper();
        });
        
    }
    
    view.ExpandableIconBox.prototype._closeHelper = function() {
        var self = this;
        this.container.animate({width:'50px'}, 100, function(){
            if(self.disabled) {
                self.enable();
            } 
            
            
        });
        
    }
    
    view.ExpandableIconBox.prototype.disable = function() {
        this.disabled = true;
        this.right.addClass('disabled');
    }
    
    view.ExpandableIconBox.prototype.enable = function() {
        this.disabled = false;
        this.right.removeClass('disabled');
    }
    
    /**
     * sets if the icon appears  disabled
     * @param {bool} bool if true sets to disabled
     */
    view.ExpandableIconBox.prototype.setDisabled = function(bool) {
        if(bool) this.disable();
        else this.enable();
    }
    
    
    
})(TicketManager);