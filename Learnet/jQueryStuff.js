//jQuert Script
  $( document ).ready(function()
  {
  $('#password').password().on('show.bs.password', function(e)
    {
    $('#methods').prop('checked', true);
    }
    ).on('hide.bs.password', function(e)
      {
        $('#methods').prop('checked', false);
      });
    $('#methods').click(function() {
      $('#password').password('toggle');
    });



    var chosenCourse;
    //attempting to add a button for adding courses
    $( "#courseInput" ).autocomplete({
  select: function( event, ui ) {
    chosenCourse = ui.item.value;
    $( "#courseInput" ).val(chosenCourse);
  }

});


});


var availableTags = [];

function enablebtn()
{
  document.getElementById("registerButt").disabled = false;
}

$( document).ready(function() {

    //disable/enable registerButt based on Captcha
    document.getElementById("registerButt").disabled = true;

      var list = $("#courselist").find(":button");

      for(var i = 0; i < list.length; i++)
      {

      }


      //alert($(".showCourseSection").find("#remCourseButt").length);

  $(document).on('mouseenter', '.showCourseSection', function () {
  $(this).find(":button").show();
}).on('mouseleave', '.showCourseSection', function () {
  $(this).find(":button").hide();
});


  $.get("results.json", function(data, status){
    for(var i = 0; i < data.records.length; i++)
    {
      availableTags.push( data.records[i].courseString);
    }

    //filter out duplicates
    availableTags = jQuery.unique(availableTags);

    });

$( "#courseInput" ).autocomplete({
source: availableTags
});

$("#courseInput").attr('autocomplete', 'off');
});
