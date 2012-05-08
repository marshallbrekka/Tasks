(function(lib) {
    lib.util = {};
	var util = lib.util;
    

    /**
     * extends the application to create the appropriate namespace specified
     * @param {string} ns_string namespace string "obj.subobj.subsubobj"
     */
    util.extendNamespace = function (ns_string) {  
        var parts = ns_string.split('.'),  
            parent = lib,  
            pl, i;  
        if (parts[0] === "lib") {  
            parts = parts.slice(1);  
        }  
        pl = parts.length;  
        for (i = 0; i < pl; i++) {  
            //create a property if it doesnt exist  
            if (typeof parent[parts[i]] === 'undefined') {  
                parent[parts[i]] = {};  
            }  
            parent = parent[parts[i]];  
        }  
        return parent;  
    }
    
    /**
	 * checks if the value is empty or not
	 * @param {object|number|string|function} val the value to check
	 */
	util.empty = function(val) {
		return (val === undefined || val === null || val === "");
	}

})(TicketManager);


