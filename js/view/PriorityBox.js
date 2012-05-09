(function(lib){
    var view = lib.util.extendNamespace('view');
    
    
    /**
     * the priority box
     * @param {int} [config.priority] the current priority, requred if this is not in edit mode
     * @param {bool} [config.edit=false] if in edit mode
     * @param {function(ticket, priority)} [config.callback] gets called everytime the priority changes
     */
    view.PriorityBox = function(config) {
        var self = this;
        this.open = false;
        this.callback = config.callback;
        this.priority = config.priority === undefined ? null : config.priority;
        this.priorityObj = config.priority === undefined ? new lib.model.Priority({id:null,name:'Priority', rank:null}) : lib.DataStore.getPriority(config.priority);
        this.container = $('<div class="status"/>');
        var klass = this.priorityObj.rank == null ? '' : ' class="level-' + this.priorityObj.rank + '"';
        this.text = $('<span' + klass + '>' + this.priorityObj.name + '</span>');
        
        this.container.append(this.text);
        
        this.edit = config.edit;
        
        this.close = function(e) {
            self.closeSelect(e);
        }
        
        this.addEvents();
        
    }
    
    view.PriorityBox.prototype.addEvents = function() {
        var self = this;
        this.container.click(function(e){
            self.openSelect(e);
        });
    }
    
    view.PriorityBox.prototype.closeSelect = function(e) {
        this.open = false;
        $('body').off('click',this.close);
        e.preventDefault();
        e.stopPropagation();
        this.select.container.remove();
        this.select = null;
    }
    
    view.PriorityBox.prototype.openSelect = function(e) {
        if(this.open) return;
        this.open = true;
        e.stopPropagation();
        var options = [];
        if(this.edit) {
            options.push({
                label : 'Priority',
                value : ''
            });
        }
        
        var priorities = lib.DataStore.getPriorities();
        var selectedIndex = 0;
        for(var i = 0; i < priorities.length; i++) {
            var index = options.push({
                label : priorities[i].name,
                value : priorities[i].id
            });
            if(priorities[i].id == this.priority) {
                selectedIndex = index - 1;
            }
            
        }
        
        
        var self = this;
        this.select = new view.Select({
            selectedIndex : selectedIndex,
            options : options,
            callback : function(id) {
                self.selectCallback(id)
            }
        });
        this.container.append(this.select.container);
        this.select.show();
        
        $('body').click(this.close);
        
        
    }
    
    view.PriorityBox.prototype.selectCallback = function(id) {
        id = id != null ? parseInt(id) : id;
        if(this.priority !== id) {
            var text, priority = null;
            
            if(this.priority !== null) {
                this.text.removeClass('level-' + this.priorityObj.rank);
            }
            if(id == null) {
                text = 'Priority';
                this.priorityObj = null;
            } else {
                priority = lib.DataStore.getPriority(id);
                this.priorityObj = priority;
                text = priority.name;
                this.text.addClass('level-' + priority.rank);
            }
        
            this.priority = id;
            this.text.text(text);
            this.callback(priority);
        }
    }
    
    view.PriorityBox.prototype.reset = function() {
        
        this.selectCallback(null);
    }
    
    
    
    
})(TicketManager);

