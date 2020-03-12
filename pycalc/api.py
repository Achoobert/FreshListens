from __future__ import print_function
from calc import calc as real_calc
from app import getLibrary as getLibrary
from app import getUsers as getUsers
import sys
import zerorpc


#calc
class Api(object):
    def getLibrary(self):
        """based on the input text, return the int result"""
        try:
            return getLibrary()
        except Exception as e:
            return 0.0
    def getUsers(self):
        """based on the input text, return the int result"""
        try:
            return getUsers()
        except Exception as e:
            return 0.0
    def calc(self, text):
        """based on the input text, return the int result"""
        try:
            return real_calc(text)
        except Exception as e:
            return 0.0
    def echo(self, text):
        """echo any text"""
        return text
    def helloworld(self, text):
        """echo any text"""
        return "helloworld"

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