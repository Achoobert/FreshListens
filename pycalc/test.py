import os
import unittest
# When testing I can't just import these, 
# Because I have on-run methods that trigger...
# Need to import functions as I need them 
import app
#app.checkDatabase()
from api import Api
from api import parse_port
from api import testMain
from api import testZerorpc

# TODO Need to mock "c.execute"
# Mock an item where it is used, not where it came from.

class ApiTest(unittest.TestCase):
    # api knows its port
    def test_parse_port(self):
        self.assertEqual(parse_port(), 4242)

    # Api can bounce an echo off App
    def test_Echo(self):
        self.assertEqual(Api.echo(self, 'Hello there. General Kenobi!'),'Hello there. General Kenobi! .. version')

    def test_Api_Init(self):
        self.assertEqual(testMain(),True)

    #def test_get_Library(self):
    #    print (Api.libraryDatabaseInit(self))
    #    self.assertEqual(Api.libraryDatabaseInit(self),True)

    def test_get_Library(self):
        self.assertEqual(Api.getLibrary(self),True)

    #def test_Api_Zerorpc(self):
    #    self.assertEqual(testZerorpc(),True)

class TestAppSetup(unittest.TestCase):
    # App cannot setup Databases, no locations
    def test_app_check_database(self):
        self.assertEqual(app.checkDatabase(), True)

    # getPathList() returns null
    def test_app_initiate_library(self):
        self.assertEqual(app.libraryDatabaseInit(), True)

    # App can setup Databases
    def test_app_check_database(self):
        # app.addLibraryPath("D:\schubert.dev\Library Manager\Audioก")
        self.assertEqual(app.checkDatabase(), True)
    
    #def test_dir_insert(self):
    #    app.dirInsert(('songs'), ('d:/mylibrary/audio'), ('d:/mylibrary/audio/songs'))

	#@mock.patch('Library is Initiated')
    def test_app_initiate_library(self):
        self.assertEqual(app.libraryDatabaseInit(), True)

    #from app import treeBuilder
    def test_tree_Builder(self):
        print(app.treeBuilder())
        #self.assertEqual(app.treeBuilder(), True)

    # from app import libNode
    # def test_jsonBuilder(self):
    #     #let testTree = New app.libNode()
    #     from anytree import NodeMixin, RenderTree
    #     class libNode(NodeMixin):  # create new class with Node feature
    #         def __init__(self, displayLabel, fullpath, parent=None, track_id=None, children=None):
    #             super(libNode, self).__init__()
    #             self.displayLabel = displayLabel   # what the User sees
    #             self.name = fullpath               # "d:/root/child" unique 'id'
    #             if track_id:
    #                 self.track_id = track_id           # lib_id
    #             self.parent = parent               # parent full path
    #             if children:
    #                 self.children = children       # possible both Dir and Track ???
    #     libTreeDict = {}
    #     libTreeDict[('myRoot')] = libNode('root', '/')
    #     libTreeDict[('d:/abc/loc')] = libNode('loc', 'd:/abc/loc',  parent=libTreeDict[('myRoot')])
    #     libTreeDict[('d:/xyz/loc2')] = libNode('loc2', 'd:/xyz/loc2', parent=libTreeDict[('myRoot')])
    #     libTreeDict[('d:/xyz/loc2/1child1')] = libNode('1child1', 'd:/xyz/loc2/1child1', track_id=11, parent=libTreeDict[('d:/xyz/loc2')])
    #     libTreeDict[('d:/xyz/loc2/2child2')] = libNode('2child2', 'd:/xyz/loc2/2child2', track_id=2, parent=libTreeDict[('d:/xyz/loc2')])
    #     libTreeDict[('file1')] = libNode('song', 'd:/xyz/loc2/1child1/song', track_id=11, parent=libTreeDict[('d:/xyz/loc2/1child1')])
    #     libTreeDict[('file2')] = libNode('sermon', 'd:/xyz/loc2/2child2/sermon', track_id=2, parent=libTreeDict[('d:/xyz/loc2/2child2')])
    #     return ((libTreeDict[('myRoot')]))
        # self.assertEqual(app.returnJsonTree((libTreeDict[('myRoot')])), True)

# class TestStringMethods(unittest.TestCase):

#     def test_upper(self):
#         self.assertEqual('foo'.upper(), 'FOO')

#     def test_isupper(self):
#         self.assertTrue('FOO'.isupper())
#         self.assertFalse('Foo'.isupper())

#     def test_split(self):
#         s = 'hello world'
#         self.assertEqual(s.split(), ['hello', 'world'])
#         # check that s.split fails when the separator is not a string
#         with self.assertRaises(TypeError):
#             s.split(2)
#     @unittest.skipUnless(sys.platform.startswith("win"), "requires Windows")
#     def test_windows_support(self):
#         # windows specific testing code
#         pass

#     def test_maybe_skipped(self):
#         if not external_resource_available():
#             self.skipTest("external resource not available")
#         # test code that depends on the external resource
#         pass

if __name__ == '__main__':
    unittest.main()
