import os

from dotenv import load_dotenv
from flask import Flask

load_dotenv()


def _get_required_env(key: str) -> str:
    """Get required environment variable or raise ValueError."""
    value = os.getenv(key)
    if value is None:
        raise ValueError(f"{key} environment variable is not set.")
    return value


SMTP_SERVER: str = _get_required_env("SMTP_SERVER")
SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME: str = _get_required_env("SMTP_USERNAME")
SMTP_PASSWORD: str = _get_required_env("SMTP_PASSWORD")
SMTP_USE_TLS: bool = os.getenv("SMTP_USE_TLS", "true").casefold() == "true"
FROM_EMAIL: str = _get_required_env("FROM_EMAIL")
FROM_NAME: str = _get_required_env("FROM_NAME")
TO_EMAIL: str = _get_required_env("TO_EMAIL")

FLASK_SECRET_KEY: str = os.getenv("FLASK_SECRET_KEY", "")


def start() -> Flask:
    """Create and configure Flask app."""

    app = Flask(__name__)
    app.secret_key = FLASK_SECRET_KEY

    app.config["SMTP_SERVER"] = SMTP_SERVER
    app.config["SMTP_PORT"] = SMTP_PORT
    app.config["SMTP_USERNAME"] = SMTP_USERNAME
    app.config["SMTP_PASSWORD"] = SMTP_PASSWORD
    app.config["SMTP_USE_TLS"] = SMTP_USE_TLS
    app.config["from_email"] = FROM_EMAIL
    app.config["from_name"] = FROM_NAME
    app.config["to_email"] = TO_EMAIL

    from .endpoints_main import endpoints_main
    from .endpoints_projects import endpoints_projects

    app.register_blueprint(endpoints_main, url_prefix="/")
    app.register_blueprint(endpoints_projects, url_prefix="/Projects")

    return app
