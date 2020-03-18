from __future__ import print_function
# import 'logic' files here here
from calc import calc as real_calc
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
            return 0.0
    def getDrives(self):
        """based on the input text, return the int result"""
        try:
            return getDrives()
        except Exception as e:
            return 0.0
    def getLibrary(self):
        """based on the input text, return the int result"""
        try:
            return getLibrary()
        except Exception as e:
            return 0.0
    def sendTracks(self, userID):        
        """based on the input text, return the int result"""
        try:
            return sendTracks(userID)
        except Exception as e:
            return 0.0
    def newUser(self,userData):
        """based on the input text, return the int result"""
        try:
            return (userData)
        except Exception as e:
            return "error not inserted"
    def echo(self, text):
        """echo any text"""
        return text
    def helloWorld(self):
        """echo any text"""
        return ("text+text2")

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