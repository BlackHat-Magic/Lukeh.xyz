import os
import smtplib
import socket

from dotenv import load_dotenv
from flask import Flask

load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER", None)
if SMTP_SERVER is None:
    raise ValueError("SMTP_SERVER environment variable cannot be None.")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", None)
if SMTP_USERNAME is None:
    raise ValueError("SMTP_USERNAME environment variable cannot be None.")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", None)
if SMTP_PASSWORD is None:
    raise ValueError("SMTP_PASSWORD environment variable cannot be None.")
SMTP_USE_TLS = os.getenv("SMTP_USE_TLS", "true").casefold() == "true"
FROM_EMAIL = os.getenv("FROM_EMAIL", None)
if FROM_EMAIL is None:
    raise ValueError("FROM_EMAIL environment variable cannot be None.")
FROM_NAME = os.getenv("FROM_NAME", None)
if FROM_NAME is None:
    raise ValueError("FROM_NAME environment variable cannot be None.")
TO_EMAIL = os.getenv("TO_EMAIL", None)
if TO_EMAIL is None:
    raise ValueError("TO_EMAIL environment variable cannot be None.")

FLASK_SECRET_KEY = os.getenv("FLASK_SECRET_KEY", "")

def start():
    """
    Create Flask app object
    """

    app = Flask(__name__)

    app.secret_key = FLASK_SECRET_KEY

    app.config["SMTP_SERVER"] = SMTP_SERVER
    app.config["SMTP_PORT"] = SMTP_PORT
    app.config["SMTP_USERNAME"] = SMTP_USERNAME
    app.config["SMTP_PASSWORD"] = SMTP_PASSWORD
    app.config["SMTP_USE_TLS"] = SMT_USE_TLS
    app.config["from_email"] = FROM_EMAIL
    app.config["from_name"] = FROM_NAME
    app.config["to_email"] = TO_EMAIL

    from .endpoints_main import endpoints_main
    # from .endpoints_auth import endpoints_auth
    # from .endpoints_blog import endpoints_blog
    from .endpoints_projects import endpoints_projects

    app.register_blueprint(endpoints_main, url_prefix="/")
    # app.register_blueprint(endpoints_auth, url_prefix="/auth")
    # app.register_blueprint(endpoints_blog, url_prefix="/Blog")
    app.register_blueprint(endpoints_projects, url_prefix="/Projects")

    return app
