from flask import Blueprint, Flask, render_template, redirect, url_for, request, session, jsonify, flash
from .models import User, Contents, Category
from flask_login import current_user, login_required
from . import db
import json

epblog = Blueprint("epblog", __name__)

@epblog.route("/")
def blog():
    pass

@epblog.route("/Create", methods=["GET", "POST"])
@login_required
def create():
    admin = User.query.filter_by(id=1).first()
    if(not admin.category):
        return(redirect(url_for("epblog.createCategory")))
    if(request.method == "POST"):
        if(current_user.id != 1):
            flash("You are not authorized to make blog posts.")
            return(redirect(url_for("epmain.home")))
        elif(len(request.form.get("name")) < 1):
            flash("Blog Post Title Required.")
        elif(len(request.form.get("name")) > 1023):
            flash("Blog Post Title Must be Fewer than 1024 Characters.")
        elif(len(request.form.get("text")) > 16383):
            flash("Split this into multiple posts")
        else:
            new_post = Contents(categoryid = int(request.form.get("category")), name=request.form.get("name"), text=request.form.get("text"))
            db.session.add(new_post)
            db.session.commit()
            flash("Blog Post Created!")
            return(redirect(url_for("epmain.home")))
    return(render_template("create-blog.html", admin = admin))

@epblog.route("/Create-Category", methods=["GET", "POST"])
@login_required
def createCategory():
    admin = User.query.filter_by(id=1).first()
    if(request.method == "POST"):
        if(current_user.id != 1):
            flash("You are not authorized to make blog post categories.")
            return(redirect(url_for("epmain.home")))
        elif(len(request.form.get("name")) < 1):
            flash("Blog Post Category Name Required.")
        elif(len(request.form.get("name")) > 255):
            flash("Blog Post Category Name Must be Fewer than 256 Characters.")
        else:
            new_category = Category(userid = current_user.id, name = request.form.get("name"))
            db.session.add(new_category)
            db.session.commit()
            flash("Blog Post Category Created Successfully!")
            return(redirect(url_for("epmain.home")))
    return(render_template("create-category.html", admin = admin))

@epblog.route("/Category/<string:category>")
def category(category):
    admin = User.query.filter_by(id=1).first()
    category = Category.query.filter_by(name=category.replace("-", " ")).first()
    return(render_template("category.html", admin = admin, category = category))

@epblog.route("/Category/<string:category>/<string:post>")
def post(category, post):
    admin = User.query.filter_by(id=1).first()
    category = Category.query.filter_by(name=category.replace("-", " ")).first()
    post = Contents.query.filter_by(name=post.replace("-", " ")).first()
    return(render_template("post.html", admin = admin, category = category, post = post))
