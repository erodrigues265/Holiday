import os
import sys

# Get the absolute path to the backend directory
# This allows importing from the backend directory as if it were the root
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend'))
sys.path.insert(0, backend_dir)

from main import app
