import unittest
# When testing I can't just import these, 
# Because I have on-run methods that trigger...
# Need to import functions as I need them 
import app
from api import Api
from api import parse_port

# TODO Need to mock "c.execute"
# Mock an item where it is used, not where it came from.

class ApiTest(unittest.TestCase):
    # api knows its port
    def test_parse_port(self):
        self.assertEqual(parse_port(), 4242)

    # Api can bounce an echo off App
    def test_Echo(self):
        self.assertEqual(Api.echo(self, 'Hello there. General Kenobi!'),'Hello there. General Kenobi! .. version')

class TestAppSetup(unittest.TestCase):
    # App can setup Databases
    def test_app_check_database(self):
        self.assertEqual(app.checkDatabase(), False)
        
    # getPathList() returns null
    def test_app_initiate_library(self):
        self.assertEqual(app.libraryDatabaseInit(), True)

	#@mock.patch('Library is Initiated')
    def test_app_initiate_library(self):
        self.assertEqual(app.libraryDatabaseInit(), True)

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
