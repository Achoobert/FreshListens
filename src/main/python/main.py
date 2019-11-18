from fbs_runtime.application_context.PyQt5 import ApplicationContext
from PyQt5.QtCore import *
from PyQt5.Qt import *
from PyQt5.QtGui import *
from PyQt5 import QtGui
from PyQt5.QtWidgets import *
from app import *

import sys


class TestListView(QListWidget):
    dropped = pyqtSignal(list)

    def __init__(self, type, parent=None):
        super(TestListView, self).__init__(parent)
        self.setAcceptDrops(True)
        #self.setIconSize(QSize(72, 72))
        #
        #self.assetList = QListView(self)
        self.clicked.connect(self.on_view_clicked)

    def dragEnterEvent(self, event):
        if event.mimeData().hasUrls:
            event.accept()
        else:
            event.ignore()

    def dragMoveEvent(self, event):
        if event.mimeData().hasUrls:
            event.setDropAction(Qt.CopyAction)
            event.accept()
        else:
            event.ignore()

    def dropEvent(self, event):
        if event.mimeData().hasUrls:
            event.setDropAction(Qt.CopyAction)
            event.accept()
            links = []
            for url in event.mimeData().urls():
                links.append(str(url.toLocalFile()))
            self.dropped.emit(links)
        else:
            event.ignore()

    @pyqtSlot(QModelIndex)
    def on_view_clicked(self, index):
        # TODO selecting item logic
        print((index.row()))


class MainForm(QMainWindow):
    def __init__(self, parent=None):
        super(MainForm, self).__init__(parent)

        self.view = TestListView(self)
        self.view.dropped.connect(self.pictureDropped)
        self.setCentralWidget(self.view)

    def pictureDropped(self, l):
        for url in l:
            if os.path.exists(url):
                print(url)
                icon = QIcon(url)
                pixmap = icon.pixmap(72, 72)
                icon = QIcon(pixmap)
                item = QListWidgetItem(url, self.view)
                item.setIcon(icon)
                item.setStatusTip(url)


# TODO get user's ID when clicking on table
# TODO get USER's history, combine with library to show DONE tracks
# TODO order tracks by folder (Tab?)
# TODO implement drive selection
# TODO implement file selection
# TODO implement file total size-ing
# TODO implement file ordering
# TODO implement file sending
# TODO implement disk unmount
if __name__ == '__main__':
    libArr = getLibrary()
    userArr = getUsers()
    appctxt = ApplicationContext()       # 1. Instantiate ApplicationContext
    window = QMainWindow()
    window.resize(250, 150)

    #app = QApplication([])
    ##### user layout #####
    userView = QWidget()
    userLayout = QVBoxLayout()

    def userTable():
        # establish height of table
        table = QTableWidget(len(userArr), 4)
        getPostsThread(table)
        table.add_post.emit(self.scroll,
                            SIGNAL("itemClicked(QTableWidgetItem *)"),
                            self.updateMore
                            )
        # headers
        table.setHorizontalHeaderLabels(['ID', 'Person', 'Place', '❌'])
        # put users into table
        table.setStyleSheet("QTableWidget{ background-color: lightgray;}")
        for i, user in enumerate(userArr):
            table.setItem(i, 0, QTableWidgetItem(str(user[0])))  # id
            table.setItem(i, 1, QTableWidgetItem(user[1]))  # name
            table.setItem(i, 2, QTableWidgetItem(user[2]))  # loc
            table.setItem(i, 3, QTableWidgetItem('❌'))

        return table

    def userList():
        # establish height of table
        listView = QListWidget
        listView = TestListView(listView)
        for i, user in enumerate(userArr):
            listView.insertItem(i, QListWidgetItem(
                (user[1] + ", " + user[2]), listView))  # name + village
        return listView
    # add listView to layout
    userLayout.addWidget(userList())

    lib_button = QPushButton('Library')

    def on_goLib_clicked():
        mainStack.setCurrentIndex(1)
        update_label(labelSelectedUser, "John shmoth")
    lib_button.clicked.connect(on_goLib_clicked)
    userLayout.addWidget(lib_button)

    userLayout.addWidget(QPushButton('Add User'))
    userView.setLayout(userLayout)
    ##### END user Layout #####

    ##### Library Layout #####
    libraryView = QWidget()
    libraryLayout = QVBoxLayout()

    def update_label(self, user):
        self.update = label_update(self, user)

    def label_update(obj, user):  # obj is the object self
        obj.setText(user)
    labelSelectedUser = QLabel()
    labelSelectedUser.setText("no User selected")
    libraryLayout.addWidget(labelSelectedUser)

    def libTable():
        # establish height of table
        table = QTableWidget(len(libArr), 4)
        # headers
        table.setHorizontalHeaderLabels(['ID', 'Name', 'Size', '❌'])
        # put users into table
        for i, track in enumerate(libArr):
            table.setItem(i, 0, QTableWidgetItem(str(track[0])))  # id
            table.setItem(i, 1, QTableWidgetItem(track[1]))  # name
            table.setItem(i, 2, QTableWidgetItem(
                (str(int(track[4]*1e-6)) + " MB")))  # size to MB
            table.setItem(i, 3, QTableWidgetItem('❌'))
        return table
    # add table to layout
    libraryLayout.addWidget(libTable())

    user_button = QPushButton('Back to Users')

    def on_goUserList_clicked():
        mainStack.setCurrentIndex(0)
    user_button.clicked.connect(on_goUserList_clicked)
    libraryLayout.addWidget(user_button)

    libraryLayout.addWidget(QPushButton('Refresh Tracks'))
    libraryView.setLayout(libraryLayout)
    ##### END Library #####

    #### stack the views ####
    mainStack = QStackedWidget()
    mainStack.addWidget(userView)
    mainStack.addWidget(libraryView)
    ###### views END #######

    mainLayout = QVBoxLayout()
    mainLayout.addWidget(mainStack)
    switchWindow = QWidget()
    switchWindow.resize(500, 300)
    switchWindow.setLayout(mainLayout)
    switchWindow.show()
    ####################################
    # app = QApplication([])
    # button = QPushButton('Click')
    # def on_button_clicked():
    #    alert = QMessageBox()
    #    alert.setText('You clicked the button!')
    #    alert.exec_()

    # button.clicked.connect(on_button_clicked)
    # button.show()
    ##################################

    # app.exec_() #can't use while testing in powershell

    exit_code = appctxt.app.exec_()      # 2. Invoke appctxt.app.exec_()
    conn.close()
    sys.exit(exit_code)
