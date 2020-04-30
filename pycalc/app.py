# coding: utf_8
# file management
import shutil
from datetime import date
from pathlib import Path
import os
import sys
# Database
import sqlite3
conn = sqlite3.connect('library.db')
c = conn.cursor()
# File manage
# UI

 # @function checkDatabase
 #  insert a single line into the library location table
 # @param array ["string"]
 # @update location
 # @return string
def checkDatabase():  # Create database IF NOT EXISTS
    c.execute(
        '''CREATE TABLE IF NOT EXISTS users (user_id INTEGER PRIMARY KEY, name text, location text )''')
    c.execute('''CREATE TABLE IF NOT EXISTS library (track_id INTEGER PRIMARY KEY,name text, location text, type text, size real, UNIQUE(name, location))''')
    c.execute('''CREATE TABLE IF NOT EXISTS history(history_id  INTEGER PRIMARY KEY, date text, user_id INTERGER, track_id INTERGER, FOREIGN KEY (user_id) REFERENCES users (user_id), FOREIGN KEY (track_id) REFERENCES library (track_id))''')
    c.execute('''CREATE TABLE IF NOT EXISTS location(loc_id INTEGER PRIMARY KEY, location text )''')
    conn.commit()

 # @function getPathList
 #  get array of paths from table
 # @return string "D:/x/x/x/"
def getPathList():
    pathList = []
    for row in c.execute('SELECT * FROM location'):
        # get only the path text
        pathList.append(row[1])
    return pathList

 # @function addLibraryPath
 #  insert a single line into the library location table
 # @param array ["string"]
 # @update location
 # @return string
def addLibraryPath(newLine):
    # add path to file, ALSO update database
    try:
        c.execute("INSERT OR IGNORE INTO location VALUES (null,\"" + newLine[0] + "\")")
        conn.commit()
        # scan the new folder 
        scanSuccess = libraryDatabaseInit()
        return (scanSuccess)
    except Exception as e:
        if hasattr(e, 'message'):
            return(getattr(e, 'message', str(e)))
        else:
            return(e)

def libraryDatabaseInit():  # check whole library location for new files (IF NOT EXISTS)
    # Update pathlist
    pathList = getPathList()
    # pathList = ["D:\schubert.dev\Library Manager\Audioก\MUSIC\Dee Kheng แคว่แน้ฌี้", "D:\schubert.dev\Library Manager\Audioก\MUSIC\Dee Kheng ทมึลู่งที๊งแว่ลโค๊"]
    # if null on startup check
    if (pathList.__len__() == 0):
        return False
    files = []
    # r=root, d=directories, f = files
    try:
        for library_path in pathList:
            for r, d, f in os.walk(Path(library_path)):
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
        return True
    except Exception as e:
        if hasattr(e, 'message'):
            return(getattr(e, 'message', str(e)))
        else:
            return(e)

print ("test")
print (libraryDatabaseInit())


def getFileSizeTotal(sendTracks):
    total = 0
    for i in sendTracks:
        c.execute(
            "SELECT size FROM library WHERE track_id=?", (i,))  # note: needs to be sequence
        total += (c.fetchone()[0])
    # TODO is this math actually right?
    total = (total*1e-6)
    return int(total)


def sendFiles(dataArr):
    # [[[0,'ok','C:/users/music/hi.mp3'],[1],[2]],[0, bob],["E:"]]
    toSend = dataArr[0]     # toSend: 0 id, 1 name, 2 path, 3 type, 4 size
    currentUser = dataArr[1]
    selectedDrive  = dataArr[2] 
    processedFiles = []
    for i, item in enumerate(toSend):
        # get proper path from database
        # trying to pass it back and forth causes issues
        c.execute("Select location FROM library WHERE track_id=?",(item[0]))
        source = c.fetchone()[0]
        # Get source filename with filetype ex: ".mp3"
        filename = (os.path.basename(os.path.normpath(source)))
        # make destination path + order in sent array + file name "D:/001__file.txt"
        destination = (selectedDrive+'/'+str(("{:03d}".format(i)))+'__'+filename)
        # os.path.join(///x.mp3)
        try:
            shutil.copyfile(Path(source), Path(destination), follow_symlinks=True)  
            # Save sent file to history table
            logFileReceived(currentUser[0], item[0])
            processedFiles.append([source, destination])
        except Exception as e:
            return e
            
    return processedFiles


