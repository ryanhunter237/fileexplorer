# fileexplorer

A web application to explore files on your local filesystem. My goal is to create a custom multimedia file explorer.  My first step is to add thumbnails and pop-ups for image files.  Then I plan on incorporating the same for some 3D data formats.

## Installation

In the root directory with the `pyproject.toml` file, run `python -m pip install .`

## Running

Create a json file for your application with the following configs:

```json
{
    "rootdir": "/path/to/rootdir",
    "db_path": "/path/to/files.db",
    "resources_dir": "/path/to/resources"
}
```
* `rootdir` is the root directory that fileexplorer will display
* `db_path` is the fileexplorer sqlite database file
* `resources_dir` is a directory where files created by fileexplorer are stored

Set the environment variable `FILEEXPLORER_CONFIG` to be the path to this config file.  Alternatively, create a `.env` file in the root directory of the fileexplorer project with the line `FILEEXPLORER_CONFIG=/pth/to/config.json`.

Finally, run `python -m flask run` to launch the Flask server.