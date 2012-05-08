(function(lib){
    var view = lib.util.extendNamespace('view');
    
    view.Button = function(label, callback) {
        this.container = $('<div class="btn">' + label + '</div>');
        this.container.click(callback);
    }
    
})(TicketManager);

