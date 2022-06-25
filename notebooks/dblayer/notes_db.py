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
        'SELECT id, body FROM notes WHERE notebook_id = "%s" ORDER BY created DESC' % nbid,
    ).fetchall()
    return rows

def delete_note(nid):
    database = db.get_db()
    database.execute(
        'DELETE FROM notes WHERE id = "%s"' % nid, 
    )
    database.commit()

def get_some_notes(nbid, limit, offset):
    database = db.get_db()
    rows = database.execute(
        'SELECT id, body FROM notes WHERE notebook_id = "{}" ORDER BY created DESC LIMIT {} OFFSET {}'.format(nbid, limit, offset)
    ).fetchall()
    count = database.execute(
        'SELECT COUNT(id) FROM notes WHERE notebook_id = "{}"'.format(nbid)
    ).fetchall()

    return rows, count[0]["COUNT(id)"]