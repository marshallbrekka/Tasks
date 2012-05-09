(function(lib){
    var view = lib.util.extendNamespace('view');
    
    
    /**
     * the title box
     * @param {bool} [config.create=false] true if it should accept text input
     * @param {string} [config.label='Project'] the text
     * @param {bool} [config.edit=false] sets if a selection list will appear when you click on the label
     * @param {function} [config.callback] gets called when the value changes (either textarea or selection list)
     */
    view.TitleBox = function(config) {
        var self = this;
        this.container = $('<div class="title"/>');
        if(config.create) {
            this.callback = config.callback;
            this.label = $('<input type="text" size="11"/>');
            if(config.label) this.label.val(config.label);
            var valFn = function(){
                self.getValue();
            }
            this.label.keypress(valFn).keyup(valFn);
            
        } else {
            this.label = $('<span>' + (config.label !== undefined ? config.label : 'Project') + '</span>');
            if(config.edit) {
                this.open = false;
                this.project = null;
                this.projectObj = null;
                this.close = function(e) {
                    self.closeSelect(e);
                }
                this.callback = config.callback;
                var options = [{
                    label : 'Project', 
                    value : ''
                }];
                var projects = lib.DataStore.getProjects();

                for(var i in projects) {
                    if(projects.hasOwnProperty(i)) {
                        options.push({
                            label : projects[i].name,
                            value : projects[i].id
                        });
                    }
                }

                this.select = new view.Select({
                    startingIndex : 0,
                    options : options,
                    callback : function (value) {
                        self.selectionCallback(value);
                    }
                });
                    
                this.container.click(function(e) {
                    self.openSelect(e);
                });
            }
        }
        this.container.append(this.label);
    }
    
    view.TitleBox.prototype.closeSelect = function(e) {
        this.open = false;
        $('body').off('click',this.close);
        e.preventDefault();
        this.select.container.remove();
        this.select = null;
    }
    
    view.TitleBox.prototype.openSelect = function(e) {
        if(this.open) return;
        this.open = true;
        e.stopPropagation();
        var options = [{
            label : 'Project',
            value : ''
        }];
        
        var projects = lib.DataStore.getProjects();
        var selectedIndex = 0;
        for(var i = 0; i < projects.length; i++) {
            var index = options.push({
                label : projects[i].name,
                value : projects[i].id
            });
            if(projects[i].id == this.project) {
                selectedIndex = index - 1;
            }
        }
        
        var self = this;
        this.select = new view.Select({
            selectedIndex : selectedIndex,
            options : options,
            callback : function(id) {
                self.selectCallback(id)
            }
        });
        this.container.append(this.select.container);
        this.select.show();
        
        $('body').click(this.close);
        
        
    }
    
    view.TitleBox.prototype.selectCallback = function(id) {
        id = id != null ? parseInt(id) : id;
        if(this.project !== id) {
            var text, project = null;
            
            if(id == null) {
                text = 'Project';
            } else {
                project = lib.DataStore.getProject(id);
                text = project.name;
            }
        
            this.project = id;
            this.label.text(text);
            this.callback(project);
        }
    }
    
    view.TitleBox.prototype.getValue = function() {
        var val = this.label.val();
        if(val.length > 11) {
            val = val.substr(0, 11);
            this.label.val(val);
        }
        this.callback(val);
    }
    
    view.TitleBox.prototype.setValue = function(val) {
        this.label.val(val);
    }
    
    view.TitleBox.prototype.setLabel = function(val) {
        this.label.text(val);
    }
    

    
    view.TitleBox.prototype.selectionCallback = function(val) {
        val = val == '' ? 'Project' : lib.DataStore.getProject(val).name;
        this.label.text(val);
        this.callback(val);
    }
    
    view.TitleBox.prototype.reset = function() {
        this.selectCallback(null);
    }
    
})(TicketManager);

