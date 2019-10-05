#Database first build
import sqlite3
conn = sqlite3.connect('library.db')
c = conn.cursor()

# Create table
#IF NOT EXISTS 
c.execute('''CREATE TABLE stocks IF NOT EXISTS
             (date text, trans text, symbol text, qty real, price real)''')
# Insert a row of data
c.execute("INSERT INTO stocks VALUES ('2006-01-05','BUY','RHAT',100,35.14)")

# Create table
c.execute('''CREATE TABLE users IF NOT EXISTS
             (name text, trans text, symbol text, qty real, price real)''')
# Insert a row of data
c.execute("INSERT INTO users VALUES ('2006-01-05','BUY','RHAT',100,35.14)")

# Save (commit) the changes
conn.commit()

# We can also close the connection if we are done with it.
# Just be sure any changes have been committed or they will be lost.
conn.close()
#The data you’ve saved is persistent and is available in subsequent sessions:
