export module cs {

	export var DEBUG = false;

	// Events
	//

	export module events {

		// KUDOS: http://www.quirksmode.org/js/eventSimple.html
		export function attach(obj: any, event: string, fn: Function) {
			if (obj.addEventListener) {
				obj.addEventListener(event,fn,false);
			} else if (obj.attachEvent) {
				obj.attachEvent('on'+event,fn);
			}
		}

		export function detach(obj: any, event: string, fn: Function) {
			if (obj.removeEventListener) {
				obj.removeEventListener(event,fn,false);
			} else if (obj.detachEvent) {
				obj.detachEvent('on'+event,fn);
			}
		}
	}


	// Routing 
	// 

	export module routing {

	}


	// Dom Manipulation
	//

	export module dom {
		export function byID(id: string) {
			return document.getElementById(id);
		}
	}


	// String Manipulation and encoding
	//

	export module text {
		export function trim(str: string) {
			return str.replace(/^\s+|\s+$/gm,'');
		}

		// KUDOS: http://stackoverflow.com/a/7124052
		export function htmlEncode(str: string) {
			return String(str).replace(/&/g, '&amp;')
							  .replace(/"/g, '&quot;')
							  .replace(/'/g, '&#39;')
							  .replace(/</g, '&lt;')
							  .replace(/>/g, '&gt;');
		}
	}

}