def logFileReceived(userID, fileID):
    today = date.today()
    # c.execute("INSERT INTO history VALUES ('2006-01-05', 1, 8)")
    # conn.commit()

    # add date sent to user
    # history_id, date , user_id , track_id ,
    c.execute("INSERT OR IGNORE INTO history VALUES (null,'" +
              today.strftime("%d/%m/%Y")+"', ?,   ?)", (1, 3))
    conn.commit()
    return True


def addUser(userData):
    name = userData[0]
    location = userData[1]
    # ???, user name, village LOCATION name
    c.execute("INSERT OR IGNORE INTO users VALUES (?, ?s, ?s)",
              "", name, location)
    conn.commit()


def getHistory(userID):

    historyArr = []
    for row in c.execute('SELECT * FROM history where user_id=?', str(userID)):
        #print([row[0], row[1], row[2]])
        historyArr.append([row[0], row[1], row[2], row[3]])
    #c.execute('SELECT * FROM users ORDER BY user_id')
    #return historyArr

    # TODO show user's track history
    arr = []
    #for row in c.execute('SELECT * FROM users ORDER BY user_id')
    for row in (historyArr): #c.execute("SELECT * FROM history ORDER BY user_id "):#, str(userID)):
        #arr.append(row[1]) # 1
        #rowData = row
        try:
            for row2 in c.execute('SELECT * FROM library where track_id='+ str(row[3])):
                rowData = [row2[0], row[1], row2[1], row2[3]]
                #id, date, name, type
                arr.append([rowData]) #0, 1, 3
        except:
            return("error", row)
    return (arr)
    

def reviewSentTracks(userID):
    # just print the whole sql
    return('todo')


# Create database IF NOT EXISTS
checkDatabase()

# check whole library location for new files (IF NOT EXISTS)
libraryDatabaseInit()


def getUsers():
    arr = []
    for row in c.execute('SELECT * FROM users ORDER BY user_id'):
        #print([row[0], row[1], row[2]])
        arr.append([row[0], row[1], row[2]])
    #c.execute('SELECT * FROM users ORDER BY user_id')
    return arr


def getLibrary():
    arr = []
    for row in c.execute('SELECT * FROM library ORDER BY track_id'):
        #print([row[0], row[1], 'location', row[3], row[4]])
        arr.append([row[0], row[1], row[3], row[4]])
    #c.execute('SELECT * FROM users ORDER BY user_id')
    return arr


# displayUsers()
############# TEMP UI END #############
def echo(text):
    return (text)

####### Get Removable Drives
import ctypes
from os.path import sep, dirname, expanduser, isdir
from os import walk
import string

import platform
platform = platform.system()

if platform == 'Windows':
    from ctypes import windll, create_unicode_buffer
# Return list of tuples mapping drive letters to drive types
# Copied from stack overflow so may break 🙏
def getDrives():
    drives = []
    if platform == 'Windows':
        bitmask = windll.kernel32.GetLogicalDrives()
        GetVolumeInformationW = windll.kernel32.GetVolumeInformationW
        for letter in string.ascii_uppercase:
            if bitmask & 1:
                name = create_unicode_buffer(64)
                # get name of the drive
                drive = letter + u':'
                res = GetVolumeInformationW(drive + sep, name, 64, None,
                                            None, None, None, 0)
                #if (drive != 'C:' and drive != 'D:'):
                #    drives.append((drive, name.value))
                drives.append((drive, name.value))
            bitmask >>= 1
    elif platform == 'Linux':
        drives.append((sep, sep))
        drives.append((expanduser(u'~'), '~/'))
        places = (sep + u'mnt', sep + u'media')
        for place in places:
            if isdir(place):
                for directory in walk(place).next()[1]:
                    drives.append((place + sep + directory, directory))
    elif platform == 'Darwin' or platform == 'ios':
        drives.append((expanduser(u'~'), '~/'))
        vol = sep + u'Volume'
        if isdir(vol):
            for drive in walk(vol).next()[1]:
                drives.append((vol + sep + drive, drive))
    return drives


