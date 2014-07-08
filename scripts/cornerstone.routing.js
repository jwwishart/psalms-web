
define(["cornerstone"], function(cs) {

	/**
	 * {
	 *	name : '', // a name of the route
	 *	route: ''  // route path "/path/to/file/:param"
	 *	handler: function (parameters, event) {
	 *	}
	 * }
	 * 
	 *	parameters: {
	 *		key is parameter name
	 *		value is value in parameter
	 *	}
	 *	event: {
	 *		name: '',
	 *		route: '',
	 *		parameters: {}
	 *	}
	**/
	var routes = {};

	function parseParameter(route, startIndex) {
		var i,
			length = route.length,
			c,
			paramName = '',
			done = false;

		for (i = startIndex + 1; i < length; i += 1) {
			c = route[i];

			switch(c) {
				case '/':
					done = true;
					break;
			}

			paramName += c;

			if (done === true) {
				break;
			}
		}

		return paramName;
	}

	function d (route) {
		var i,
			length = route.length,
			parts = [],
			current = '',
			c,
			isParamMode = false;

		for (i = 0; i < length; i += 1) {
			c = route[i];

			switch(c) {
				case ':':
					parts.push( {
						isParam: isParamMode,
						value: current
					});

					isParamMode = true;
					current = '';

					continue;
				case '/':
					parts.push( {
						isParam: isParamMode,
						value: current
					});

					isParamMode = false;
					current = '';
					current += c;
					break;
			}
		}

		return function(routeToParse) {
			var isMatch = true,
				i,
				part,
				length = parts.length,
				isParam = false,
				value = null,
				paramValues = {},
				paramValuePart = null;

			for(i = 0; i < length; i+=1) {
				isParam = parts[i].isParam;
				value   = parts[i].value;

				if (isParam === false) {
					routeToParse.indexOf(value) === 0;
					routeToParse = routeToParse.replace(value, '');
				} else {
					if (routeToParse.indexOf('/') !== -1) {
						paramValues[value] = paramValuePart = routeToParse.substring(0, routeToParse.indexOf('/'));
						routeToParse = routeToParse.replace(paramValuePart, '');
					} else {
						paramValues[value] = routeToParse;
					}
				}
			}

			return {
				isMatch: isMatch,
				parameters: paramValus
			};
		};
	}

	function generateComparitor (route) {
		return function(route) {
			var i,
				length = route.length,
				comparitor;

			for (i = 0; i < length ; i+=1) {

			}	
		};
	}

	function register (name, route, handler) {
		routes[name] = {
			name: name,
			route: route,
			handler: handler,
			pathComparitor: generateComparitor(route)
		};
	}

	function getRequestRoute() {
		return location.hash.slice(1) || '/';
	}

	function handleRequest() {
		var currentRoute = getRequestRoute(),
			comparitorResult;

		for (var key in routes) {
			comparitorResult = routes[key].pathComparitor(currentRoute);

			if (comparitorResult.isMatch === true) {
				routes[key].handler(comparitorResult.parameters,{
										name: routes[key].name,
										route: routes[key].route
									});
			}
		}
	}

	function wireupRouteChange () {
		cs.events.attach(window, "hashchange", handleRequest);
		cs.events.attach(window, "load", handleRequest);
	}

	function cancelRouteChange () {
		cs.events.detach(window, "hashchange", handleRequest);
		cs.events.detach(window, "load", handleRequest);	
	}

	// Export
	//

	return {
		register: register
		start: wireupRouteChange,
		stop: cancelRouteChange
	};
});