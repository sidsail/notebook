from crypt import methods
import os
from urllib import request
from flask import Flask, render_template, request
from . import notebooks


def routes(app):
    @app.route('/notebooks', methods=['POST'])
    def handle_create_notebook():
        return notebooks.create_notebook()
    
    @app.route('/notebooks/<nbid>/notes', methods = ['POST'])
    def handle_create_note(nbid):
        body = request.json
        return notebooks.create_note(nbid, body)
    

    
    @app.route('/notebooks/<nbid>/notes', methods = ['GET'])
    def handle_get_notes(nbid):
        return notebooks.get_notes(nbid)

    @app.route('/notebooks/<nbid>/notes/<nid>', methods = ['DELETE'])
    def handle_delete_note(nid, nbid):
        notebooks.delete_note(nid)
        return 'done'
    
    @app.route('/display/<nbid>')
    def handle_display_notebook(nbid):
        return render_template('notebook.html')

    @app.route('/')
    def handle_home():
        return render_template('index.html')

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'notebooks.sqlite'),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    routes(app)

    from . import db
    db.init_app(app)

    return app

