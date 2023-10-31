# fileexplorer

A web application to explore files on your local filesystem. My goal is to create a custom multimedia file explorer.  My first step is to add thumbnails and pop-ups for image files.  Then I plan on incorporating the same for some 3D data formats.

## Installation

In the root directory with the `pyproject.toml` file, run `python -m pip install .`

## Running

Once fileexplorer is installed, there are two python processes that can be launched from anywhere
1. `python -m fileexplorer.build_db` to create the file visualizations and build the corresponding sqlite database.
2. `python -m flask --app fileexplorer run` to launch the Flask server.

These processes can either be run sequentially, or they can be run simultaneously and the app will only display visualizations for files that have been processed so far.