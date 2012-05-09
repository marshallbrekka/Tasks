(function(lib){
    var view = lib.util.extendNamespace('view');
    
    /**
     * creates an icon box
     * @param {function} [params.editCallback] the edit callback
     * @param {function} [params.removeCallback] the delete callback
     * @param {int} [params.icon] the icon
     * @param {bool} [params.edit=false] sets if starts in editing mode
     * @param {function(icon)} params.iconAdded 
     */
    view.IconPickerBox = function(params) {
        var self = this;
        this.open = false;
        this.create = params.icon === undefined;
        this.iconId = params.icon;
        var style = params.icon !== undefined ? ' style="background:url(img/icons/' + params.icon + '.png)"' : '';
        this.icon = $('<a' + style + '/>');
        this.arrow = $('<div class="arrow"/>'); 
        this.container = $('<div class="icon picker removable"/>');
        this.params = params;
        
        this.icon.click(function(e){
            self.iconCallback(e);
                
        });
        
        this.edit = params.edit;
        if(this.edit) {
            this.edit = false;
            this.toggleEdit();
        }
        this.container.append(this.icon, this.arrow);
        
        this.bodyClick = function(e) {
            e.stopPropagation();
            self.clickCallback(self.iconId);
        }
        
    }
    
    view.IconPickerBox.prototype.iconCallback = function(e) {
        e.stopPropagation();
        var self = this;
        if(this.edit && !this.open) {
            this.open = true;
            this.picker = new view.IconPopup({
                callback : function(icon){self.clickCallback(icon)},
                create : this.create,
                icon : this.iconId,
                iconAdded : this.params.iconAdded
            });
            this.container.append(this.picker.container);
            $('body').click(this.bodyClick);
            
        } else if(!this.edit) {
            this.params.removeCallback();
        }
        
        
        
    }
    
    view.IconPickerBox.prototype.clickCallback = function(icon) {
        this.open = false;
        $('body').off('click', this.bodyClick);
        this.picker.container.remove();
        this.picker = null;
        
        if(icon !== this.iconId) {
            this.setIcon(icon);
            this.params.editCallback(icon);
        }
    }
    
    view.IconPickerBox.prototype.toggleEdit = function() {
        if(this.edit) {
            this.container.removeClass('edit');
            this.container.addClass('removable');
            this.edit = false;
        } else {
            this.container.addClass('edit');
            this.container.removeClass('removable');
            this.edit = true;
        }
    }
    
    view.IconPickerBox.prototype.setIcon = function(icon) {
        if(icon == null) {
            this.icon.attr('style','');
        } else {
            this.icon.css({background: 'url(img/icons/' + icon + '.png)'});
        }
        this.iconId = icon;
        
    }
    
    
    
    
    
})(TicketManager);