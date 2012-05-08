(function(lib){
    var view = lib.util.extendNamespace('view');
    
    
    
    /**
     * creates a selection list
     * @param {int} params.selectedIndex the starting selectedIndex
     * @param {objects[]} params.options the array of options
     * @param {string} options.label the label for the option
     * @param {string|int} options.value the value for the option
     * @param {function} params.callback the callback when an option was selected;
     */
    view.Select = function(params) {
        var self = this;
        this.selectedIndex = params.selectedIndex;
        
        var div = $('<div class="selection"/>');
        for (var i = 0; i < params.options.length; i++) {
            var klass = 'item-' + params.options[i].value;
            if(params.selectedIndex == i) klass += ' selected';
            if(i == 0) klass += ' top';
            else if(i == params.options.length - 1) klass += ' bottom';
            div.append('<div class="' + klass + '">' + params.options[i].label + '</div>');
        }
        div.on('click', 'div', function(e){
            self._callback($(this), params.callback);
        }).hide();
        this.container = div;
        
    
    }
    
    view.Select.prototype.setSelected = function(index) {
        if(index != this.selectedIndex) {
            var children = this.container.children();
            children.eq(this.selectedIndex).removeClass('selected');
            children.eq(index).addClass('selected');
            this.selectedIndex = index;
        }
    }
    
    view.Select.prototype._callback = function(element, callback) {
        this.setSelected(this.container.children().index(element));
        var classes = element.attr('class').split(' ');
        for(var i = 0; i < classes.length; i++) {
            if(classes[i].substr(0,5) == 'item-') {
                this.hide();
                var val = classes[i].substr(5);
                if(val == '') val = null;
                callback(val);
                return;
           }
       }    
    }
    
    view.Select.prototype.hide = function() {
        this.container.hide();  
    }
    
    view.Select.prototype.show = function() {
        this.container.show();  
    }
    
    view.Select.prototype.reset = function() {
        var elem = this.container.children().eq(0);
        this._callback(elem, function(){});
    }
})(TicketManager);