//init combobox
/*
$(document).ready(function(){;
    $('#noteFile').fileinput();
    $('#noteFile').fileinput(
      {
        showUpload:true,
      previewFileType:'any',
      dropZoneEnabled: true});

      $('#noteFile').on('filepreupload', function() {
        alert("before upload");
      });

  });

  */
  var flag = 1;

  $(document).on('ready', function() {
      $("#noteFile").fileinput({
          uploadUrl: 'uploadNote.php',
          dropZoneEnabled: false,
          dropZoneTitle: 'Drag files here...',
          uploadExtraData: function()
          {

            var stuff = {

                "title" : '',
                "description" : '',
                "author" : '',
                "course" : ''
              };

            var noteTitle = $('#noteTitle').val();
            stuff['title'] = noteTitle;

            var description = $('#descriptionInput').val();
            stuff['description'] = description;

            var author = document.getElementById("authorName4upload").inner;
            //var author = $('#authorName4upload').val();
            stuff['author'] = author;

            var course = document.getElementById("courseName4upload").innerHTML;
            //var course = $('#courseName4upload').val();
            stuff['course'] = course;

            /*
            var labels = $("#allTags").find(".tagit-label");
            for( var i = 0; i < labels.length; i++)
            {
              var tempName = "tagName" + i.toString();
              //selectedTags.push(labels[i].innerHTML);
              stuff[tempName] = labels[i].innerHTML;
            }
            */
            //stuff = JSON.stringify(stuff);
              return stuff;
          }
      });


      $('#noteFile').on('fileuploaded', function(event, data, previewId, index) {
        //alert("upload Succesful");
        $('#noteTitle').val("");
        $('#descriptionInput').val("");
        $('#noteModal').modal('hide');

    
});


  });



//set up text area to show num characters remaining
$(document).ready(function() {

    var text_max = 250;
    $('#textarea_feedback').html(text_max + ' characters remaining');

    $('#descriptionInput').keyup(function() {
        var text_length = $('#descriptionInput').val().length;
        var text_remaining = text_max - text_length;

        $('#textarea_feedback').html(text_remaining + ' characters remaining');
    });
});
