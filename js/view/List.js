(function(lib){
    var view = lib.util.extendNamespace('view');
    
    view.List = function(createView,  elements) {
        var self = this;
        this.container = $('<ul/>');
        
		this.reset = function(){
            self.hideItem(createView, function(){
                createView.reset();
				
            });
		}

        this.addBtn = new view.AddButton(function(){
            self.showItem(createView);
        }, this.reset);
		this.container.append(createView.container, this.addBtn.container);
        
        if(!lib.util.empty(elements)) {
            for(var i = 0; i < elements.length; i++) {
                this.container.append(elements[i].container);
            }
        }
    }
	
	view.List.prototype.resetAdd = function(cb) {
		this.addBtn.toggleIcon(cb);
	}
    
    view.List.prototype.remove = function(index, item, cb, detach) {
        if(item == undefined) {
			item = {container : this.container.children().eq(index + 2)};
		}
        this.hideItem(item, function() {
			if(detach) {
				item.container.detach();
			} else {
				item.container.remove();
			}
            
            if(cb) {
                cb();
            }
        }); 
    }
    view.List.prototype.removeAll = function() {
        this.container.children(':gt(1)').remove();
    }
    
    view.List.prototype.addAll = function(elements) {
        if(!lib.util.empty(elements)) {
            for(var i = 0; i < elements.length; i++) {
                this.container.append(elements[i].container);
            }
        }
    }
    
    view.List.prototype.add = function(index, item, cb) {
        var before = this.container.children().eq(index + 1);
        item.container.css({opacity:0, display:'none'});
        before.after(item.container);
		item.addEvents();
        this.showItem(item, cb);
    }
    
    view.List.prototype.move = function(item, oldIndex, newIndex, cb) {
        var self = this;
        this.remove(oldIndex, item, function(){
            self.add(newIndex, item, cb);
        }, true);
    }
	
    
    view.List.prototype.hideItem = function(item, cb) {
        item.container.animate({'opacity' : 0}, 200);
        item.container.slideUp(300, function(){
            if(cb) cb();
        });
        
    }
    
    view.List.prototype.showItem = function(item, cb) {
        
        item.container.slideDown(300, function(){
			item.container.animate({'opacity' : 1}, 200);
            if(cb) cb();
        });
    }
    
    
})(TicketManager);