from fbs_runtime.application_context.PyQt5 import ApplicationContext
from PyQt5.QtCore import Qt
from PyQt5.QtWidgets import *
from app import *

import sys

if __name__ == '__main__':
    appctxt = ApplicationContext()       # 1. Instantiate ApplicationContext
   # window = QMainWindow()
   # window.resize(250, 150)
   # window.show()

    #label = QLabel('Hello World!')
    # label.show()

    #app = QApplication([])
    window = QWidget()
    userLayout = QVBoxLayout()


    
    ##### user layout #####
    userArr = getUsers()
    # establish height of table
    userTable = QTableWidget(len(userArr), 4)
    # headers
    userTable.setHorizontalHeaderLabels(['ID', 'Person', 'Place','❌'])
    # put users into table
    for i, user in enumerate(userArr):
        userTable.setItem(i, 0, QTableWidgetItem(str(user[0]))) #id
        userTable.setItem(i, 1, QTableWidgetItem(user[1])) #name 
        userTable.setItem(i, 2, QTableWidgetItem(user[2])) #loc
        userTable.setItem(i, 3, QTableWidgetItem('❌'))
    # add table to layout
    userLayout.addWidget(userTable)

    userLayout.addWidget(QPushButton('Library'))
    userLayout.addWidget(QPushButton('Add User'))
    window.setLayout(userLayout)
    window.resize(500, 250)
    window.show()
    ##### END user Layout #####

    ##### Library Layout #####
    libraryWindow = QWidget()
    libraryLayout = QVBoxLayout()
    libArr = getLibrary()
    # establish height of table
    libTable = QTableWidget(len(libArr), 4)
    # headers
    libTable.setHorizontalHeaderLabels(['ID', 'Name', 'Place','❌'])
    # put users into table
    for i, track in enumerate(libArr):
        libTable.setItem(i, 0, QTableWidgetItem(str(track[0]))) #id
        libTable.setItem(i, 1, QTableWidgetItem(track[1])) #name 
        libTable.setItem(i, 2, QTableWidgetItem(track[2])) #loc
        libTable.setItem(i, 3, QTableWidgetItem('❌'))
    # add table to layout
    libraryLayout.addWidget(libTable)

    libraryLayout.addWidget(QPushButton('Back to Users'))
    libraryLayout.addWidget(QPushButton('Refresh Tracks'))
    libraryWindow.setLayout(libraryLayout)
    libraryWindow.resize(500, 250)
    libraryWindow.show()
    ##### END Library #####



    # app.exec_() #can't use while testing in powershell

    exit_code = appctxt.app.exec_()      # 2. Invoke appctxt.app.exec_()
    conn.close()
    sys.exit(exit_code)
