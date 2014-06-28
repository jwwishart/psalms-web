
define(function() {
    "use strict";
    
    return {
        DEBUG: false,

        // Events
        //

        events: {
            // KUDOS: http://www.quirksmode.org/js/eventSimple.html
            attach: function (obj, event, fn) {
                if (obj.addEventListener) {
                    obj.addEventListener(event,fn,false);
                } else if (obj.attachEvent) {
                    obj.attachEvent('on'+event,fn);
                }
            },

            detach: function (obj, event, fn) {
                if (obj.removeEventListener) {
                    obj.removeEventListener(event,fn,false);
                } else if (obj.detachEvent) {
                    obj.detachEvent('on'+event,fn);
                }
            }
        },


        // Routing 
        // 

        routing: {
        },


        // Dom Manipulation
        //

        dom: {
            byID: function (id) {
                return document.getElementById(id);
            }
        },


        // String Manipulation and encoding
        //

        text: {
            isString: function(str) {
                return typeof str == 'string' || str instanceof String;
            },
            
            trim: function (str) {
                return str.replace(/^\s+|\s+$/gm,'');
            },

            // KUDOS: http://stackoverflow.com/a/7124052
            htmlEncode: function (str) {
                return String(str).replace(/&/g, '&amp;')
                                  .replace(/"/g, '&quot;')
                                  .replace(/'/g, '&#39;')
                                  .replace(/</g, '&lt;')
                                  .replace(/>/g, '&gt;');
            }
        }
    };

}());