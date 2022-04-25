from datetime import datetime, timedelta
from application.db import *
import redis

try:
  r=redis.Redis(host='localhost', port=6379,)
except:
  r=0

def valid(user_name, token):
  bool=False
  if(r):
    try:
      redistoken=r.get(user_name).decode("utf-8")
      if(redistoken==token):
        print(bool)
    except:
      bool = False
  if(not(bool)):
    respone = Login.query.filter_by(user_name=user_name, fs_uniquifier=token).first()
    if(respone):
      bool=True
      try:
        r.setex(
        user_name,
        timedelta(minutes=60),
        value=token
        )
      except:
        pass
  return bool