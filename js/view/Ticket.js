(function(lib){
    var view = lib.util.extendNamespace('view');
    
    /**
     * creates a ticket view
     * @param {model.Ticket} ticket the ticket
     * @param {function(ticket, view)} iconClick icon click callback function
     * @param {function(ticket, priority, view)} priorityChange callback function
     */
    view.Ticket = function(ticket, iconClick, priorityChange) {
        this.container = $('<li/>');
        this.ticket = ticket;
        var self = this;
        var icon = new view.IconBox({
            callback : function(){
                iconClick(ticket, self);
            },
            icon : ticket.project.icon,
            klass : 'removable'
        });
        
        var title = new view.TitleBox({
            label : ticket.project.name
        });
        
        var description = new view.DescriptionBox({
            text : ticket.description
        });
        
        
        var notesConfig = {
            klass : 'notes'
        };
        if(!lib.util.empty(ticket.notes)) {
            notesConfig.callback = function() {
                self.openNotes();
            }
        } else {
            notesConfig.disabled = true;
        }
        var notes = new view.IconBox(notesConfig);
        this.priority = new view.PriorityBox({
            priority : ticket.priority.id,
            callback : function(priority) {
                priorityChange(ticket, priority, self);
            }
        });
        
        this.container.append(icon.container, title.container, description.container, notes.container, this.priority.container);
        
        
        
    }
    
    view.Ticket.prototype.addEvents = function() {
        this.priority.addEvents();
    }
    
    view.Ticket.prototype.openNotes = function() {
        new view.Popup({
            notes : this.ticket.notes
        });
    }
    
    
})(TicketManager);