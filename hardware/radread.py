import serial
import json
import os
import random
import time
import requests
from pymongo import MongoClient



with open('credentials.json', 'r') as f:
    creds = json.load(f)

mongostr = creds["mongostr"]
client = MongoClient(mongostr)

db = client["safesurance"]
col = db.rads
maxid = 0
for x in col.find():
    # id = x["id"]
    maxid +=1
id = str(maxid)

ser = serial.Serial('COM8', 115200) 
# to read RFID/NFC

ser2 = serial.Serial('COM3', 115200)
# to read geiger counter

print ("connected to: " + ser.portstr)
print ("connected to: " + ser2.portstr)

inflag = False
r1 = 0.0
r2 = 0.0
r3 = 0.0
reading = 0.0

while True:
    line = ser.readline()
    print("read a line")
    line = line.decode('utf8')
    line = line.strip()
    print(line)
    if line.startswith('#') and line.endswith('$'):
        if inflag is False:
            inflag = True
            # now take 3 readings and average them
            line2 = ser2.readline()
            line2 = line2.decode('utf8')
            r1 = float(line2)
            line2 = ser2.readline()
            line2 = line2.decode('utf8')
            r2 = float(line2)
            line2 = ser2.readline()
            line2 = line2.decode('utf8')
            r3 = float(line2)
            reading = (r1 +r2 +r3)/3.0
            print("calibrated average readings : " + str(reading) + " microsieverts")
            print("readings done!")
            continue
        
        if inflag is True:
            # now send data to database
            payload = {}
            payload["visit"] = id
            payload["rads"] = reading

            result=col.insert_one(payload)
            print("database updated!")
            maxid += 1
            id = str(maxid)
            inflag = False
            continue



ser.close()
ser2.close()

    
