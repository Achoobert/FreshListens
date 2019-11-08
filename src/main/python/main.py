from fbs_runtime.application_context.PyQt5 import ApplicationContext
from PyQt5.QtCore import Qt
from PyQt5.QtWidgets import *
from app import *

import sys

if __name__ == '__main__':
    libArr = getLibrary()
    userArr = getUsers()
    appctxt = ApplicationContext()       # 1. Instantiate ApplicationContext
   # window = QMainWindow()
   # window.resize(250, 150)
   # window.show()

    #app = QApplication([])
        
    ##### user layout #####
    userWindow = QWidget()
    userLayout = QVBoxLayout()
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

    lib_button = QPushButton('Library')
    def on_goLib_clicked():
        libraryWindow.show()
    lib_button.clicked.connect(on_goLib_clicked)
    userLayout.addWidget(lib_button)


    userLayout.addWidget(QPushButton('Add User'))
    userWindow.setLayout(userLayout)
    userWindow.resize(500, 250)
    userWindow.show()
    ##### END user Layout #####

    ##### Library Layout #####
    libraryWindow = QWidget()
    libraryLayout = QVBoxLayout()

    # establish height of table
    libTable = QTableWidget(len(libArr), 4)
    # headers
    libTable.setHorizontalHeaderLabels(['ID', 'Name', 'Size','❌'])
    # put users into table
    for i, track in enumerate(libArr):
        libTable.setItem(i, 0, QTableWidgetItem(str(track[0]))) # id
        libTable.setItem(i, 1, QTableWidgetItem(track[1])) # name 
        libTable.setItem(i, 2, QTableWidgetItem((str(int(track[4]*1e-6))+ " MB"))) # size to MB
        libTable.setItem(i, 3, QTableWidgetItem('❌'))
    # add table to layout
    libraryLayout.addWidget(libTable)

    user_button = QPushButton('Back to Users')
    def on_goUserList_clicked():
        userWindow.show()
    user_button.clicked.connect(on_goUserList_clicked)
    libraryLayout.addWidget(user_button)

    libraryLayout.addWidget(QPushButton('Refresh Tracks'))
    libraryWindow.setLayout(libraryLayout)
    libraryWindow.resize(500, 250)
    libraryWindow.show()
    ##### END Library #####

    ####################################
    app = QApplication([])
    button = QPushButton('Click')
    def on_button_clicked():
        alert = QMessageBox()
        alert.setText('You clicked the button!')
        alert.exec_()

    button.clicked.connect(on_button_clicked)
    button.show()
    ##################################


    # app.exec_() #can't use while testing in powershell

    exit_code = appctxt.app.exec_()      # 2. Invoke appctxt.app.exec_()
    conn.close()
    sys.exit(exit_code)
