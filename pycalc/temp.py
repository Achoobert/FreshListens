
trackID = c.execute('''SELECT library.track_id, directories.dir_id from library l INNER JOIN directories d ON d.dir_id = l.dir_id;''');
  # l (01), d(01)
  # l (02), d(01)
  # what if we had (dir.parent_id, dir.label, library.track_id)
# [1l,1d]
# [2l,1d]

from anytree import NodeMixin, RenderTree
# class anytree.node.node.Node(name, parent=None, children=None, **kwargs)
# can I edit an existing node to have more children???

### start pysudo code ###
class libNode(NodeMixin):  # create new class with Node feature
    def __init__(self, displayLabel, fullpath, db_id=None, parent=None, children=None):
        super(libNode, self).__init__()
        self.displayLabel = displayLabel   # what the User sees
        self.name = fullpath               # "d:/root/child" unique 'id'
        if db_id:
            self.db_id = db_id                 # dir_id or lib_id
        self.parent = parent               # parent dir_id
        if children:
            self.children = children       # howto both Dir and Track ???
#Construction via parent:
my0 = libNode('root', '/')
loc1 = libNode('loc', 'd:/abc/loc',  parent='/')
loc2 = libNode('loc2', 'd:/xyz/loc2', parent='/')
dir1 = libNode('1child1', 'd:/xyz/loc2/1child1', db_id=11, parent='d:/xyz/loc2')
dir2 = libNode('2child2', 'd:/xyz/loc2/2child2', db_id=2, parent='d:/xyz/loc2')
file1 = libNode('song', 'd:/xyz/loc2/1child1/song', db_id=11, parent='d:/xyz/loc2/1child1')
file2 = libNode('sermon', 'd:/xyz/loc2/2child2/sermon', db_id=2, parent='d:/xyz/loc2/2child2')

# process
# Create a dictionary to procedurally store node objects in
libTreeDict = {}

libTreeDict["ROOT"] = libNode("root", "/")
 # Build first layer, user selected library locations 
for row in c.execute('SELECT * FROM location'):
    # and in the loop use the name as key when you add your instance:
    libTreeDict[locationDir] = libNode(os.path.basename(row[1]), row[1], parent=root) # root is parent '/' ???
                                                                # locationDir ID is '/path'
 # Second layer, all directories with locations as possible parents
for row in c.execute('''select "name","fullPath", "parent_dir"  FROM directories'''):
    libTreeDict[(row[0]+ TODOId)] =  libNode(row[0], row[1], parent=row[2]) # parent is stored in dir database as '/path'
                                                                                # dir id is '/path/child'
 # End points, files. Directories or locations are possible parents
open.database(c.execute'''select library LEFT JOIN directories''')
    for (parentDir, file):
        libTreeDict[...] = libNode(fileLabel, myFullPath, db_id=lib_id, parent=dirParent) # parent is stored in dir database as '/path'
                                  # file id is 'lib_id' 


from anytree import AnyNode
from anytree.exporter import JsonExporter
def returnTree():
    exporter = JsonExporter(indent=2, sort_keys=True, ensure_ascii=False)
    return(exporter.export(root))
### end pysudo code ###



import json
from anytree import Node, RenderTree
c.execute('''CREATE TABLE IF NOT EXISTS tree(loc_id INTEGER PRIMARY KEY, location text )''')

def fileTreeInit():  # create a tree model of the directory system. fill files in with library ID
    # {./root, {[subDir,{[NULL]},[22,32]},[02,03,04]}
    # Update pathlist
    locations = getPathList()
    # pathList = ["D:\schubert.dev\Library Manager\Audioก\MUSIC\", "D:\schubert.dev\Library Manager\Audioก\Sermons"]
    # if null check
    if (pathList.__len__() == 0):
        return False
    # {./root, children:{subDir...},[02,03,04]}
    root = Node("root")
    tree = {}
    node = {}
    # r=root, d=directories, f = files
    # make an array of ID's not found, remove them
    # TODO force unicode???
    try:
        for library_loc in locations:
            root = Node(os.path.basename(library_loc))
            # each iteration makes a node. Have to set parent in each node
            for r, d, f in os.walk(Path(library_loc, topdown = True)):
                # parent
                parent = os.path.dirname(r)
                # where i am now
                currentDir = os.path.basename(r)
                
                for fn in d:
                    node.append([
                        (os.path.basename(fn)), #name
                        (os.path.dirname(fn)), #get parent???? is it possibvle?
                    ])
                for fn in f:
                    trackID = c.execute("SELECT track_id from library WHERE (name == '{0}' AND location == '{1}')".format(*fn))
                    node.append([
                        (os.path.splitext(fn)[0]), 
                        (os.path.splitext(fn)[1]), 
                        trackID
                    ])
                dirs.append(node)
                
        for d in dirs:
            # print(f)
            # TODO check if this is 'ignore', only execute update in that case
            c.execute(
                # track_id, name, location, type, size
                # null       0         1       2      3       4      
                # track_id,name , location , type , size , checked 
                "INSERT OR IGNORE INTO locations VALUES (null,'{0}','{1}','{2}',{3},{4})".format(*d))
            jsonObject.toString()
            c.execute(
                "UPDATE locations SET checked = 1 WHERE (name == '"+ str(d[0])+"' AND location == '"+ str(d[1]) +"')")
        conn.commit()
        return True
    except Exception as e:
        if hasattr(e, 'message'):
            return(getattr(e, 'message', str(e)))
        else:
            return(e)
def getFileTree():
    arr = []
    for row in c.execute('SELECT * FROM library ORDER BY track_id'):
        #print([row[0], row[1], 'location', row[3], row[4]])
        arr.append([row[0], row[1], row[3], row[4]])
    #c.execute('SELECT * FROM users ORDER BY user_id')
    return arr