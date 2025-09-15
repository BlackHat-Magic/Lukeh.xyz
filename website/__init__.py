from flask import Flask

def start():
    app = Flask(__name__)

    from .endpoints_main import endpoints_main
    # from .endpoints_auth import endpoints_auth
    # from .endpoints_blog import endpoints_blog
    from .endpoints_projects import endpoints_projects

    app.register_blueprint(endpoints_main, url_prefix="/")
    # app.register_blueprint(endpoints_auth, url_prefix="/auth")
    # app.register_blueprint(endpoints_blog, url_prefix="/Blog")
    app.register_blueprint(endpoints_projects, url_prefix="/Projects")

    return app
