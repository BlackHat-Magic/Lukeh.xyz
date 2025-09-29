from flask import Blueprint, render_template

endpoints_main = Blueprint("endpoints_main", __name__)

@endpoints_main.route("/")
def home():
    return(render_template("index.html"))

@endpoints_main.route("/Blog")
def blog():
    return(render_template("under_construction.html"))