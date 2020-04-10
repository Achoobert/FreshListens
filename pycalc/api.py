from __future__ import print_function
# import 'logic' files here here
# from calc import calc as real_calc
from app import *
import sys
import zerorpc


#calc
class Api(object):
    # add python logic functions in here
    # callable directory on `server` 
    #   get all users w/ ids
    #   get a selected User history, list all tracks in history
    #   List available drives
    #   List library    
    #   Take track ids, os send to drive(store)
    #   Disconnect drive
    def echo(self, text):
        """send any text to app.py to get echoed"""
        try:
            return echo(text)
        except Exception as e:
            return ("app.py broken")
    def getUsers(self):
        """based on the input text, return the int result"""
        try:
            return getUsers()
        except Exception as e:
            return 0.0
    def getHistory(self, userID):
        """based on the input text, return the int result"""
        try:
            return getHistory(userID)
        except Exception as e:
            return ("history not working")
    def getDrives(self):
        """based on the input text, return the int result"""
        try:
            return getDrives()
        except Exception as e:
            return ("get drives is not responding")
    def getLibrary(self):
        """based on the input text, return the int result"""
        try:
            return getLibrary()
        except Exception as e:
            return 0.0
    def sendFiles(self, dataArr):        
        """based on the input text, return the int result"""
        try:
            # sendTracks, user_id, drive
            return sendFiles(dataArr)
            # TODO
        except Exception as e:
            return 0.0
    def newUser(self,userData):
        """based on the input text, return the int result"""
        try:
            return (userData)
        except Exception as e:
            return "error not inserted"
    def testInsert(self, user, track):
        """log File Received"""
        # userID, fileID
        try:
            return (user, track)
        except:
            return ("not working")
    def get_drive_info(self):
        """Return list of drives"""
        try:
            return get_drive_info()
        except:
            return ("drive info working")

def parse_port():
    return 4242


def main():
    addr = 'tcp://127.0.0.1:' + str(parse_port())
    s = zerorpc.Server(Api())
    s.bind(addr)
    print('start running on {}'.format(addr))
    s.run()

if __name__ == '__main__':
    main()