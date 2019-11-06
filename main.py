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


def checkDatabase():  # Create database IF NOT EXISTS
    c.execute(
        '''CREATE TABLE IF NOT EXISTS users (user_id INTEGER PRIMARY KEY, name text, location text )''')
    c.execute('''CREATE TABLE IF NOT EXISTS library (track_id INTEGER PRIMARY KEY,name text, location text, type text, size real, UNIQUE(name, location))''')
    c.execute('''CREATE TABLE IF NOT EXISTS history(history_id  INTEGER PRIMARY KEY, date text, user_id INTERGER, track_id INTERGER, FOREIGN KEY (user_id) REFERENCES users (user_id), FOREIGN KEY (track_id) REFERENCES library (track_id))''')
    conn.commit()


def libraryDatabaseInit():  # check whole library location for new files (IF NOT EXISTS)
    # TODO user add ifnull/edit option library location on startup
    library_path = str("D:\OneDrive\Documents\Work\Library Manager\Audioก")
    #print("checking Database")
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
    # TODO access database using userID

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


# send
# current filesystem loc, int, Drive tosendto
def send(location, order, drive):

    print("2. send files to a Drive")
    drive = input("Drive Letter")
    # 'D' + ":/"
    # send file

    # 001, 012, 123 need force proper sorting

    print("Success")


def reviewSentTracks():
    # just print the whole sql
    print('todo')


# Create database IF NOT EXISTS
checkDatabase()

# check whole library location for new files (IF NOT EXISTS)
libraryDatabaseInit()


############ TEMP UI ##################
#   all users w/ ids
# a. select 'user' from list all users
#   dispence history
# b. option: back, send new
#   list all tracks
# c. enter IDs for songs desired to send, in order you want them to play

if choice == '1':
    testSendFiles()
else:
        # send to next ui step
    reviewSentTracks()
############# TEMP UI END #############

conn.close()
