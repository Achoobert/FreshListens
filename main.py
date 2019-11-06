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
        # print(f)
        c.execute(
            # track_id, name, location, type, size
            "INSERT OR IGNORE INTO library VALUES (null,'{0}','{1}','{2}',{3})".format(*f))
    conn.commit()


def displayFileHistory(userID):  # return array 'trackID, trackName, givenDate'
    for row in c.execute("SELECT track_id FROM history where user_id=1"):
        for row2 in c.execute("SELECT * FROM library where track_id=?", (row)):
            print(row2[0], row[1])
    # TODO access database using userID


def getFileSizeTotal(sendTracks):
    total = 0
    for i in sendTracks:
        c.execute(
            "SELECT size FROM library WHERE track_id=?", (i,))  # note: needs to be sequence
        total += (c.fetchone()[0])
    # TODO is this math actually right?
    total = (total*1e-6)
    return int(total)


def sendFiles(sendTracks, user_id, drive):  # toSend, list of requested files
    for i in sendTracks:
        c.execute(
            "SELECT location FROM library WHERE track_id=?", (i,))  # note: needs to be sequence
        print("found: ", c.fetchone())
        # send file
        send(location, order, drive)
        # Save sent file to history table

        #


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


def addUser():
    name = input("Enter Listener's Name")
    location = input("Enter location")
    # user name, village LOCATION name
    c.execute("INSERT OR IGNORE INTO users VALUES (?, ?s, ?s)",
              "", name, location)
    conn.commit()


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

# TODO display users
def displayUsers():
    for row in c.execute('SELECT * FROM users ORDER BY user_id'):
        print(row[0], row[1])
    uiPickUser()


def displayLibrary():
    print("\n\nDisplaying available tracks")
    for row in c.execute('SELECT * FROM library ORDER BY track_id'):
        print(row[0], row[1])


def uiPickUser():
    choice = input(
        "Enter matching ID to user to select\nEnter 'add' to create a new user\nEnter 'exit' to exit :(\n")

    if choice == 'exit':
        print('error')  # TODO exit
    if choice == 'add':
        addUser()
    else:
        # get name from library, depending on if in history
        # userID -> history -> library

        #searchUser = int(choice)
        # TODO remove
        searchUser = 1

        displayFileHistory(searchUser)
        # send to next ui step
        uiPickTracks(searchUser)


def uiPickTracks(userID):
    displayLibrary()
    choice = input(
        "enter enter IDs for tracks, in the order you want them to play\nOr 'back' to go back to the ̶f̶u̶t̶u̶r̶e̶  user list\n")

    if choice == 'exit':
        print('error')  # TODO exit
    if choice == 'back':
        displayUsers()
    else:
        # parse choice into array of int
        # trackList = choice.split(" ")
        trackList = [14, 13, 21, 16]
        # report size
        print("Selected files are", getFileSizeTotal(trackList), "MB")
        # send
        drive = 'D'
        sendFiles(trackList, userID, drive)


displayUsers()
############# TEMP UI END #############

conn.close()
