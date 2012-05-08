(function(lib){
    var controller = lib.util.extendNamespace('controller');
    
    controller.Projects = function(doneCallback, modedCallback, parent) {
        var self = this;
		this.iconAddCallback = function(icon) {
			self.iconAdded(icon);
		}
        var createView = new lib.view.Project({
			callback : function(vals){
				self.newProject(vals);
			},
			create:true,
			iconAdded : this.iconAddCallback
		});
		
		this.modedCallback = modedCallback;
		var elements = [];
		var projects = lib.DataStore.getProjects();
		
		
		
		for(var i = 0; i < projects.length; i++) {
			elements.push(new lib.view.Project({
				project : projects[i],
				callback : function(params, project) {
					self.editProject(params, project);
				},
				removeCallback : function(project, view) {
					self.deleteCallback(project, view);
				},
				iconAdded : this.iconAddCallback
			}));
		}
		
        this.list = new lib.view.List(createView, elements);
		var button = new lib.view.Button('Done', doneCallback);
		this.page = new lib.view.Page(parent, [button, this.list]);
		parent.append(this.page.container);
		
		
    }
    
    
    
    
    controller.Projects.prototype.newProject = function(vals) {
		
        var project = new lib.model.Project({
            name : vals.name,
            icon : vals.icon
        });
        lib.api.addProject(project, function(data){
            if(data.status) {
                project.id = data.data.id;
                
                lib.DataStore.addProject(project);
            }
        })
        
        lib.DataStore.addProject(project);
		var self = this;
        var index = lib.DataStore.getProjectIndex(project);
		var element = new lib.view.Project({
			project : project,
			callback : function(params, project) {
				self.editProject(params, project);
			},
			removeCallback : function(project, view) {
				self.deleteCallback(project, view);
			},
			iconAdded : this.iconAddCallback
		});
		this.list.resetAdd(function(){
			self.list.add(index, element);
		});
        
        
    }
	
	controller.Projects.prototype.editProject = function(vals, project) {
        
		project.icon = vals.icon;
		project.name = vals.name;
        lib.api.updateProject(project, function(){});
		this.modedCallback();
        
    }
	
	controller.Projects.prototype.iconAdded = function(icon) {
		lib.DataStore.addIcons([icon]);
	}
    
    controller.Projects.prototype.deleteCallback = function(project, view) {
        this.list.remove(lib.DataStore.getProjectIndex(project));
        lib.DataStore.removeProject(project);
		lib.DataStore.removeTickets(project);
        lib.api.removeProject(project);
		this.modedCallback();
    }
	
	controller.Projects.prototype.show = function(cb) {
		this.page.show(cb);
	}
	
	controller.Projects.prototype.hide = function(cb) {
		this.page.hide(cb);
	}
	
	controller.Projects.prototype.instantHide = function() {
		this.page.container.hide();
	}
    
    controller.Projects.prototype.rebuildList = function() {
        this.list.removeAll();
        this.list.addAll(lib.DataStore.getProjects());
    }
    
})(TicketManager);