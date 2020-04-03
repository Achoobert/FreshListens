#coding: utf8
import sqlite3
conn = sqlite3.connect('library.db')
c = conn.cursor()

# Create users table
c.execute('''CREATE TABLE users IF NOT EXISTS(
			user_id INTEGER PRIMARY KEY, 
			name text, 
			location text 
			)''')
# Insert a row of data
# user name, village LOCATION name
c.execute("INSERT INTO users VALUES ('John Smith','Village 1')")

# Create library table
# IF NOT EXISTS
c.execute('''CREATE TABLE library IF NOT EXISTS (
			track_id INTEGER PRIMARY KEY,
			name text, 
			location text, 
			category text,
			album text, 
			size real,
    		UNIQUE(name, location
			)''')
# Insert a row of data
# NAME, file LOCATION on disk, get TYPE from parent dir name, how to get SIZE in mb?
c.execute(
    "INSERT INTO library VALUES ('song 1','D:\Audioก\songs\song 1.mp3','songs','x',38)")

# Create history table
# IF NOT EXISTS
c.execute('''CREATE TABLE history IF NOT EXISTS(
			history_id  INTEGER PRIMARY KEY, 
			date text,
			FOREIGN KEY (user_id) REFERENCES users (user_id), 
			FOREIGN KEY (track_id) REFERENCES library (track_id))''')
# Insert a row of data
# current date, user, track
c.execute("INSERT INTO history VALUES ('2006-01-05', 2, 8)")

# Save (commit) the changes
conn.commit()

# We can also close the connection if we are done with it.
# Just be sure any changes have been committed or they will be lost.
conn.close()
# The data you’ve saved is persistent and is available in subsequent sessions:
