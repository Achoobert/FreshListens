import shutil
import os

src = 'D:\\OneDrive\\Documents\\Work\\Library Manager\\Audioก\\teachings\\teaching 4.mp3'
dst = os.path.join('C:\\', 'teaching 4.mp3')
# C:\\teaching 4.mp3
shutil.copy(src, dst)
