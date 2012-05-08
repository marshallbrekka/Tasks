(function(lib){
	lib.api = {
		init : function(cb) {
			this._url = lib.appUrl + '/php/TicketManager.php';
			this._generic('startup', null, {}, cb);
		},
		
		updateTicket : function(ticket, cb) {
			var data = {
				id : ticket.id,
				priority_id : ticket.priority.id
			};
			
			this._generic('update', 'ticket', data, cb);
		},
		
		/**
         * adds a ticket
         * cb sent a status object
         * {status:bool,data : {id:int, created:epochtime}};
         * 
         */
        addTicket : function(ticket, cb) {
			var data = {
				project_id : ticket.project.id,
				priority_id : ticket.priority.id,
				description : ticket.description,
				notes : ticket.notes
			};
			
			this._generic('add', 'ticket', data, cb);
		},
		
		removeTicket : function(ticket, cb) {
			var data = {
				id : ticket.id
			};
			
			this._generic('remove', 'ticket', data, cb);
		},
		
		addProject : function(project, cb) {
			var data = {
				name : project.name,
				icon_id : project.icon
			};
			
			this._generic('add', 'project', data, cb);
		},
		
		updateProject : function(project, cb) {
			var data = {
				id : project.id,
				name : project.name,
				icon_id : project.icon
			};
			
			this._generic('update', 'project', data, cb);
		},
		
		removeProject : function(project, cb) {
			var data = {
				id : project.id
			};
			
			this._generic('remove', 'project', data, cb);
		},
		
		_generic : function(action, type, data, callback) {
			data.action = action;
			data.type = type;
			var cb = function(data, status) {
				var output = {data:null, status: true};
				if(status !== 'success' || !data.status) {
					output.status = false;
				} else {
					output.data = data.data;
				}
                if(callback) {
                    callback(output);
                }
				
			}
			
			this._loadQuery(data, cb);
		},
		
		_loadQuery : function(data, callback) {
       
			$.ajax({
				url: this._url,
				dataType: 'json',
				data: data,
				success: callback,
				error : callback
			});
		}
		
		
	}
	
	
	
})(TicketManager);