(function(lib){
    var view = lib.util.extendNamespace('view');
    
	/**
	 * a view for a project
	 * @param {function(obj, [project])} params.callback gets called when editing or creating
	 * @param {function(project, view)} [params.removeCallback] gets called when project is removed
	 * @param {bool} [params.create=false] sets if you are creating a new project
	 * @param {model.Project} [params.project] only provide if create=false
	 * @param {function(icon)} params.iconAdded callback for an added icon
	 */
	view.Project = function(params) {
		this.create = params.create;
		var klass = params.create ? ' class="new"' : "";
        this.container = $('<li' + klass + '/>');
		if(params.create) {
			this.container.css({opacity:0, display:'none'});
		}
		
        this.values = {
            id : null,
            name : null,
            icon : null
        };
		
		if(!params.create) {
			this.project = params.project;
			this.values.id = params.project.id;
			this.values.name = params.project.name;
			this.values.icon = params.project.icon;
			this.valid = true;
		} else {
			this.valid = false;
		}
        
        
        var self = this;
		this.callback = params.callback;
		if(params.create) {
			this.add = new view.IconBox({
				callback : function(){
					self.createProject();
				},
				disabled : true,
				klass : 'save'
			});
			this.container.append(this.add.container);
		}
        
		
		var iconPickerOptions = {
			editCallback : function(icon) {
				self.iconCallback(icon);
			},
			removeCallback : function() {
				params.removeCallback(params.project, self);
			},
			iconAdded : params.iconAdded
		};
		
		if(!this.create) {
			iconPickerOptions.icon = this.values.icon;
		} else {
			iconPickerOptions.edit = true;
		}
		this.icon = new view.IconPickerBox(iconPickerOptions);
        
		
		var titleOptions;
		if(!params.create) {
			this.title = new view.TitleBox({
				label : params.project.name
			});
		} 
        
		this.editTitle = new view.TitleBox({
			create : true,
			callback : function(val) {
				self.nameCallback(val);
			},
			label : this.values.name
		});
		
      
        this.container.append(
            this.icon.container 
        );
			
		if(!this.create) {
			this.edit = new view.ExpandableIconBox(function() {
				self.editProject();
			}, function() {
				self.cancelEdit();
			}, function() {
				self.startEdit();
			});
			this.editTitle.container.hide();
			this.container.append(this.title.container, this.editTitle.container, this.edit.container);
		}  else {
			this.container.append(this.editTitle.container);
		}
        
        
        
    }
    
    view.Project.prototype.validate = function() {
        var valid = true;
        if(lib.util.empty(this.values.name)) {
            valid = false;
        } else if(lib.util.empty(this.values.icon)) {
            valid = false;
        } 
        
        if(valid != this.valid) {
            this.valid = valid;
			if(this.create) {
				this.add.setDisabled(!valid);
			} else {
				this.edit.setDisabled(!valid);
			}
            
        }
    }
	
	view.Project.prototype.nameCallback = function(val) {
		this.values.name = val;
        this.validate();
	}
	
	view.Project.prototype.iconCallback = function(val) {
		this.values.icon = val;
		this.validate();
	}
	
	
  
	
	view.Project.prototype.createProject = function() {
		if(this.valid) {
            this.callback(this.values);
        }
	}
	
	view.Project.prototype.startEdit = function() {
		this.title.container.hide();
		this.editTitle.container.show();
		this.icon.toggleEdit();
	}
	
	view.Project.prototype.editProject = function() {
		this.title.container.show();
		this.editTitle.container.hide();
		this.icon.toggleEdit();
		if(this.values.icon !== this.project.icon || this.values.name !== this.project.name) {
			this.title.setLabel(this.values.name);
			this.callback(this.values, this.project);
		}
		
	}
	
	view.Project.prototype.cancelEdit = function() {
		this.title.container.show();
		this.editTitle.container.hide();
		this.editTitle.setValue(this.project.name);
		this.values.name = this.project.name;
		this.values.icon = this.project.icon;
		this.icon.toggleEdit();
		this.icon.setIcon(this.project.icon);
	}
    
   
    
    view.Project.prototype.reset = function() {
        this.valid = false;
        for(var i in this.values) {
            if(this.values.hasOwnProperty(i)) {
                this.values[i] = null;
            }
        }
        this.add.disable();
		this.icon.setIcon(null);
        this.editTitle.reset();
    }
	
	view.Project.prototype.addEvents = function(){};
    
    
})(TicketManager);