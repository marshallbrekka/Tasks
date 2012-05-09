(function(lib) {
    var view =lib.util.extendNamespace('view');
    
    /**
     * opens the icon chooser
     * @param {function(icon)} params.callback
     * @param {bool} [params.create] if in create mode will display the ? icon
     * @param {icon} [params.icon] the already chosen icon, if in create will default to ?
     * @param {function(icon)} params.iconAdded callback fro new icon
     */
    view.IconPopup = function(params) {
        var self = this;
        
        this.container = $('<div class="popup" />');
        this.callback = params.callback;
        this.iconAdded = params.iconAdded;
        var icons = lib.DataStore.getIcons();
        var element, klass;
        this.width = (icons.length + 1) * 61;
        if(params.create) {
            this.width += 60;
            klass = "empty";
            if(lib.util.empty(params.icon)) {
                klass += ' selected';
            };
            element = $('<div class="' + klass + '"><a></a></div>').click(buildCallback(null));
            this.container.append(element);
        }
        
        for(var i = 0; i < icons.length; i++) {
            this.container.append(this.createIcon(icons[i], buildCallback(icons[i]), params.icon));
        }
        
        this.container.width(this.width);
        
        var uploader = new view.IconUploader(function(data) {
            self.uploadCallback(data);
        });
        this.container.append(uploader.container);
        
        function buildCallback(icon) {
            
            return function(e) {
                
                self.clickCallback(icon, e);
            }
        }
        
    }
    
    view.IconPopup.prototype.uploadCallback = function(data) {
        var self = this;
        if(data.status) {
            this.width += 61;
            this.container.animate({width: this.width + 'px'}, function(){
                self.container.find('.create').before(self.createIcon(data.data.id,function(e){self.clickCallback(data.data.id, e)}, null ));
            })
            this.iconAdded(data.data.id);
        }
        
    }
    
    
    view.IconPopup.prototype.clickCallback = function(icon, e) {
        e.stopPropagation();
        this.callback(icon);
    }
    
    view.IconPopup.prototype.createIcon = function(icon, callback, selected) {
        var element;
        var klass = selected === icon ? ' class="selected"' : '';
        element = $('<div' + klass + '><a style="background-image:url(img/icons/' + icon + '.png)"></a></div>');
        element.click(callback);
        return element;
    }
    
    
})(TicketManager);