
$(document).ready(function(){
    // Get number of pages and create buttons
    $.get("https://www.cs.kent.ac.uk/people/staff/yh/co539_a2_data/hygiene.php?", {op : "pages"}, function(data){
        data = $.parseJSON(data);

        // create page buttons
        for(var i = 1; i <= data.pages; i++)
        {
            $('#pages').append('<button>' + i + '</button>');
        }
    });

    // Populate table - takes pagenumber as parameter
    function popTable(pageNo){$.get("https://www.cs.kent.ac.uk/people/staff/yh/co539_a2_data/hygiene.php?", {op: "get", page: pageNo}, function(data){
        $('#mainTable>tbody').empty();
        $('#tags').val('');
        data = $.parseJSON(data);
        var tr;
        
        // append data
        $.each(data, function(i, item){
            tr = $('<tr/>');
            tr.append("<td>" + data[i].business + "</td>");
            tr.append("<td>" + data[i].address + "</td>");
            tr.append("<td>" + data[i].type + "</td>");
            tr.append("<td>" + data[i].rating + "</td>");
            tr.append("<td>" + data[i].date + "</td>");
            tr.append('<td><button>Get Ratings</button></td>');
            $('#mainTable>tbody').append(tr);
        })
    })};
    
    // Autocomplete search function
    var availableTags = [
        "KFC",
        "McDonalds",
        "Greggs",
        "Burger King"
    ];
    $('#tags').autocomplete({
        source: availableTags
    });
    
    // default table data
    popTable(1);

    /*User-Interactivity*/
    
    // Pageination
    $('#pages').on('click', "button", function(){
        pageNo = this;
        popTable($(this).text());
    });

    // Get Ratings
    $('#mainTable>tbody').on('click', 'td>button', function(){
        $('.ratings').css("visibility", "visible");
        
        /*Have to use substrings because php files have misaligned data, names and addresses are stored under different values
        substring number is arbitrary to make it work for the current data but to calculate correct substring lengths would require extra if statements*/
        // substring of name
        var name = $($(this).parent().parent()).find('td:first-child').text().substring(0, 5);
        // substring of location
        var loc = $($(this).parent().parent()).find('td:nth-child(2)').text().substring(6, 10);
        $.get("https://www.cs.kent.ac.uk/people/staff/yh/co539_a2_data/rating.php?", {businessName: name}, function(data){
            // resets data fields
            $('#ratingInfo').empty();
            
            for(var i = 0; i < data.length; i++){
                if(data[i].address.indexOf(loc) > -1){
                    $('#ratingInfo').append("<li>" + data[i].businessName + "</li><li>" + data[i].avgRating + "/5 Stars</li><li>" + data[i].totalRatings + " Ratings</li>");
                    return;
                }
            }

            // if there is no rating data
            $('#ratingInfo').append("<li>No rating data to show.</li>");
        });
    });

    // Close Ratings button
    $('.ratings').on('click', 'button', function(){
        $('.ratings').css("visibility", "hidden");
    });
    
    // Search
    $('#search').on('click', function(){
        var sText = $('#tags').val();
        $.get("https://www.cs.kent.ac.uk/people/staff/yh/co539_a2_data/hygiene.php?", {op: "search", business: sText}, function(data){
            //Resets table and popup
            $('#mainTable>tbody').empty();
            $('.ratings').css("visibility", "hidden");
            var tr;

            if(data == "Empty search string"){
                tr = $('<tr><td>No business under that name on file.</td><td></td><td></td><td></td><td></td><td></td></tr>');
                $('#mainTable>tbody').append(tr);
                return;
            }

            data = $.parseJSON(data);

            // append data
            $.each(data, function(i, item){
                tr = $('<tr/>');
                tr.append("<td>" + data[i].business + "</td>");
                tr.append("<td>" + data[i].address + "</td>");
                tr.append("<td>" + data[i].type + "</td>");
                tr.append("<td>" + data[i].rating + "</td>");
                tr.append("<td>" + data[i].date + "</td>");
                tr.append('<td><button>Get Ratings</button></td>');
                $('#mainTable>tbody').append(tr);

                // append availabletags for newly searched data
                if (!availableTags.includes(data[i].business)){
                    availableTags.push(data[i].business);
                }
            }) 
        })
    });
})