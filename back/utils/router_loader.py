import pkgutil
import importlib
import logging
from fastapi import FastAPI
from pathlib import Path

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)  # Ensure logging is set to INFO

def load_routers(app: FastAPI, package_name: str):
    """
    Load all routers from the given package and add them to the FastAPI app.
    """
    # Determine the absolute path to the package
    package_path = Path(__file__).parent.parent / package_name
    logger.info(f"Determined package path: {package_path}")

    if not package_path.is_dir():
        logger.warning(f"Package path {package_path} does not exist.")
        return

    # Import the package
    try:
        package = importlib.import_module(package_name)
        logger.info(f"Successfully imported package: {package_name}")
    except ModuleNotFoundError as e:
        logger.error(f"Failed to import package {package_name}: {e}")
        return

    # Walk through the package directories and import modules
    for _, mod_name, is_pkg in pkgutil.walk_packages(package.__path__, package.__name__ + "."):
        if not is_pkg:  # Skip directories
            try:
                mod = importlib.import_module(mod_name)
                logger.info(f"Loaded module: {mod_name}")
                if hasattr(mod, 'router'):
                    logger.info(f"Adding router from module: {mod_name}")
                    app.include_router(mod.router)
                else:
                    logger.debug(f"No router found in module: {mod_name}")
            except Exception as e:
                logger.error(f"Failed to import module {mod_name}: {e}")
        else:
            logger.debug(f"Skipping package: {mod_name}")
