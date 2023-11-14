# fileexplorer

A multimedia file explorer with thumbnails and file viewers for images, pdfs, and 3D mesh STL files.

## Installation

In order to build this project, you will need both python and node.js.

After cloning the repository, install the fileexplorer python package in a virtual environment.

```console
>> cd fileexplorer
>> python -m venv .venv\fileexplorer_env
>> .venv\fileexplorer_env\Scripts\activate
>> python -m pip install .
```

Then install the npm dependencies in the static directory.

```console
>> cd src\fileexplorer\static
>> npm install
```

## Running

Create a json file for your application with the following configs:

```json
{
    "rootdir": "/path/to/rootdir",
    "db_path": "/path/to/files.db",
    "resources_dir": "/path/to/resources"
}
```
* `rootdir`: the root directory that fileexplorer will display
* `db_path`: a sqlite file to be created fileexplorer
* `resources_dir`: a directory where files created by fileexplorer are stored

Set the environment variable `FILEEXPLORER_CONFIG` to be the path to this config file.  Alternatively, create a `.env` file in the root directory of the fileexplorer project with the line `FILEEXPLORER_CONFIG=/pth/to/config.json`.

As long as the fileexplorer_env virtual environment is activated you can launch the server from any directory by running

```console
python -m flask run
```