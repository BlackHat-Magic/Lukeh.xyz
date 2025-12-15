from flask import Blueprint, redirect, render_template, url_for

endpoints_projects = Blueprint("endpoints_projects", __name__)

@endpoints_projects.route("/")
def projects():
    """
    Projects directory page
    """

    return "incomplete"

@endpoints_projects.route("/Lukeh.xyz")
def portfolio():
    """
    Portfolio
    """

    return render_template("projects/portfolio.html")

@endpoints_projects.route("/SD-Runpod")
def sd_runpod():
    """
    SD Runpod
    """

    return render_template("projects/sd_runpod.html")

@endpoints_projects.route("/Silverquill-Compiler")
def silverquill():
    """
    Silverquill
    """

    return render_template("projects/silverquill.html")

@endpoints_projects.route("/Asmadi-Engine")
def asmadi():
    """
    Asmadi was renamed
    """

    return redirect(url_for("endpoints_projects.palladia"))

@endpoints_projects.route("/Palladia-Engine")
def palladia():
    """
    Palladia engine
    (formerly Asmadi)
    """

    return render_template("projects/palladia.html")

@endpoints_projects.route("/Math")
def math():
    """
    Math tools
    """

    return render_template("projects/math.html")

@endpoints_projects.route("/Other")
def other():
    """
    Other projects
    """

    return render_template("projects/other.html")