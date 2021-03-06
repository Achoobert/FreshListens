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
                return("api works but cannot init " + (getattr(e, 'message', str(e))))
            else:
                return(e)
    def addUser(self,userData):
        """based on the input text, return the int result"""
        try:
            return app.addUser(userData)
        except Exception as e:
            return e
            if hasattr(e, 'message'):
                return("api works but cannot get library " + (getattr(e, 'message', str(e))))
            else:
                return e
    def addLibraryPath(self, newPath):
        """Return list of drives"""
        try:
            return app.addLibraryPath(newPath)
        except Exception as e:
            if hasattr(e, 'message'):
                return("cannot " + (getattr(e, 'message', str(e))))
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
        #return [1]
        try:
            return app.getHistory(userID)
        except Exception as e:
            print(e)
            return (e)
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
            if hasattr(e, 'message'):
                return("api works but cannot get library " + (getattr(e, 'message', str(e))))
            else:
                return(e)  
    def getPathList(self):
        """Return list of sources"""
        try:
            return app.getPathList()
        except Exception as e:
            return (str(e))          
    def sendFiles(self, dataArr):        
        """based on the input text, return the int result"""
        try:
            # toSend, currentUser, selectedDrive
            return app.sendFiles(dataArr)
        except Exception as e:
            return (str(e))
    def libraryDatabaseRecheck(self):
        """library Database Rechecker"""
        try:
            return app.libraryDatabaseRecheck()
        except Exception as e:
            return (e)
    def libraryDatabaseNew(self, newPath):
        """library Database new updater"""
        try:
            return app.libraryDatabaseNew(newPath)
        except Exception as e:
            return (e)

            
def parse_port():
    return 4242

def main():
    #Api.appInit({})
    # TODO how to only update the app
    app.appInit()
    addr = 'tcp://127.0.0.1:' + str(parse_port())
    # set timeout here...
    s = zerorpc.Server(Api(), heartbeat=None)
    s.bind(addr)
    print('start running on {}'.format(addr))
    print (Api.echo({}, "only prints if app is working "))
    s.run()

def testMain():
    Api.appInit({})
    print (Api.echo({}, "only prints if app is working "))
    return True

def testZerorpc():
    addr = 'tcp://127.0.0.1:4242'
    s = zerorpc.Server(Api())
    s.bind(addr)
    print('start running on {}'.format(addr))
    print (Api.echo({}, "only prints if app is working "))
    s.run()
    s.exit()
    return True

if __name__ == '__main__':
    main()
