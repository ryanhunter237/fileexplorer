from pathlib import Path

from flask import (
    Blueprint,
    redirect, 
    render_template,
    request,
    send_file,
    send_from_directory,
    url_for
)

from fileexplorer.config import config
from fileexplorer.files_db import get_thumbnail_filename, normalize_path

bp = Blueprint('explorer', __name__)

def get_file_data(current_directory: str|Path):
    current_directory = Path(current_directory)
    data = []
    for file in current_directory.glob('*'):
        file_type = get_file_type(file)
        file_size = convert_size(file.stat().st_size) if file.is_file() else ""
        thumbnail_filename = get_thumbnail_filename(file)
        data.append((file.name, file_type, file_size, thumbnail_filename))
    return data

def get_file_type(path: Path) -> str:
    if path.is_dir():
        return 'directory'
    extension = path.suffix.lower()
    if extension in ['.png', '.jpg', '.jpeg', '.gif', '.bmp']:
        return 'image'
    if extension == '.pdf':
        return 'pdf'
    if extension == '.stl':
        return 'stl'
    return 'file'

def convert_size(size: int):
    size = float(size)
    suffixes = ['B', 'KB', 'MB', 'GB']
    suffix_idx = 0
    while size >= 1024 and suffix_idx < 3:
        size /= 1024
        suffix_idx += 1
    return f"{round(size)} {suffixes[suffix_idx]}"

def get_directory_structure(path: str|Path):
    path = Path(path).resolve()
    relpath = path.relative_to(config.rootdir)
    structure = [("", normalize_path(config.rootdir))]  # Initialize with the root directory
    current_path = config.rootdir
    for part in relpath.parts:
        current_path = current_path / part
        structure.append((part, normalize_path(current_path)))
    return structure

@bp.route('/')
def index():
    rootdir = normalize_path(config.rootdir)
    current_directory = request.args.get('path', rootdir)
    data = get_file_data(current_directory)
    structure = get_directory_structure(current_directory)
    return render_template(
        'index.html',
        current_directory=current_directory,
        data=data,
        structure=structure
    )

@bp.route('/change_directory')
def change_directory():
    # essentially the same as index, except we construct the path first
    current_directory = request.args.get('current_directory')
    new_path = request.args.get('new_path')
    path = normalize_path(Path(current_directory) / new_path)
    return redirect(url_for('explorer.index', path=path))

@bp.route('/thumbnail')
def serve_thumbnail():
    filename = request.args.get('filename')
    return send_from_directory(config.resources_dir, filename)

@bp.route('/file/<path:file_path>')
def serve_file(file_path):
    return send_file(file_path)