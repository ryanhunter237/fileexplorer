import json
from pathlib import Path

class AppConfig:
    def __init__(
        self,
        rootdir: str|Path,
        db_path: str|Path,
        resources_dir: str|Path,
        supported_extensions: list[str],
        **kwargs
    ):
        self.rootdir = Path(rootdir)
        self.db_path = Path(db_path)
        self.resources_dir = Path(resources_dir)
        self.supported_extensions = supported_extensions

def load_config(config_path: str|Path) -> AppConfig:
    with open(config_path, 'r') as file:
        config_data = json.load(file)
    return AppConfig(**config_data)

config = load_config('c:/users/ryanh/documents/fileexplorer/instance/config.json')