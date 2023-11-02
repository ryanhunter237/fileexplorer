import json
import os
from pathlib import Path

class AppConfig:
    def __init__(
        self,
        rootdir: str|Path,
        db_path: str|Path,
        resources_dir: str|Path,
        **kwargs
    ):
        self.rootdir = Path(rootdir)
        self.db_path = Path(db_path)
        self.resources_dir = Path(resources_dir)
        self.supported_extensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.pdf']
    
    @classmethod
    def from_json(cls, json_path: str|Path):
        with open(json_path, 'r') as file:
            config_data = json.load(file)
        return cls(**config_data)    

config = AppConfig.from_json(os.environ['FILEEXPLORER_CONFIG'])