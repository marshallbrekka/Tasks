(function(lib){
	var controller = lib.util.extendNamespace('controller');
	
	controller.Main = function(parent) {
		this.parent = parent;
		var self = this;
		lib.api.init(function(data) {
			self.startupCallback(data);
		});
		this.moded = false;
		
	}
	
	controller.Main.prototype.startupCallback = function(data) {
		var self = this;
		if(data.status) {
			var d = data.data;
			lib.DataStore.addIcons(d.icons);
			
			lib.DataStore.addPriorities(buildModel(lib.model.Priority, d.priorities));
			lib.DataStore.addProjects(buildModel(lib.model.Project, d.projects));
			lib.DataStore.addTickets(buildModel(lib.model.Ticket, d.tickets));		
		}
		
		function buildModel(model, objects) {
			var models = [];
			for(var i = 0; i < objects.length; i++) {
				models.push(new model(objects[i]));
			}
			return models;
		}
		
		this.ticketPage = new controller.Tickets(function() {
			self.ticketPage.hide(function() {
				self.projectPage.show();
			})
		}, this.parent);
		
		this.projectPage = new controller.Projects(function(){
			if(self.moded) {
				self.moded = false;
				self.ticketPage.rebuildList();
			}
			self.projectPage.hide(function() {
				self.ticketPage.show();
			})
		}, function(){self.moded = true}, this.parent);
		this.projectPage.instantHide();
		
		
		
	}
	
	
	
	
})(TicketManager);