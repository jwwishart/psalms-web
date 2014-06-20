

(function($) {
	var win = window,
		doc = win.document;

	win.cs = window.cs || {};
	win.cs.text = window.cs.text || {};
	win.cs.psalm = window.cs.psalm || {};


	// Navigation -------------------------------------------------------------
	// 

	var _transitioning = false;

	function hidePage(page, callback) {
		if (_transitioning === true) {
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
			return;
		}

		_transitioning = true;

		// Hide pages that are showing
		$(".page:visible").hide();

		win.scrollTo(0, 0);

		// Show the page
		_selectElement(page).fadeIn(cs.showPage.speed, function() {
			_transitioning = false;
			
			if (callback) callback();
		});
	}

	function _selectElement(idElementOrjQuery) {
		var hash = '#';

		// String
		if (cs.isString(idElementOrjQuery)) {
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

	function trim(str) {
		return str.replace(/^\s+|\s+$/gm,'');
	}

	// KUDOS: http://stackoverflow.com/a/7124052
	function htmlEncode(input) {
		return String(str).replace(/&/g, '&amp;')
						  .replace(/"/g, '&quot;')
						  .replace(/'/g, '&#39;')
						  .replace(/</g, '&lt;')
						  .replace(/>/g, '&gt;');
	}

	var ViewModel = function() {
		var vm = this;

		// psalmNumbers: for Psalm Selection
		this.psalmNumbers = ko.observableArray(_.map(_.range(1,151), function(i) {
			var partsCount = cs.psalm.psalmVersions(i);

			return {
				number: i,
				partCount: partsCount
			};
		}));


		// Current Psalm Information
		//

		this.psalmNumber = ko.observable(1);
		this.psalmVersion = ko.observable(1);
		this.psalmText = ko.observable('');

		this.textSize = ko.observable(5); // calculated optimal text size

		this.fontSize = ko.computed(function() {
			// Calculation of actual font-size to apply to the text...
			return vm.textSize() + 'px';
		});


		// Hide/Show Psalm Text - so you can't see transition
		this.showText = ko.observable(false);
		

		// Current Psalm Version Buttons
		// 

		this.showDuelVersionButtons = ko.observable(false);
		this.showPsalm119Button = ko.observable(false);

		this.lastWindowWidth = ko.observable(window.innerWidth);

		this.selectPsalm = function() {
			var number = this.number;

			if (number === 119) {
				cs.showPage("psalm119-part-selector");
				return;
			}

			vm.psalmNumber(number);
			vm.psalmVersion(1);

			vm.showText(false);

			vm.showPsalm119Button(false);
			vm.showDuelVersionButtons(false);

			cs.showPage("psalm-content-page", function() {
				vm.bindPsalmData();

				vm.showText(true);
			});
		};
		
		this.selectPsalm119Part = function(vm, event) {
			var li = $(event.target);

			if (li.is("li") === false) {
				li = li.closest("li");
			}

			var version = parseInt(li.attr('data-part-no'), 10);

			vm.psalmNumber(119);
			vm.psalmVersion(version);

			vm.showText(false);
			vm.showPsalm119Button(false);
			vm.showDuelVersionButtons(false);

			cs.showPage("psalm-content-page", function() {
				vm.bindPsalmData();

				vm.showText(true);
			});

			return false;
		};

		this.viewPsalm119Selector = function() {
			vm.showText(false);

			cs.showPage("psalm119-part-selector");
		};

		this.backToSelectPsalm = function() {
			vm.showText(false);

			cs.showPage("psalm-select-page");
		};

		this.isBinding = ko.observable(false);

		this.bindPsalmData = function() {
			console.log("bindPsalmData");

			vm.psalmText("");

			this.isBinding(true);

			// Get Specific Version
			var text =  cs.psalm.getPsalmText(
				vm.psalmNumber(),
				vm.psalmVersion(),
				true /* format */
			);

			var versions = cs.psalm.psalmVersions(vm.psalmNumber());
			var size = this.determineOptimalWidth($("#psalm-contents"), text);

			// Version Buttons
			if (versions === 2) {
				vm.showDuelVersionButtons(true);
			} else if (versions === 22) {
				vm.showPsalm119Button(true);
			}

			// Bind Text and font size
			vm.textSize(size);
			vm.psalmText(text);

			this.isBinding(false);
		};

		this.currentSelectedVersion = ko.computed(function() {
			// Will just ignore that we might not be on a psalm
			// with multiple versions or on psalm 119 as 
			// that stuff won't be visible anyway!
			return 'choice-' + this.psalmVersion();
		}, this);

		this.determineOptimalWidth = function(outputContainer, text) {
			// Clear the contents as it is
			outputContainer.html('');

			// Insert a resizer text span with smallest size and add the text
			outputContainer.append('<span class="resizer" style="visibility: hidden"></span>');
			var resizer = outputContainer.find(".resizer");

			resizer.css("font-size", "5px");
			resizer.html(text);

			var size = 5;
			var maximumSize = outputContainer.width(); // no contents so it should be 100% no more!

			// Enlarge till the span is too wide for maximumSize
			while(resizer.width() < maximumSize) {
				size = parseInt(resizer.css("font-size"), 10);
				size += 1;
				resizer.css("font-size", size.toString() + "px");

				if (size > 500) {
					alert("500px... really??");
					break;
				}
			}

			// Back off a few font-size'es
			size -= 2;

			resizer.remove(); // remove it... we are done!

			return size;
		};

		this.selectVersion1 = function() {
			vm.psalmVersion(1);
			vm.bindPsalmData();

			return false;
		};

		this.selectVersion2 = function() {
			vm.psalmVersion(2);
			vm.bindPsalmData();

			return false;
		};

		this.resizedOccured = function() {
			console.log("resizeOccured");

			if (this.isBinding() === false && this.showText() === true) {
				_.debounce(function() {
					vm.bindPsalmData();
				}, 200)();
			}
		};

		this.checkForEnterPressed = function(vm, e) {
			if (e.which === 13) {
				this.search();
			}
		};


		// SEARCH
		//

		this.searchTerm = ko.observable('');
		this.searchResults = ko.observable([]);

		this.search = function() {
			var term = trim(this.searchTerm()),
				results;

			if (term && term.length > 0) {
				this.searchResults(cs.psalm.search(term));
				cs.showPage("psalm-search-results");
			}
		};

		this.selectSearchResult = function(data) {
			var number = this.number;
				part = this.version;

			vm.psalmNumber(number);
			vm.psalmVersion(part);

			vm.showText(false);

			vm.showPsalm119Button(false);
			vm.showDuelVersionButtons(false);

			cs.showPage("psalm-content-page", function() {
				vm.bindPsalmData();

				vm.showText(true);
			});
		};

		this.showPartNumber= function(data) {
			return cs.psalm.psalmVersions(data.number) > 1;
		};
	};

	// KUDOS: http://www.quirksmode.org/js/eventSimple.html
	function addEventSimple(obj,evt,fn) {
		if (obj.addEventListener) {
			obj.addEventListener(evt,fn,false);
		} else if (obj.attachEvent) {
			obj.attachEvent('on'+evt,fn);
		}
	}

	function removeEventSimple(obj,evt,fn) {
		if (obj.removeEventListener) {
			obj.removeEventListener(evt,fn,false);
		} else if (obj.detachEvent) {
			obj.detachEvent('on'+evt,fn);
		}
	}

	function isString(str) {
		return typeof str == 'string' || str instanceof String;
	}


	// Exports ----------------------------------------------------------------
	//

	window.cs.ViewModel = ViewModel;

	window.cs.hidePage = hidePage;
	window.cs.hidePage.speed = 400;

	window.cs.showPage = showPage;
	window.cs.showPage.speed = 400;

	window.cs.on = addEventSimple;
	window.cs.off = removeEventSimple;

	window.cs.isString = isString;

	window.cs = window.cs || {};
	window.cs.psalm = window.cs.psalm || {};

	window.cs.text.trim = trim;
	window.cs.text.htmlEncode = htmlEncode;


	// DEBUG
	//

	if (window.DEBUG === true) {
		// Augment functions with logging code
	}

}(jQuery));