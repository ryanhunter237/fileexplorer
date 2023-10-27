import hashlib
import os

from flask import (
    Blueprint, current_app, render_template, request, redirect, url_for, send_from_directory
)
from PIL import Image

THUMBNAIL_SIZE = (100, 100)

bp = Blueprint('explorer', __name__)

def get_file_data(current_directory):
    files = os.listdir(current_directory)
    data = []
    for file in files:
        file_path = os.path.join(current_directory, file)
        file_type = "Folder" if os.path.isdir(file_path) else "File"
        file_size = ""
        thumbnail_path = None
        if file_type == "File":
            file_size = convert_size(os.path.getsize(file_path))
            if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
                thumbnail_path = get_image_thumbnail(file_path)
        data.append((file, file_type, file_size, thumbnail_path))
    return data

def convert_size(size):
    size = float(size)
    suffixes = ['B', 'KB', 'MB', 'GB']
    suffix_idx = 0
    while size >= 1024 and suffix_idx < 3:
        size /= 1024
        suffix_idx += 1
    return f"{round(size)} {suffixes[suffix_idx]}"

def get_directory_structure(path: str):
    path = os.path.relpath(path, current_app.config['ROOTDIR'])
    if path == '.':
        parts = []
    else:
        parts = path.split(os.path.sep)
    structure = [("", current_app.config['ROOTDIR'])]  # Initialize with the root directory
    current_path = current_app.config['ROOTDIR']
    for part in parts:
        current_path = os.path.join(current_path, part)
        structure.append((part, current_path))
    return structure

def get_image_thumbnail(file_path):
    md5 = file_md5(file_path)
    thumbnail_filename = f'{md5}.png'
    thumbnail_path = os.path.join(current_app.instance_path, thumbnail_filename)
    if os.path.exists(thumbnail_path):
        return thumbnail_filename
    try:
        image = Image.open(file_path)
        image.thumbnail(THUMBNAIL_SIZE)  # Set the thumbnail size
        image.save(thumbnail_path)
        return thumbnail_filename
    except Exception:
        return None
    
def file_md5(file_path):
    with open(file_path, 'rb') as f:
        data = f.read()    
    return hashlib.md5(data).hexdigest()

@bp.route('/')
def index():
    rootdir = current_app.config['ROOTDIR']
    current_directory = request.args.get('path', rootdir)
    data = get_file_data(current_directory)
    structure = get_directory_structure(current_directory)
    for s in structure:
        print(s)
    return render_template(
        'index.html',
        current_directory=current_directory,
        data=data,
        structure=structure
    )

@bp.route('/change_directory')
def change_directory():
    new_path = request.args.get('new_path')
    current_directory = request.args.get('current_directory')
    path = os.path.join(current_directory, new_path)
    return redirect(url_for('explorer.index', path=path))

@bp.route('/thumbnail')
def thumbnail():
    filename = request.args.get('filename')
    return send_from_directory(current_app.instance_path, filename)
