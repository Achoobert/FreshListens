from fbs_runtime.application_context.PyQt5 import ApplicationContext
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
    layout = QVBoxLayout()

    libTable = QTableWidget(2, 3)

    userArr = getUsers()
    print(userArr)
    #libTable.setItem(row, column, newItem)
    libTable: : setItem(1, 1, userArr[0])
    libTable.setItem(1, 2, userArr[1])
    libTable.setHorizontalHeaderLabels(['a', 'b', '❌'])
    # put users into table

    layout.addWidget(libTable)

    layout.addWidget(QPushButton('Top'))
    layout.addWidget(QPushButton('Bottom'))
    window.setLayout(layout)
    window.resize(500, 250)
    window.show()
    # app.exec_() #can't use while testing in powershell

    exit_code = appctxt.app.exec_()      # 2. Invoke appctxt.app.exec_()
    conn.close()
    sys.exit(exit_code)
