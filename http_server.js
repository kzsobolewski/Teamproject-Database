var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database("my.db");
 

db.serialize(function() {
    var stmt = db.prepare("INSERT INTO lorem VALUES (?)", (err) => {
        if(err)
            console.log(err);
    }); 
    
    stmt.run("test");
    stmt.finalize();
});

console.log("done");
db.close();



// db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
//     if(err){
//         console.log(err);
//         return
//     }   
//    console.log(row.id + ": " + row.info);
// });

