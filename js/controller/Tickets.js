(function(lib){
    var controller = lib.util.extendNamespace('controller');
    
    controller.Tickets = function(manageCallback, parent) {
        var self = this;
        var createView = new lib.view.NewTicket(function(vals){
            self.newTicket(vals);
        });
        var elements = [];
        var tickets = lib.DataStore.getTickets();
        
        
        for(var i = 0; i < tickets.length; i++) {
            elements.push(new lib.view.Ticket(tickets[i], function(ticket, view) {
                self.deleteCallback(ticket, view);
            }, function(ticket, priority, view) {
                self.priorityCallback(ticket, priority, view);
            }));
        }
        
        this.list = new lib.view.List(createView, elements);
        var button = new lib.view.Button('Manage Categories', manageCallback);
        this.page = new lib.view.Page(parent, [button, this.list]);
        parent.append(this.page.container);
    }
    
    
    
    
    controller.Tickets.prototype.newTicket = function(vals) {
        
        var ticket = new lib.model.Ticket({
            projectId : vals.project.id,
            priorityId : vals.priority.id,
            description : vals.description,
            notes : vals.notes
        });
        lib.api.addTicket(ticket, function(data){
            if(data.status) {
                ticket.id = data.data.id;
                ticket.created = data.data.created;
                lib.DataStore.addTicket(ticket);
            }
        })
        
        lib.DataStore.addTicket(ticket);
        var self = this;
        var index = lib.DataStore.getTicketIndex(ticket);
        var element = new lib.view.Ticket(ticket, function(ticket, view) {
                self.deleteCallback(ticket, view);
            }, function(ticket, priority, view) {
                self.priorityCallback(ticket, priority, view);
            });
        this.list.resetAdd(function(){
            self.list.add(index, element);
        });
        
        
    }
    
    controller.Tickets.prototype.deleteCallback = function(ticket, view) {
        this.list.remove(lib.DataStore.getTicketIndex(ticket));
        lib.DataStore.removeTicket(ticket);
        lib.api.removeTicket(ticket);
    }
    
    controller.Tickets.prototype.priorityCallback = function(ticket, priority, view) {
        var previousIndex = lib.DataStore.getTicketIndex(ticket);
        ticket.priority = priority;
        lib.api.updateTicket(ticket, function(){});
        lib.DataStore.sortTickets();
        var newIndex = lib.DataStore.getTicketIndex(ticket);
        if(previousIndex != newIndex) {
            this.list.move(view, previousIndex, newIndex);
        }
        
    }
    
    controller.Tickets.prototype.show = function(cb) {
        this.page.show(cb);
    }
    
    controller.Tickets.prototype.hide = function(cb) {
        this.page.hide(cb);
    }
    
    controller.Tickets.prototype.instantHide = function() {
        this.page.container.hide();
    }
    
    controller.Tickets.prototype.rebuildList = function() {
        this.list.removeAll();
        var elements = [];
        var tickets = lib.DataStore.getTickets();
        var self = this;
        
        for(var i = 0; i < tickets.length; i++) {
            elements.push(new lib.view.Ticket(tickets[i], function(ticket, view) {
                self.deleteCallback(ticket, view);
            }, function(ticket, priority, view) {
                self.priorityCallback(ticket, priority, view);
            }));
        }
        
        this.list.addAll(elements);
        
    }
    
})(TicketManager);