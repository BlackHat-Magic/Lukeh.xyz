from . import db
from flask_login import UserMixin
from sqlalchemy.sql import func

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True)
    email = db.Column(db.String(255))
    password = db.Column(db.String(255))
    category = db.relationship("Category")

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userid = db.Column(db.Integer, db.ForeignKey("user.id"))
    name = db.Column(db.String(255))
    contents = db.relationship("Contents")

class Contents(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    categoryid = db.Column(db.Integer, db.ForeignKey("category.id"))
    name = db.Column(db.String(1023))
    text = db.Column(db.String(16383))
