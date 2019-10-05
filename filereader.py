#coding: utf8
import os

path = 'D:\OneDrive\Documents\Work\Library Manager\Audioก'

files = []
# r=root, d=directories, f = files
for r, d, f in os.walk(path):
    for file in f:
        if '.mp3' in file:
            files.append(os.path.join(r, file))

for f in files:
    print(f)
