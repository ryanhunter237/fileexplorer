import os

from flask import Flask

from .explorer import bp

def create_app():
    app = Flask(__name__)
    app.config.from_mapping(
        ROOTDIR='c:/users/ryanh/Documents/cad/data',
    )
    app.register_blueprint(bp)    
    app.jinja_env.filters['endswith'] = ends_with_filter
    if not os.path.exists(app.instance_path):
        os.makedirs(app.instance_path)
    return app

def ends_with_filter(s: str, suffix: str):
    return s.endswith(suffix)