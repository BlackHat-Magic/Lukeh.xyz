from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path
from flask_login import LoginManager

db = SQLAlchemy()
DB_NAME = "database.db"

def start():
    app = Flask(__name__)
    keyfile = open("session.key")
    key = keyfile.read()
    keyfile.close()
    app.config["SECRET_KEY"] = key
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DB_NAME}"
    db.init_app(app)

    from .epmain import epmain
    from .epauth import epauth
    from .epblog import epblog

    app.register_blueprint(epmain, url_prefix="/")
    app.register_blueprint(epauth, url_prefix="/")
    app.register_blueprint(epblog, url_prefix="/Blog")

    from .models import User, Contents

    create_database(app)

    login_manager = LoginManager()
    login_manager.login_view = "epauth.login"
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(id):
        return(User.query.get(int(id)))

    return app

def create_database(app):
    if(not path.exists("website/" + DB_NAME)):
        with app.app_context():
            db.create_all()
        print("Created Database")
