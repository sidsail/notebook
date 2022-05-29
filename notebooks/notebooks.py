from email.quoprimime import body_check
from os import abort
from typing import Text
import uuid
import notebooks.dblayer.notebooks_db as notebooks
import notebooks.dblayer.notes_db as notes
from flask import jsonify
from flask import abort

def create_notebook():
    notebook_uuid = str(uuid.uuid4())
    name = 'No Name'
    notebooks.create_notebook(notebook_uuid, name)
    return jsonify({"notebookId": notebook_uuid})

def create_note(nbid, body):
    if notebooks.check_exists(nbid):
        if "text" not in body:
            abort(400)

        text = body["text"]
        note_uuid = str(uuid.uuid4())
        notes.create_note(note_uuid, nbid, text)
        return jsonify({"notebookId": nbid, "noteId": note_uuid})
    
    else:
        abort(404)

def get_notes(nbid):
    rows = notes.get_notes(nbid)
    notes_list = []
    for row in rows:
        notes_list.append({"id": row[0], "text": row[1]})
    
    return jsonify({"notes": notes_list})


        
    


def delete_note(nid):
    notes.delete_note(nid)

