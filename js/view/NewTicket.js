(function(lib){
    var view = lib.util.extendNamespace('view');
    
    view.NewTicket = function(callback) {
        this.container = $('<li class="new"/>');
        this.container.css({opacity:0, display:'none'});
        this.values = {
            project : null,
            description : null,
            notes : null,
            priority : null
        };
        this.valid = false;
        
        var self = this;
        this.callback = callback;
        this.icon = new view.IconBox({
            callback : function(){
                self.createTicket();
            },
            disabled : true,
            klass : 'save'
        });
        
        this.title = new view.TitleBox({
            edit : true,
            callback : function(val) {
                self.titleCallback(val);
            }
        });
        
        this.description = new view.DescriptionBox({
            edit : true,
            callback : function(val) {
                self.descriptionCallback(val);
            }
        });
        
        var notes = new view.IconBox({
            callback : function() {
                self.openNotes();
            },
            klass : 'notes'
        });
        this.priority = new view.PriorityBox({
            edit : true,
            callback : function(val) {
                self.priorityCallback(val);
            }
        });
        
        this.container.append(
            this.icon.container, 
            this.title.container, 
            this.description.container, 
            notes.container, 
            this.priority.container
        );
        
        
        
    }
    
    view.NewTicket.prototype.validate = function() {
        var valid = true;
        if(lib.util.empty(this.values.project)) {
            valid = false;
        } else if(lib.util.empty(this.values.description)) {
            valid = false;
        } else if(lib.util.empty(this.values.priority)) {
            valid = false;
        }
        
        if(valid != this.valid) {
            this.valid = valid;
            this.icon.setDisabled(!valid);
        }
    }
    
    view.NewTicket.prototype.descriptionCallback = function(val) {
        this.values.description = val;
        this.validate();
    }
    
    view.NewTicket.prototype.titleCallback = function(val) {
        this.values.project = val;
        this.validate();
    }
    
    view.NewTicket.prototype.priorityCallback = function(val) {
        this.values.priority = val;
        this.validate();
    }
    
    view.NewTicket.prototype.notesCallback = function(val) {
        this.values.notes = val;
    }
    
    view.NewTicket.prototype.createTicket = function() {
        if(this.valid) {
            this.callback(this.values);
        }
    }
    
    view.NewTicket.prototype.openNotes = function() {
        var self = this;
        new view.Popup({
            notes : this.values.notes,
            callback : function(val) {
                self.notesCallback(val);
            }
        });
    }
    
    view.NewTicket.prototype.reset = function() {
        this.valid = false;
        for(var i in this.values) {
            if(this.values.hasOwnProperty(i)) {
                this.values[i] = null;
            }
        }
        this.icon.disable();
        this.title.reset();
        this.description.reset();
        this.priority.reset();
    }
    
    
})(TicketManager);