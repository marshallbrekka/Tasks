(function(lib){
    
    
    lib.DataStore = {
        _icons : [],
        _priorities : {},
        _sortedPriorities : [],
        _projects : {},
        _sortedProjects : [],
        _sortedTickets : [],
        _tickets : {},
        getIcons : function() {
            return this._icons;
        },
        getProjects : function() {
            return this._sortedProjects;
        },
        getPriority : function(id) {
            return this._priorities[id];
        },
        getPriorities : function() {
            return this._sortedPriorities;
        },
        getProject : function(id) {
            return this._projects[id];
        },
        getTicket : function(id) {
            return this._tickets[id];
        },
        getTickets : function() {
            return this._sortedTickets;
        },
        getTicketIndex : function(ticket) {
            return this._sortedTickets.indexOf(ticket);
        },
        getProjectIndex : function(project) {
            return this._sortedProjects.indexOf(project);
        },
        sortTickets : function() {
            this._sortedTickets.sort(this._sortTickets);
        },
        
        addIcons : function(icons) {
            this._icons = this._icons.concat(icons);
        },
        addPriorities : function(prio) {
            for(var i = 0; i < prio.length; i++) {
                this._priorities[prio[i].id] = prio[i];
                this._sortedPriorities.push(prio[i]);
            }
            
            this._sortedPriorities.sort(function(a,b) {
                if(a.rank > b.rank) {
                    return 1;
                } else if(a.rank < b.rank) {
                    return -1;
                }
                return 0;
            });
            
        },
        addProjects : function(projects) {
            for(var i = 0; i < projects.length; i++) {
                this.addProject(projects[i]);
            }
            
            this._sortedProjects.sort(this._sortProjects);
        },
        addProject : function(project) {
            if(!lib.util.empty(project.id)) {
                this._projects[project.id] = project;
            }
            if (this._sortedProjects.indexOf(project) == -1) {
                this._sortedProjects.push(project);
                this._sortedProjects.sort(this._sortProjects);
            }
        },
        addTickets : function(tickets) {
            for(var i = 0; i < tickets.length; i++) {
                this.addTicket(tickets[i]);
            }
        },
        addTicket : function(ticket) {
            if(!lib.util.empty(ticket.id)) {
                this._tickets[ticket.id] = ticket;
            }
            if (this._sortedTickets.indexOf(ticket) == -1) {
                this._sortedTickets.push(ticket);
                this._sortedTickets.sort(this._sortTickets);
            }
            
        },
        removeProject : function(project) {
            delete this._projects[project.id];
            for(var i = 0; i < this._sortedProjects.length; i++) {
                if(project == this._sortedProjects[i]) {
                    this._sortedProjects.splice(i,1);
                    break;
                }
            }
        },
        removeTicket : function(ticket) {
            delete this._tickets[ticket.id];
            var index = this._sortedTickets.indexOf(ticket);
            this._sortedTickets.splice(index, 1);
            
        },
        removeTickets : function(project) {
            var deleted = [];
            for(var x in this._tickets) {
                if(this._tickets.hasOwnProperty(x)) {
                    var ticket = this._tickets[x];
                    if(ticket.project == project) {
                        var index = this._sortedTickets.indexOf(this._tickets[x]);
                        this._sortedTickets.splice(index, 1);
                        delete this._tickets[x];
                        
                        deleted.push(ticket);
                    }
                }
            }
            return deleted;
        },
        _sortProjects : function(a,b) {
            if(a.name > b.name) {
                return 1;
            } else if(a.name < b.name) {
                return -1;
            }
            return 0;
        },
        _sortTickets : function(a,b) {
            if(a.priority.rank != b.priority.rank) {
                return a.priority.rank - b.priority.rank;
            } else {
                if(lib.util.empty(a.created)) return -1;
                if(lib.util.empty(b.created)) return 1;
                return b.created - a.created;
            }
            return 0;
        }
    }
    
    
})(TicketManager);