$(document).ready(function() {
    var json;

    var searchText = "";
    $('.searchBar').on('keyup', function(event) {
        $('.results').empty();
        $('.results').removeClass('active');
        console.log('emptied results');

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
                    // console.log(loginResponse);
                }
            });

            var len = json.length;



            $('.results').addClass('active');
            for (var i = 0; i < len; i++) {
                if(json[i].word.indexOf(searchText) >= 0) {
                    $('.results').append('<li>' + json[i].word + '</li>');
                }
            }
        }
    });
});