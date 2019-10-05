# coding: utf8
import os
import sys
from pathlib import Path
from urllib.parse import urljoin
from urllib.parse import urlparse


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
# Insert a row of data
# NAME, file LOCATION on disk, get TYPE from parent dir name, how to get SIZE in mb?
# c.execute("INSERT INTO library VALUES ('song 1','D:\Audioก\songs\song 1.mp3','songs',38)")
# c.execute("INSERT INTO library VALUES (f[0],[1]],'songs',38)")

# Insert a row of data
# NAME, file LOCATION on disk, get TYPE from parent dir name, how to get SIZE in mb?
# c.execute("INSERT INTO library VALUES ('song 1','D:\Audioก\songs\song 1.mp3','songs',38)")
