from __future__ import print_function
# import 'logic' files here here
# from calc import calc as real_calc
import app
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
    def appInit(self):
        """send any text to app.py to get echoed"""
        try:
            app.appInit()
        except Exception as e:
            if hasattr(e, 'message'):
                return("api works but " + (getattr(e, 'message', str(e))))
            else:
                return(e)
    def echo(self, text):
        """send any text to app.py to get echoed"""
        try:
            return app.echo(text + " .. version")
        except Exception as e:
            if hasattr(e, 'message'):
                return("api works" + (getattr(e, 'message', str(e))))
            else:
                return(e)
    def getUsers(self):
        """based on the input text, return the int result"""
        try:
            return app.getUsers()
        except Exception as e:
            return (str(e))
    def getHistory(self, userID):
        """based on the input text, return the int result"""
        try:
            return app.getHistory(userID)
        except Exception as e:
            return (str(e))
    def getDrives(self):
        """based on the input text, return the int result"""
        try:
            return app.getDrives()
        except Exception as e:
            return (str(e))
    def getLibrary(self):
        """based on the input text, return the int result"""
        try:
            return app.getLibrary()
        except Exception as e:
            return (str(e))
    def sendFiles(self, dataArr):        
        """based on the input text, return the int result"""
        try:
            # toSend, currentUser, selectedDrive
            return app.sendFiles(dataArr)
        except Exception as e:
            return (str(e))
    def addUser(self,userData):
        """based on the input text, return the int result"""
        try:
            return app.addUser(userData)
        except Exception as e:
            return "error not inserted"
    def get_drive_info(self):
        """Return list of drives"""
        try:
            return app.get_drive_info()
        except Exception as e:
            return (str(e))
    def addLibraryPath(self, newPath):
        """Return list of drives"""
        try:
            return app.addLibraryPath(newPath)
        except Exception as e:
            return (str(e))
    def getPathList(self):
        """Return list of drives"""
        try:
            return app.getPathList()
        except Exception as e:
            return (str(e))
    def libraryDatabaseInit(self):
        """Return list of drives"""
        try:
            return app.libraryDatabaseInit()
        except Exception as e:
            return (str(e))
            

def parse_port():
    return 4242


def main():
    Api.appInit({})
    addr = 'tcp://127.0.0.1:' + str(parse_port())
    s = zerorpc.Server(Api())
    s.bind(addr)
    print('start running on {}'.format(addr))
    print (Api.echo({}, "only prints if app is working "))
    s.run()

if __name__ == '__main__':
    main()
