import os
import sys

# Add the current directory to sys.path to allow absolute imports of local modules
sys.path.append(os.path.dirname(__file__))

# Import the FastAPI app from main.py
from .main import app
