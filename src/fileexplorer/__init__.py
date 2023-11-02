import atexit
import multiprocessing

from flask import Flask

from fileexplorer.explorer import bp
from fileexplorer.build_db import build_db

def create_app():
    app = Flask(__name__)
    app.register_blueprint(bp)    
    app.jinja_env.filters['endswith'] = ends_with_filter
    # build database in a separate process
    rebuild = True
    worker = multiprocessing.Process(target=build_db, args=(rebuild,))
    worker.start()
    # this atexit is probably not necessary
    atexit.register(worker.terminate)
    return app

def ends_with_filter(s: str, suffix: str):
    return s.endswith(suffix)