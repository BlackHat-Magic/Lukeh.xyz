from flask import Blueprint, render_template

endpoints_projects = Blueprint("endpoints_projects", __name__)

@endpoints_projects.route("/")
def projects():
    return("incomplete")

@endpoints_projects.route("/Lukeh.xyz")
def portfolio():
    return(render_template("projects/portfolio.html"))

@endpoints_projects.route("/SD-Runpod")
def sd_runpod():
    return(render_template("projects/sd_runpod.html"))

@endpoints_projects.route("/Silverquill-Compiler")
def silverquill():
    return(render_template("projects/silverquill.html"))

@endpoints_projects.route("/Asmadi-Engine")
def asmadi():
    return(render_template("projects/asmadi.html"))

@endpoints_projects.route("/Math")
def math():
    return(render_template("projects/math.html"))