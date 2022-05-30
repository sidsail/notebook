var notebook = {

    //gets notebook id from url
    parseNbid: function() {
        let url = window.location.href;
        let x = url.lastIndexOf('/');
        nbid = url.substring(x+1, url.length);
        return nbid;
    },

    createNoteElementFromResponse: function(note) {
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

    //displays the note element on the page
    displayNotes: function(resp) {
        for (const note of resp.notes) {
            var noteElement = notebook.createNoteElement(note);
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
            console.log("Button pressed:");
            $("#message")[0].innerHTML = "Button clicked"
            $.ajax({
                url: "/notebooks",
                method: "POST"
              }).done(notebook.createNotebook);
        }
    }
};

window.notebook = notebook;