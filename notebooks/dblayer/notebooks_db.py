from .. import db

def create_notebook(uuid, name):
    database = db.get_db()
    database.execute(
        'INSERT INTO notebooks (id, name) VALUES (?, ?)', (uuid, name)
    )

    database.commit()

 
def check_exists(nbid):
    database = db.get_db()
    rows = database.execute(
        'select * from notebooks where id = "%s"' % nbid,
    ).fetchall()

    #print(rows)
    return len(rows) != 0

