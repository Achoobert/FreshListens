#allow file managment
from pathlib import Path
import os, sys
from urllib.parse import urljoin
from urllib.parse import urlparse

#Database
import sqlite3
conn = sqlite3.connect('library.db')
c = conn.cursor()

# Insert a row of data
c.execute("INSERT INTO stocks VALUES ('2006-01-05','BUY','RHAT',100,35.14)")

# Save (commit) the changes
conn.commit()

# We can also close the connection if we are done with it.
# Just be sure any changes have been committed or they will be lost.
conn.close()
#The data you’ve saved is persistent and is available in subsequent sessions:

import sqlite3
conn = sqlite3.connect('example.db')
c = conn.cursor()
