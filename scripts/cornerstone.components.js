define(["cornerstone"], function (cs) {
	"use strict";

	var components = {};

	function register(name, definition) {
		components[name] = definition;
	}

	cs.components = {
		register: register
	};
});