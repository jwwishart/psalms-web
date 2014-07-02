
define(['jquery', 'lodash', 'knockout', 'cornerstone', "psalms"], function($, _, ko, cs, psalms) {

    // Check if a new cache is available on page load.
    cs.events.attach(window, "load", function(e) {
        cs.events.attach(window.applicationCache, "updateready",function(e) {
            if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
                // Browser downloaded a new app cache.
                if (confirm('A new version of this site is available. Load it?')) {
                    window.location.reload();
                }
            } else {
                // Manifest didn't changed. Nothing new to server.
            }
        });
    });


    // Knockout Binding!
    var myViewModel = new psalms.ViewModel();
    ko.applyBindings(myViewModel);


    // Show the first page
    psalms.showPage("psalm-select-page");

    cs.events.attach(window, "resize", function () { myViewModel.resizedOccured(); });
});