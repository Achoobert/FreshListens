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

# user name, village LOCATION name
c.execute("INSERT OR IGNORE INTO users VALUES (NULL,'Johnny Smithson','Village 1')")
conn.commit()

# check library location for new files
libraryDatabaseInit()


today = date.today()
# add date sent to user
# history_id, date , user_id , track_id ,
c.execute("INSERT INTO history VALUES (null,'" +
          today.strftime("%d/%m/%Y")+"','1','1')")
conn.commit()


conn.close()
