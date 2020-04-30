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
            return (str(e))
    def getUsers(self):
        """based on the input text, return the int result"""
        try:
            return getUsers()
        except Exception as e:
            return (str(e))
    def getHistory(self, userID):
        """based on the input text, return the int result"""
        try:
            return getHistory(userID)
        except Exception as e:
            return (str(e))
    def getDrives(self):
        """based on the input text, return the int result"""
        try:
            return getDrives()
        except Exception as e:
            return (str(e))
    def getLibrary(self):
        """based on the input text, return the int result"""
        try:
            return getLibrary()
        except Exception as e:
            return (str(e))
    def sendFiles(self, dataArr):        
        """based on the input text, return the int result"""
        try:
            # toSend, currentUser, selectedDrive
            return sendFiles(dataArr)
        except Exception as e:
            return (str(e))
    def addUser(self,userData):
        """based on the input text, return the int result"""
        try:
            return addUser(userData)
        except Exception as e:
            return "error not inserted"
    def get_drive_info(self):
        """Return list of drives"""
        try:
            return get_drive_info()
        except Exception as e:
            return (str(e))
    def addLibraryPath(self, newPath):
        """Return list of drives"""
        try:
            return addLibraryPath(newPath)
        except Exception as e:
            return (str(e))
    def getPathList(self):
        """Return list of drives"""
        try:
            return getPathList()
        except Exception as e:
            return (str(e))
    def libraryDatabaseInit(self):
        """Return list of drives"""
        try:
            return libraryDatabaseInit()
        except Exception as e:
            return (str(e))
            

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