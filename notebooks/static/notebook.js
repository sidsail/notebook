var notebook = {

    //gets notebook id from url
    parseNbid: function() {
        let url = window.location.href;
        let x = url.lastIndexOf('/');
        nbid = url.substring(x+1, url.length);
        return nbid;
    },

    createNoteElementFromResponse: function(note) {
        console.log(note)
        return notebook.createNoteElement(note.id, note.text);
    },

    //creates a note element
    createNoteElement: function(noteId, text) {
        var noteDiv = $("<div>", {
            class: 'note',
            id: noteId,
        });
        
        var noteTextDiv = $("<div>", {
            class: 'note-text',
        });
        noteTextDiv.append('<p>' + text + "</p>");

        var deleteButton = $("<button>", {
            class: "delete-button"
        });
        deleteButton.html('Delete Note');

        noteTextDiv.appendTo(noteDiv);
        deleteButton.appendTo(noteDiv);
        console.log(noteDiv);
        return noteDiv;
    },


    addNoteToDatabase: function(text) {
        $.ajax({
            method: "POST",
            url: "/notebooks/" + nbid + "/notes",
            data: JSON.stringify({
                "text": text
            }),
            contentType: "application/json"
            
          }).done(function(resp){
            console.log(resp.noteId)
            var noteId = resp.noteId;
            var noteDiv = notebook.createNoteElement(noteId, text);  
            noteDiv.prependTo($("#notes")[0]);
            $("<hr>").prependTo($("#notes")[0]);
            $("#note_input")[0].value = "";
          });
    },

    handleAddNoteClick: function() {
        $("#new_note")[0].onclick = function(e) {
            console.log("New Note Button Pressed");
            const text = $("#note_input")[0].value;
            if (text.length > 0) {
                console.log(text);
                notebook.addNoteToDatabase(text);
                console.log("done")
            }


        }
    },

    //displays the note element on the page
    displayNotes: function(resp) {
        for (const note of resp.notes) {
            var noteElement = notebook.createNoteElementFromResponse(note);
            //$("#notes")[0].append(noteElement);
            $("<hr>").appendTo($("#notes")[0]);
            noteElement.appendTo($("#notes")[0]);
        }
    },
    
    //creates a new notebook
    createNotebook: function(resp) {
        window.location.href = '/display/' + resp.notebookId
        console.log(resp);
    },
    
    //displays your entire notebook
    displayNotebook: function() {
        nbid = notebook.parseNbid();
        $.ajax({
            url: "/notebooks/" + nbid + "/notes",
            method: "GET"
          }).done(notebook.displayNotes);
    },

    //checks if new notebook button is clicked
    ready: function() {
        $("#new_notebook")[0].onclick = function(e) {
            console.log("New Notebook Pressed");
            $("#message")[0].innerHTML = "New Notebook Clicked";
            $.ajax({
                url: "/notebooks",
                method: "POST"
              }).done(notebook.createNotebook);
        }
    }
};

window.notebook = notebook;