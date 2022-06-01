var notebook = {
    
    currentPage: 1,
    limit: 10,
    lastPage: 0,
    buttonRemoved: false,
    
    escapeHtml: function(unsafe) {

        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },

    //gets notebook id from url
    parseNbid: function() {
        let url = window.location.href;
        let x = url.lastIndexOf('/');
        nbid = url.substring(x+1, url.length);
        return nbid;
    },

    createNoteElementFromResponse: function(note) {
        //console.log(note)
        return notebook.createNoteElement(note.id, note.text);
    },

    //creates a note element
    createNoteElement: function(noteId, text) {
        var noteDiv = $("<div>", {
            class: 'note',
            //"data-id": noteId,
        });
        
        var noteTextDiv = $("<div>", {
            class: 'note-text',
        });
        noteTextDiv.append('<p>' + notebook.escapeHtml(text) + "</p>");

        var deleteButton = $("<button>", {
            class: "delete-button",
            "data-id": noteId,
        });
        deleteButton.html('Delete Note');

        noteTextDiv.appendTo(noteDiv);
        deleteButton.appendTo(noteDiv);
        //console.log(noteDiv);
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
            //console.log(resp.noteId)
            var noteId = resp.noteId;
            var noteDiv = notebook.createNoteElement(noteId, text);  
            noteDiv.prependTo($("#notes")[0]);
            //$("<hr>").prependTo($("#notes")[0]);
            $("#note_input")[0].value = "";
          });
    },

   

    handleAddNoteButtonClick: function() {
        $("#new_note")[0].onclick = function(e) {
            const text = $("#note_input")[0].value;
            if (text.length > 0) {
                notebook.addNoteToDatabase(text);
                notebook.goToPage(notebook.currentPage)
                //notebook.lastPage = notebook.getPageCount()
                notebook.modifyLastPagebutton()
            }
        }
    },

    goToPage: function(pageNum) {
        var nbid = notebook.parseNbid();
        
        $.ajax({
            url: "/notebooks/" + nbid + "/notes?limit=" + notebook.limit + "&offset=" + ((pageNum-1) * notebook.limit),
            method: "GET",
        }).done(function(resp) {
            $(".note").remove();
            notebook.displayNotes(resp);
            notebook.currentPage = pageNum
        })
    },

    handleNextPageButtonClick: function() {    
        $("#next_page_button")[0].onclick = function(e) {
            console.log(notebook.currentPage, notebook.lastPage)
            if (notebook.currentPage != notebook.lastPage) {
                console.log(notebook.currentPage)
                notebook.goToPage(notebook.currentPage + 1)  
                notebook.modifyLastPagebutton()  
            }
        }},

    
    handlePreviousPageButtonClick: function() {
        $("#previous_page_button")[0].onclick = function(e) {
            notebook.modifyLastPagebutton()
            if (notebook.currentPage != 1) {
                notebook.goToPage(notebook.currentPage - 1)
                notebook.modifyLastPagebutton()
            }
        }},
    
    handleLastPageButtonClick: function() {
        $("#last_page_button")[0].onclick = function(e) {
            console.log(notebook.currentPage, notebook.lastPage)
            if (notebook.currentPage != notebook.lastPage) {
                console.log(notebook.lastPage)
                notebook.goToPage(notebook.lastPage)
                notebook.currentPage = notebook.lastPage
                console.log(notebook.currentPage)
            }

        }
    },

    handleFirstPageButtonClick: function() {
        $("#first_page_button")[0].onclick = function(e) {
            if (notebook.currentPage != 1) {
                notebook.goToPage(1)
            }
        } 
    },



    //displays the note element on the page
    displayNotes: function(resp) {
        for (const note of resp.notes) {
            var noteElement = notebook.createNoteElementFromResponse(note);
            //$("#notes")[0].append(noteElement);
            //$("<hr>").appendTo($("#notes")[0]);
            noteElement.appendTo($("#notes")[0]);
        }
    },
    
    
    //creates a new notebook
    createNotebook: function(resp) {
        window.location.href = '/display/' + resp.notebookId
        console.log(resp);
    },

    
    modifyLastPagebutton: function() {
        nbid = notebook.parseNbid()
        $.ajax({
            url: "/notebooks/" + nbid + "/notes?limit=1&offset=0",
            method: "GET",
        }).done(function(resp) {
            notebook.lastPage = Math.ceil(resp.count / notebook.limit)
            console.log(notebook.lastPage)
            if (notebook.lastPage === 0) {
                notebook.lastPage = 1
            }
            if (notebook.buttonRemoved === false) {
                $("#last_page_button")[0].innerHTML = notebook.lastPage;
                if (notebook.lastPage === 1) {
                    $("#last_page_button")[0].remove()
                    notebook.buttonRemoved = true;
    
                }
            } else {
                if (notebook.lastPage > 1) {
                    var lastPageButton = $("<button>", {
                        id: "last_page_button",
                        class: 'nav-button',
                    });
                    lastPageButton.html(notebook.lastPage)
                    $(lastPageButton).insertBefore("#next_page_button")
                    notebook.buttonRemoved = false;
                }
            }
        
        })       
    },

    //displays your entire notebook
    displayNotebookOnInitial: function() {
        nbid = notebook.parseNbid();
        $.ajax({
            url: "/notebooks/" + nbid + "/notes?" + "limit=" + notebook.limit + "&offset=0",
            method: "GET"
        }).done(function(resp) {
            console.log(resp.count)
            notebook.displayNotes(resp);
            notebook.lastPage = Math.ceil(resp.count / notebook.limit);
            notebook.modifyLastPagebutton()
        });
    },
    

    handleDeleteButtonClick: function() {
        $('#notes')[0].onclick = function(e) {
            var target = $(e.target);
            if (target.hasClass("delete-button")) {
                const nbid = notebook.parseNbid();
                const noteId = e.target.getAttribute("data-id");
                console.log(noteId);
                $.ajax({
                    url: "/notebooks/" + nbid + "/notes/" + noteId,
                    method: "DELETE"
                }).done(function(resp){
                    if (resp === "done"){
                    $(e.target).closest('.note').remove()
                    notebook.goToPage(notebook.currentPage)
                    //notebook.lastPage = notebook.getPageCount()
                    notebook.modifyLastPagebutton(notebook.lastPage)
                    }
                });
            }
        }
    },  
};

var index = {
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
}

window.notebook = notebook;