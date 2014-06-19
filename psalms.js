

(function($) {
	var _transitioning = false,
		$window = $(window);

	function hidePage(page, callback) {
		if (_transitioning === true) {
			//setTimeout(function() {
			//	hidePage(page, callback)
			//}, 4);

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
			//setTimeout(function() {
			//	showPage(page, callback)
			//}, 4);
			
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

	function trim(str) {
		if (str && str.trim) {
			return str.trim();
		} else {
			return str.replace(/^\s+|\s+$/gm,'');
		}
	}

	var ViewModel = function() {
		var vm = this,
			$window = $(window);

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

		this.lastWindowWidth = ko.observable($(window).width());

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

		this.determineOptimalWidth_Old = function(text) {
			var tryCounter = 0;

			// Ensure We have info and Resizer in Page
			var currentPage = $("#psalm-contents");
			//var psalmContents = currentPage.html("")

			var desiredWidth = currentPage.width() - 25;
			var resizer = currentPage.find(".resizer");
			
			if (resizer.length === 0) {
				currentPage.append('<span class="resizer" style="visibility: hidden"></span>');
				resizer = currentPage.find(".resizer");
			}

			// Setup Resizer for Calculation
			resizer.html('');
			resizer.css('font-size', '5');
			resizer.html(text);

			var size = 5;
			var tooSmall = (resizer.width() > desiredWidth) === false;

			if (tooSmall) {
				// Too small, enlarge
				while(resizer.width() < desiredWidth) {
					size = parseInt(resizer.css("font-size"), 10);
					size += 1;
					resizer.css("font-size", size);

					if(size > 200) {
						if(console && console.error) {
							console.error("cannot determine correct size of font required");
						}
						break;
					}

					tryCounter += 1;

					if (tryCounter > 1000) {
						break;
					}
				}
			} else {
				// Too big, shrink
				while(resizer.width() > desiredWidth) {
					size = parseInt(resizer.css("font-size"), 10);
					size -= 1;
					resizer.css("font-size", size);

					if(size > 200) {
						if(console && console.error) {
							console.error("cannot determine correct size of font required");
						}
						break;
					}

					tryCounter += 1;

					if (tryCounter > 1000) {
						break;
					}
				}
			}

			size -= 2;

			resizer.html('');

			return size;
		};
	};

	window.cs.log = function(options) {
		var opts = _.extend({
			message: ''
		}, options);

		var log = localStorage.getItem("_log");

		if (log === null || log === undefined) {
			log = [];
		}

		log.push({
			message: message,

			// Window Dimentions
			windowDimentions: {
				width: $window.width,
				height: $window.height
			}
		});

		localStorage.setItem("_log", log);
	};


	// Export
	//

	window.cs.ViewModel = ViewModel;

	window.cs.hidePage = hidePage;
	window.cs.hidePage.speed = 400;

	window.cs.showPage = showPage;
	window.cs.showPage.speed = 400;


	// DEBUG
	//

	if (window.DEBUG === true) {
		// Augment functions with logging code
	}

}(jQuery));