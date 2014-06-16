

(function($) {
	var _transitioning = false;

	function hidePage(page, callback) {
		if (_transitioning === true) {
			setTimeout(function() {
				hidePage(page, callback)
			}, 4);

			return;
		}

		_transitioning = true;

		_selectElement(page).fadeOut(cs.hidePage.speed, function() {
			_transitioning = false;
			if (callback) callback();
		});
	}

	function showPage(page, callback) {
		if (_transitioning === true) {
			setTimeout(function() {
				showPage(page, callback)
			}, 4);
			
			return;
		}

		_transitioning = true;

		// Hide pages that are showing
		$(".page:visible").hide();

		window.scrollTo(0, 0);

		// Show the page
		_selectElement(page).fadeIn(cs.showPage.speed, function() {
			_transitioning = false;
			
			//window.location.hash = page;

			if (callback) callback();
		});
	}

	function _selectElement(idElementOrjQuery) {
		var hash = '#';

		// String
		if ($.type(idElementOrjQuery) === 'string') {
			idElementOrjQuery = $.trim(idElementOrjQuery);

			// If has a hashe don't add one to query...
			if (idElementOrjQuery.indexOf(hash) != -1) {
				hash = ''; 
			}

			idElementOrjQuery = $(hash + idElementOrjQuery);
		}

		// Element assumed
		if (!(idElementOrjQuery instanceof jQuery)) {
			idElementOrjQuery = $(idElementOrjQuery); // assumed to be an element
		}

		return idElementOrjQuery;
	}

	// Export
	//

	window.cs.hidePage = hidePage;
	window.cs.hidePage.speed = 400;

	window.cs.showPage = showPage;
	window.cs.showPage.speed = 400;

}(jQuery));