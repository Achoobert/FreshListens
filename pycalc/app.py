# coding: utf_8
# file management
import shutil
from datetime import date
from pathlib import Path
import os
import sys
# Database
import json
import sqlite3
conn = sqlite3.connect('library.db')
c = conn.cursor()
# File manage
from anytree import AnyNode
from anytree.exporter import JsonExporter

from anytree import NodeMixin, RenderTree

 # @function checkDatabase
 #  insert a single line into the library location table
 # @param array ["string"]
 # @update location
 # @return string
def checkDatabase():  # Create database IF NOT EXISTS
    # users library history location    directories 
    c.execute(
        '''CREATE TABLE IF NOT EXISTS users (user_id INTEGER PRIMARY KEY, name text, location text )''')
    c.execute('''CREATE TABLE IF NOT EXISTS library (track_id INTEGER PRIMARY KEY,name text, location text, type text, size real, parent_dir text, checked INTEGER DEFAULT 0,  UNIQUE(name, location))''')
    c.execute('''CREATE TABLE IF NOT EXISTS history(history_id  INTEGER PRIMARY KEY, date text, user_id INTERGER, track_id INTERGER, FOREIGN KEY (user_id) REFERENCES users (user_id), FOREIGN KEY (track_id) REFERENCES library (track_id))''')
    c.execute('''CREATE TABLE IF NOT EXISTS location(loc_id INTEGER PRIMARY KEY, location text )''')
    c.execute('''CREATE TABLE IF NOT EXISTS directories 
    (dir_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, parent_dir TEXT, location TEXT, checked INTEGER DEFAULT 0, UNIQUE(name, location))''')
    c.execute('''CREATE TABLE IF NOT EXISTS tree (tree_id INTEGER PRIMARY KEY AUTOINCREMENT, jsonText TEXT)''')
    conn.commit()
    return True

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
        scanSuccess = libraryDatabaseNew(newLine)
        return (scanSuccess)
    except Exception as e:
        if hasattr(e, 'message'):
            return(getattr(e, 'message', str(e)))
        else:
            return(e)

def resetLibrary():
    # TODO Optimize this
    # REMOVEDFORTESTING 
    return True
    c.execute("UPDATE library SET checked = 0")
    c.execute("UPDATE directories SET checked = 0")
    conn.commit()

def libraryDatabaseNew(newPath): # get paths, send to scanner
    # if null check
    if (newPath.__len__() == 0):
        return False
    # check for files
    return locationScan([newPath])

def libraryDatabaseRecheck(): # get paths, send to scanner
    # TODO optimize
    # REMOVEDFORTESTING
    return True
    # Update pathlist
    # pathList = ["D:\schubert.dev\Library Manager\Audioก\MUSIC\Dee Kheng แคว่แน้ฌี้", "D:\schubert.dev\Library Manager\Audioก\MUSIC\Dee Kheng ทมึลู่งที๊งแว่ลโค๊"]
    pathList = getPathList()
    # if null on startup check
    if (pathList.__len__() == 0):
        return False
    # Only check for missing files on app startup. 
    # if user deletes files with app open thats THEIR problem
    resetLibrary()
    return locationScan(pathList)

def locationScan(pathList): # Scan the directories
    files = []
    # r=root, d=directories, f = files
    # make an array of ID's not found, remove them
    try:
        for library_path in pathList:
            for root, directories, files in os.walk(Path(library_path)):
                for fn in directories:
                    # name, parent_dir, location
                    dirInsert([
                        (fn), # name ('songs)
                        (root), # parent_dir ('d:/mylibrary/audio')
                        (os.path.join(root, fn)) # d:/mylibrary/audio/songs
                    ])
                for fn in files:
                    # track_id,name , location , type , size , parent_dir, checked 
                    libraryFileInsert([
                        (os.path.splitext(fn)[0]),
                        os.path.join(root, fn),
                        "audio",
                        os.stat(os.path.join(root, fn)).st_size,
                        (root),
                        1
                    ])
        return (True)
    except Exception as e:
        if hasattr(e, 'message'):
            return(getattr(e, 'message', str(e)))
        else:
            return(e)

