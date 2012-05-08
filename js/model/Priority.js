(function(lib){
	var model = lib.util.extendNamespace('model');
	
	model.Priority = function(o) {
		this.id = o.id;
		this.name = o.name;
		this.rank = o.rank;
	}
	
	
})(TicketManager);