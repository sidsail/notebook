from .. import db

def create_note(uuid, nbid, text):
    database = db.get_db()
    database.execute(
        'INSERT INTO notes (id, notebook_id, body) VALUES (?, ?, ?)', (uuid, nbid, text)
    )

    database.commit()

def get_notes(nbid):
    database = db.get_db()
    rows = database.execute(
        'select id, body from notes where notebook_id = "%s" order by created desc' % nbid,
    ).fetchall()

    return rows

def delete_note(nid):
    database = db.get_db()
    database.execute(
        'delete from notes where id = "%s"' % nid, 
    )
    database.commit()