def libraryFileInsert(file): # Update the Database
    try:
        c.execute("UPDATE or IGNORE library SET checked = 1 WHERE (name == '"+ str(file[0])+"' AND location == '"+ str(file[1]) +"')")
        if c.rowcount < 1:
            # error, file does not exist
                # track_id, name, location, type, size
                # null       0         1       2      3       4        5
                # track_id,name , location , type , size , parent_dir, checked 
            c.execute("INSERT OR IGNORE INTO library VALUES (null,'{0}','{1}','{2}',{3},'{4}',{5})".format(*file))
        conn.commit()
        return (True)
    except Exception as e:
        if hasattr(e, 'message'):
            return(getattr(e, 'message', str(e)))
        else:
            return(e)

def dirInsert(dir): # Update the Database
    try:
        c.execute(
            "UPDATE directories SET checked = 1 WHERE (name == '"+ str(dir[0])+"' AND location == '"+ str(dir[2]) +"')")
        if c.rowcount < 1:
            c.execute(
                # null     0        1            2      3
                # dir_id, name, parent_dir, location, checked
                "INSERT OR IGNORE INTO directories VALUES (null, '{0}','{1}','{2}', 1)".format(*dir))
            # If record already exists, update database to reflect that it exists
        conn.commit()
        return (True)
    except Exception as e:
        if hasattr(e, 'message'):
            return(getattr(e, 'message', str(e)))
        else:
            return(e)

def appInit():
    try:
        checkDatabase()
        resetLibrary()
    except Exception as e:
        if hasattr(e, 'message'):
            return(getattr(e, 'message', str(e)))
        else:
            return(e)


def sendFiles(dataArr):
    # [[[0,'ok','C:/users/music/hi.mp3'],[1],[2]],[0, bob],["E:"]]
    toSend = dataArr[0]     # toSend: 0 id, 1 name, 2 path, 3 type, 4 size
    currentUser = dataArr[1]
    selectedDrive  = dataArr[2] 
    processedFiles = []
    #return(dataArr)
    for i, item in enumerate(toSend):
        # get proper path from database
        # trying to pass it back and forth causes issues
        c.execute("Select location FROM library WHERE track_id="+ str(item[0]))
        source = c.fetchone()[0]
        # Get source filename with filetype ex: ".mp3"
        filename = (os.path.basename(os.path.normpath(source)))
        # make destination path + order in sent array + file name "D:/001__file.txt"
        destination = (selectedDrive+'/'+str(("{:03d}".format(i)))+'__'+filename)
        # os.path.join(///x.mp3)
        try:
            shutil.copyfile(Path(source), Path(destination), follow_symlinks=True)  
            # Save sent file to history table
            logFileReceived(currentUser, item[0])
            processedFiles.append([source, destination])
        except Exception as e:
            if hasattr(e, 'message'):
                return(getattr(e, 'message', str(e)))
            else:
                return(e)
            
    return processedFiles


def logFileReceived(userID, fileID):
    today = date.today()
    # c.execute("INSERT INTO history VALUES ('2006-01-05', 1, 8)")
    # history_id, date , user_id , track_id ,
    try:
        c.execute("INSERT OR IGNORE INTO history VALUES (null,'" + today.strftime("%/d/%m/%Y")+"', ?,   ?)", (userID, fileID))
        conn.commit()
        return True
    except Exception as e:
        if hasattr(e, 'message'):
            return(getattr(e, 'message', str(e)))
        else:
            return(e)


def addUser(userData):
    name = userData[0]
    location = userData[1]
    #  user name, village LOCATION name
    try:
        c.execute("INSERT OR IGNORE INTO users VALUES (NULL, '" + name + "', '"+location+"')")
        conn.commit()
        return ("inserted")
    except Exception as e:
        if hasattr(e, 'message'):
            return(getattr(e, 'message', str(e)))
        else:
            return(e)
