#!/bin/bash
source /mnt/c/Users/Manish/Desktop/'Local Python'/mypython/bin/activate;
cd /mnt/c/Users/Manish/Desktop/madproject;
celery -A main.celery worker -l info