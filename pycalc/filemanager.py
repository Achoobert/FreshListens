import shutil
import os
# TODO get src, and filename from sql

# TODO get src from SQL
src = 'D:\\OneDrive\\Documents\\Work\\Library Manager\\Audioก\\teachings\\teaching 4.mp3'

# TODO prefix play order number
dst = os.path.join('C:\\', 'teaching 4.mp3')
# C:\\teaching 4.mp3

shutil.copy(src, dst)