def getHistory(userID):
    # TODO
    # select library.fullPath history.track_id from history where user... LEFT JOIN library where track_id
    # Return ([1, "d:/a/b/c/track2"])
    # can use either todo a jquery dom lookup?
    # could iterate through nodes in python but I need to learn javascript gooder
    historyArr = []
    try:
        for row in c.execute('SELECT track_id FROM history where user_id=? ORDER BY track_id', str(userID)):
            #print(row[0])
            historyArr.append(row[0])
    except:
        return("error", row)
    return historyArr
    # TODO show user's track history
    arr = []
    for row in (historyArr): 
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


# TODO make this NOT break if table is empty
def getUsers():
    arr = []
    for row in c.execute('SELECT * FROM users ORDER BY user_id'):
        #print([row[0], row[1], row[2]])
        arr.append([row[0], row[1], row[2]])
    #c.execute('SELECT * FROM users ORDER BY user_id')
    return arr




### start Tree Builder code ###
class libNode(NodeMixin):  # create new class with Node feature
    def __init__(self, text, fullpath, parent=None, track_data=None, topDir=None, children=None):
        super(libNode, self).__init__()
        self.text = text                    # what the User sees
        self.name = fullpath               # "d:/root/child" unique 'id'
        if track_data:                        # If it is a file
            # [id, name, type, size]  
            self.track_data = track_data
            self.id = track_data[0]
            #self.size = track_data[2]
            self.icon = "glyphicon glyphicon-cd"
        if topDir:
            self.state = { "opened": "true" }
        self.parent = parent               # parent full path
        if children:
            self.children = children       # possible both Dir and Track 



def treeBuilder():# Tree Builder Function
    def returnJsonTree(d):
        exporter = JsonExporter(indent=2, sort_keys=True, ensure_ascii=False)
        return(exporter.export(d))
    exporter = JsonExporter(indent=2, sort_keys=True, ensure_ascii=False)
    # Create a dictionary to procedurally store node objects in
    libTreeDict = {}
    try:        
        libTreeDict["myRoot"] = libNode("my Library Folders", fullpath="/", topDir=1)        
        # Build first layer, user selected library locations 
        for row in c.execute('SELECT location FROM location'):
            # and in the loop use the name as key when you add your instance:
            libTreeDict[(row[0])] = libNode(os.path.basename(Path(row[0])), fullpath=row[0], parent=libTreeDict[("myRoot")], topDir=1) # root is parent '/' and locationDir ID is '/path'
        for row in c.execute('''SELECT name, location, parent_dir, checked FROM directories WHERE checked == 1'''):
            # TODO dictionary insert name variable, is it too long?
            libTreeDict[(row[1])] =  libNode(row[0], fullpath=row[1], parent=libTreeDict[row[2]]) # parent is stored in dir database as '/path' 
        # End points, files. Directories or locations are possible parents      
        for row in c.execute('''SELECT name, location, parent_dir, track_id, type, size, checked FROM library WHERE checked == 1'''):
            libTreeDict[(row[1])] =  libNode(row[0], row[1], parent=libTreeDict[(row[2])], track_data=[row[3],row[0],row[4],row[5]]) # parent is stored in dir database as '/path'
        # returnTree
        return(exporter.export(libTreeDict["myRoot"]))
    except Exception as e:
        if hasattr(e, 'message'):
            return(getattr(e, 'message', str(e)))
        else:
            return(e)
#print (treeBuilder())

def getLibrary():
    #tree = []
    #for row in c.execute('SELECT jsonText FROM tree'):
        # get only the json text
    #    tree.append(row[0])
    #if(len(tree)!= 0):
    #    return tree[((len(tree)-1))]
    #return (returnJsonTree(treeBuilder()))
    jsonText = (treeBuilder())
    #c.execute("INSERT OR IGNORE INTO tree VALUES (null,`" + jsonText + "`)")
    #conn.commit()
    return (jsonText)
    #arr = []
    # update files
# return arr
# class anytree.node.node.Node(name, parent=None, children=None, **kwargs)
#print(getLibrary())

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


