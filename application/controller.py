from flask import request, render_template
from flask import current_app as app

@app.route("/",methods=["GET"])
def homepage():
  if request.method=="GET":
    return render_template('homepage.html')