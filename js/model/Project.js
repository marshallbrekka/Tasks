(function(lib){
    var model = lib.util.extendNamespace('model');
    
    model.Project = function(o) {
        this.id = o.id;
        this.name = o.name;
        this.icon = o.icon;
    }
})(TicketManager);