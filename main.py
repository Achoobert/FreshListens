# coding: utf_8
# file management
from datetime import date
from pathlib import Path
import os
import sys
# Database
import sqlite3
conn = sqlite3.connect('library.db')
c = conn.cursor()


def checkDatabase():
    c.execute(
        '''CREATE TABLE IF NOT EXISTS users (user_id INTEGER PRIMARY KEY, name text, location text )''')
    c.execute('''CREATE TABLE IF NOT EXISTS library (track_id INTEGER PRIMARY KEY,name text, location text, type text, size real, UNIQUE(name, location))''')
    c.execute('''CREATE TABLE IF NOT EXISTS history(history_id  INTEGER PRIMARY KEY, date text, user_id INTERGER, track_id INTERGER, FOREIGN KEY (user_id) REFERENCES users (user_id), FOREIGN KEY (track_id) REFERENCES library (track_id))''')
    conn.commit()


def libraryDatabaseInit():
    # TODO Make this blank by default, have way for user to set
    library_path = str("D:\OneDrive\Documents\Work\Library Manager\Audioก")

    files = []
    # r=root, d=directories, f = files
    for r, d, f in os.walk(library_path):
        for fn in f:
            files.append([
                (os.path.splitext(fn)[0]),
                os.path.join(r, fn),
                "audio",
                os.stat(os.path.join(r, fn)).st_size
            ])

    for f in files:
        print(f)
        c.execute(
            # track_id, name, location, type, size
            "INSERT OR IGNORE INTO library VALUES (null,'{0}','{1}','{2}',{3})".format(*f))
    conn.commit()


checkDatabase()

# check library location for new files
libraryDatabaseInit()

# send files


def sendFiles(toSend):
    # toSend, list of requested files

    # Save sent file to history table


def logFileReceived(user, file):
    today = date.today()
    # add date sent to user
    # history_id, date , user_id , track_id ,
    c.execute("INSERT INTO history VALUES (null,'" +
              today.strftime("%d/%m/%Y")+"','1','1')")
    conn.commit()


# command line testing
# two choices: send files, review all sent tracks
def testSendFiles():
    print("1. input user ")
    name = input("Enter Listener's Name")
    location = input("Enter location")
    # user name, village LOCATION name
    c.execute("INSERT OR IGNORE INTO users VALUES (NULL, %(name)s, %(location)s)" %)
    conn.commit()

    print("2. send files to a Drive")
    drive = input("Drive Letter")
    # 'D' + ":/"
    # send ALL files

    print("Success")


def reviewSentTracks():
    # just print the whole sql
    print('todo')


choice = input("enter '1' to send tracks\nenter '2' to print history\n")

if choice == '1':
    testSendFiles()
else:
    reviewSentTracks()

conn.close()
