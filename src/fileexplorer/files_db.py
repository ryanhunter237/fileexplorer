from pathlib import Path
import sqlite3

from fileexplorer.config import config

config.db_path.parent.mkdir(parents=True, exist_ok=True)

def get_db_connection() -> sqlite3.Connection:
    """Get connection to the file explorer sqlite database"""
    conn = sqlite3.connect(config.db_path)
    conn.row_factory = sqlite3.Row
    return conn

def create_tables(drop_existing: bool=False):
    """Create the tables for the file explorer database if they don't already exist"""
    conn = get_db_connection()
    if drop_existing:
        conn.execute('DROP TABLE IF EXISTS thumbnails')
    conn.execute('CREATE TABLE IF NOT EXISTS thumbnails (file_path STR, thumbnail_file STR)')
    conn.close()

def normalize_path(path: str|Path) -> str:
    """Normalize a path for insertion into or querying the database"""
    return Path(path).resolve().as_posix()

def insert_thumbnail(file_path: str|Path, thumbnail_filename: str):
    """Insert a thumbnail filename for the given file_path and commit to the database"""
    conn = get_db_connection()
    conn.execute(
        'INSERT INTO thumbnails (file_path, thumbnail_file) VALUES (?,?)',
        (normalize_path(file_path), thumbnail_filename)
    )
    conn.commit()
    conn.close()

def get_thumbnail_filename(file_path: str|Path) -> str|None:
    conn = get_db_connection()
    row = conn.execute(
        'SELECT thumbnail_file FROM thumbnails WHERE file_path = ?',
        (normalize_path(file_path),)
    ).fetchone()
    return row['thumbnail_file'] if row else None