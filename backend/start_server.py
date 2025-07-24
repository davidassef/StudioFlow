#!/usr/bin/env python
"""
Script para iniciar o servidor Django na porta 5000.
"""
import os
import sys

def main():
    """Inicia o servidor Django na porta 5000."""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "studioflow.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    
    # Define a porta 5000 para o servidor
    sys.argv = [sys.argv[0], "runserver", "0.0.0.0:5000"]
    execute_from_command_line(sys.argv)

if __name__ == "__main__":
    main()