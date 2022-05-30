var notebook = {
    parseNbid: function() {
        let url = window.location.href;
        let x = url.lastIndexOf('/');
        nbid = url.substring(x+1, url.length);
        return nbid;
    },

    createNoteElement: function(note) {
        var noteDiv = $("<div>", {
            class: 'note',
            id: note.id,
        });
        
        var noteTextDiv = $("<div>", {
            class: 'note-text',
        });
        noteTextDiv.append('<p>' + note.text + "</p>");

        var deleteButton = $("<button>", {
            class: "delete-button"
        });
        deleteButton.html('Delete Note');

        noteTextDiv.appendTo(noteDiv);
        deleteButton.appendTo(noteDiv);
        console.log(noteDiv);
        return noteDiv;
    },

    displayNotes: function(resp) {
        for (const note of resp.notes) {
            var noteElement = notebook.createNoteElement(note);
            //$("#notes")[0].append(noteElement);
            $("<hr>").appendTo($("#notes")[0]);
            noteElement.appendTo($("#notes")[0]);
        }
    },
    
    createNotebook: function(resp) {
        window.location.href = '/display/' + resp.notebookId
        console.log(resp);
    },
    
    displayNotebook: function() {
        nbid = notebook.parseNbid();
        $.ajax({
            url: "/notebooks/" + nbid + "/notes",
            method: "GET"
          }).done(notebook.displayNotes);
    },

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