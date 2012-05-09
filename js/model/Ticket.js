(function(lib){
    var model = lib.util.extendNamespace('model');
    
    
    /**
     * ticket
     * @param {int} [o.id] the id, may not be present on initial create
     * @param {int} [0.created] the epoch time, may not be present on initial create
     * @param {int} 0.projectId the project if
     * @param {int} 0.priorityId the priority id
     * @param {string} o.description the description
     * @param {string} [o.notes] the notes
     */
    model.Ticket = function(o) {
        this.id = o.id;
        this.created = o.created;
        this.project = lib.DataStore.getProject(o.projectId);
        this.priority = lib.DataStore.getPriority(o.priorityId);
        this.description = o.description;
        this.notes = o.notes;
    }
})(TicketManager);