module.exports = class User {
  constructor(appDB) {
    this.db = appDB;
    this.db.run("CREATE TABLE IF NOT EXISTS userlogicworks (info TEXT)");
    //this.userID = userID;
  }

  //
  test() {
    // this.db;
    this.db.run("INSERT INTO userlogicworks VALUES ('user statement works')");
    //statement.finalize();
  }

  addUser(userData) {
    name = userData[0];
    location = userData[1];
    //  user name, village LOCATION name
    this.db.run(
      `INSERT OR IGNORE INTO users VALUES (NULL, '${name}', '${location}')`
    );
    //conn.commit()
    return "inserted";
  }
  delUser(userID) {
    this.db.run(`DELETE OR IGNORE users were VALUES ('${userID}')`);
    //conn.commit()
    return "inserted";
  }
  getHistory(userID) {
    // select library.fullPath history.track_id from history where user... LEFT JOIN library where track_id
    // Return ([1, "d:/a/b/c/track2"])
    // can use either todo a jquery dom lookup?
    // could iterate through nodes in python but I need to learn javascript gooder
    historyArr = [];
    arr = this.db.run(
      `SELECT track_id FROM history where user_id=${userID} ORDER BY track_id`
    );

    for (row in arr) {
      // print(row[0])
      historyArr.append(row[0]);
    }
    return historyArr;
    // TODO show user's track history
    /*
    arr = []
    for row in (historyArr){
      for row2 in c.execute('SELECT * FROM library where track_id='+ str(row[3])){
        rowData = [row2[0], row[1], row2[1], row2[3]]
        #id, date, name, type
        arr.append([rowData]) #0, 1, 3
      }
    }

    return (arr)
    */
  }
};
