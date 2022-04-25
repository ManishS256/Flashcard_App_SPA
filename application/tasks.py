from application.workers import celery
from flask import current_app as app
from application.db import *
from celery.schedules import crontab
from email.message import EmailMessage
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import time
from datetime import date, datetime
from jinja2 import Template

SENDER = "app_email_id"
PASSWORD ="app_email_id_password"

@celery.on_after_finalize.connect
def setup_periodic_tasks_daily(sender, **kwargs):
  sender.add_periodic_task(
    crontab(hour=2, minute=32),
    dailyreminder.s(),
  )

@celery.task()
def dailyreminder():
  userlist=Login.query
  drl=[]
  for i in userlist:
    drl.append(i.user_name)
  for username in drl:
    userdata=Deck.query.filter_by(user_name=username)
    drldata=[]
    senddata=[]
    finallist=[]
    for i in userdata:
      drldata.append({"user_name":i.user_name,"deck_name":i.deck_name,"last_reviewed":i.last_reviewed,"score":i.score})
      senddata.append(i.deck_name)
      newdt=datetime.strptime(i.last_reviewed, "%d/%m/%Y %H:%M:%S")
      dts=newdt.timestamp()
      nts=time.time()
      if(nts-dts > 86400):
        finallist.append(i.deck_name)
    if(len(finallist)>0):
      dailyreminderhtml.delay(finallist, i.user_name)
    finallist=[]

@celery.task()
def dailyreminderhtml(l, name):
  tp=Template('''\
  <html>
    <body>
    <h2>You have not revised these decks for the last 24 hours. Please do revise it.</h2>
    <ul><h3>
    {% for line in l %}
    <li>{{ line }}</li>
    {% endfor %}
    </h3></ul>
    <h3>Follow this <a href="http://127.0.0.1:5000/">link</a> to open the Flash Card App ✌<h3>
    <body>
  </html>
  ''')
  html=tp.render(l=l)
  part1=MIMEText(html, 'html')
  name=name
  today=date.today()
  subject="Reminder for "+str(today.strftime("%B %d, %Y"))
  send_email(name, subject, part1)


@celery.task()
def send_email(recipient, subject, part1):
  msg = MIMEMultipart('alternative')
  msg.attach(part1)
  msg["Subject"] = subject
  msg["From"] = SENDER
  msg["To"] = recipient
  server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
  server.login(SENDER, PASSWORD)
  server.send_message(msg)
  server.quit()


@celery.on_after_finalize.connect
def setup_periodic_tasks_monthly(sender, **kwargs):
  sender.add_periodic_task(
    crontab(hour=2, minute=32),
    montlyreport.s(),
  )

@celery.task()
def montlyreport():
  today=date.today()
  month=str(today.strftime("%B"))
  userlist=Login.query.all()
  for i in userlist:
    l=[]
    deck=Deck.query.filter_by(user_name=i.user_name).all()
    for j in deck:
      cards=Card.query.filter_by(user_name=i.user_name, deck_name=j.deck_name).all()
      leng=len(cards)
      if(leng==0):
        leng=1
      deckname=j.deck_name
      score=format((j.score/leng)/5, ".3f")
      l.append((deckname,score))
    montlyreporttemplate.delay(month,i.user_name,l)


@celery.task()
def montlyreporttemplate(month,name,l):
    tp= Template('''\
    <html>
      <head>
      <style>
      table, th, td {
        border: 1px solid black;
        border-collapse: collapse;
      }
      th, td {
        padding: 15px;
      }
      </style>
      </head>
      <body>
      {% set count = namespace(value=0) %}
      {% if  l|length >0 %}
      <h2>This is the Montly Report of your progress in the Flash Card Application for the month {{month}}</h2>
      <table>
        <tr>
        <th>S.No</th>
        <th>Deck Name</th>
        <th>Score</th>
        </tr>
      {% for de in l %}
        {% set count.value = count.value + 1 %}
        <tr>
        <td>{{count.value}}</td>
        <td>{{de[0]}}</td>
        <td>{{de[1]}}</td>
        </tr>
      {% endfor %}
      </table>
      <h3>Scoring Pattern</h3>
      <h4><ul><li>A Score around 5 means, you have most probably seen all the cards in the deck and selected easy as the option</li>
      <li>A Score around 1 means mostly all the cards you have seen were difficult to remember for you or you haven't played enough</li>
      <li>A Score above 10 means you have practiced well and mostly you memorized most of the cards</li>
      </ul></h4>
      {% else %}
      <h2>Hey!!! You have no decks in your Flash Card Account</h2>
      <h3><ul><li>We are sure you will have something to memorize, isn't it?</li>
      <li>Our Flash Card Application is waiting to help you</li>
      <li>Add some decks now!!!</li></ul><br>
      ADIOS 👋 - FLASHCARD APPLICATION TEAM
      </h3>
      {% endif %}
      <h3>Follow this <a href="http://127.0.0.1:5000/">link</a> to open the Flash Card App ✌<h3>
      </body>
    </html>''')
    html=tp.render(month=month,l=l)
    part1=MIMEText(html, 'html')
    name=name
    subject="Reminder for "+month
    send_email(name, subject, part1)