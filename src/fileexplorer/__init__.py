from flask import Flask

from fileexplorer.explorer import bp

def create_app():
    app = Flask(__name__)
    app.register_blueprint(bp)    
    app.jinja_env.filters['endswith'] = ends_with_filter
    return app

def ends_with_filter(s: str, suffix: str):
    return s.endswith(suffix)