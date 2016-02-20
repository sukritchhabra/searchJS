$(document).ready(function() {
    var json;
    var debounceTimeout = 200;
    var searchText = "";
    var keyupCounter = 0;

    var selectedSearchResult = undefined;
    var selectedSearchString = "";


    $('.searchBar').on('keyup', $.debounce(function(event) {
        var keyPressed = event.keyCode;
        if (keyPressed != 37 && keyPressed != 38 && keyPressed != 39 && keyPressed != 40 && keyPressed != 13) {
            keyupCounter = keyupCounter + 1;
            if (keyupCounter%2 != 0) {
                debounceTimeout = 0;
            } else {
                debounceTimeout = 200;
            }
            // console.log('\n\n');
            // console.log(keyupCounter);
            // console.log(event);
            $('.results').empty();
            $('.results').removeClass('active');
            console.log('\n\nemptied results');

            searchText = $('.searchBar').val();
            console.log('Search text: ' + searchText);


            if (searchText != "") {
                $.ajax({
                    url: "http://rack36.cs.drexel.edu/suggest/?q=" + searchText,
                    type: "GET",
                    async: false,
                    success: function (response) {
                        // console.log(response);
                        json = JSON.parse(response);
                        console.log(json);
                    }
                });

                var len = json.length;

                $('.results').addClass('active');
                for (var i = 0; i < len-1; i++) {
                    var temp = json[i].title;
                    // console.log("\n\n"+temp);
                    temp = json[i].title.toLowerCase();
                    //console.log(temp);
                    // console.log(temp.indexOf(searchText));
                    if(temp.indexOf(searchText) >= 0 || json[i].title.indexOf(searchText) >= 0) {
                        $('.results').append('<li>' + json[i].title + '</li>');
                    }
                }
            }
        }
    }, debounceTimeout));

    $('.searchBar').on('keydown', function(event) {
        var keyPressed = event.keyCode;
        if (keyPressed == 37 || keyPressed == 38 || keyPressed == 39 || keyPressed == 40) {
            var numResults = $('.results li').length;
            var selectedIndex = $('.results li').index($('.selected'));

            if (keyPressed == 40) {                         // If down key is pressed
                if (selectedIndex < 0) {
                    console.log('\n\nundefined');
                    $('.results li').eq(0).addClass('selected');
                    selectedIndex = 0;
                    selectedSearchResult = $('.results .selected');
                } else {
                    console.log('\n\nprevious selection index: ' + selectedIndex);
                    $('.results li').eq(selectedIndex).removeClass('selected');
                    $('.results li').eq((selectedIndex + 1)%numResults).addClass('selected');
                    selectedIndex = (selectedIndex + 1)%numResults;
                    console.log('new selection index: ' + selectedIndex);
                    selectedSearchResult = $('.results .selected');
                }
            } else if (keyPressed == 38) {                  // If up key is pressed
                if (selectedIndex == -1) {
                    $('.results li').eq(numResults - 1).addClass('selected');
                    selectedIndex = numResults - 1;
                    selectedSearchResult = $('.results .selected');
                } else {
                    console.log('\n\nprevious selection index: ' + selectedIndex);
                    $('.results li').eq(selectedIndex).removeClass('selected');

                    if (selectedIndex < 1) {
                        $('.results li').eq( ( numResults - (Math.abs(selectedIndex-1) ) % numResults)).addClass('selected');
                        selectedIndex = numResults - (Math.abs(selectedIndex-1) % numResults);
                    } else {
                        $('.results li').eq( (selectedIndex - 1) ).addClass('selected');
                        selectedIndex = selectedIndex - 1;

                    }
                    console.log('new selection index: ' + selectedIndex);
                    selectedSearchResult = $('.results .selected');
                }
            }
        } else if (keyPressed == 13) {
            selectedSearchString = $('.results .selected').text();
            $('.searchBar').val(selectedSearchString);
            $('.results').empty();
        }
    });
});