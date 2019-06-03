var sqlite3 = require('sqlite3').verbose();
var db;

function connect(db_name){
db =  new sqlite3.Database(db_name, err => {
    if (err)
        return console.log(err.message);
    console.log("Connected to DB");
});
}

function getDevices(fn) {
    db.each("SELECT * FROM Devices", (err, row) => {
        // if SQL gives error json is modified
        if (err) {
            var errorJson =
            {
                data: err.message,
                type: "ERROR"
            };
            return fn(errorJson);
        }
        return fn(row);
    });
};



function deleteDevice(json, fn) {
    db.run(
        'DELETE FROM Devices WHERE id_device = ? AND title = ?',
        json["data"]["id_device"], json["data"]["title"], (err) => {
            if (err) {
                var errorJson =
                {
                    data: err.message,
                    type: "ERROR"
                };
                return fn(errorJson);
            }
            console.log('Device deleted.');
            return fn(json);
        });
};


function createDevice(json, fn) {
    db.run(
        `INSERT INTO Devices (type, title, value, port)
        VALUES (?,?, ?, ?)`,
        json["data"]["type"], json["data"]["title"],
        json["data"]["value"], json["data"]["port"],
        (err) => {
            if (err) {
                var errorJson =
                {
                    data: err.message,
                    type: "ERROR"
                };
                return fn(errorJson);
            }
            console.log('Device added.');
            return fn(json);
        });
}


function updateDevice(json, fn) {
    db.run(
        `UPDATE Devices SET type = ?, title=?, value=?, port=? 
        where id_device =?`,
        json["data"]["type"], json["data"]["title"],
        json["data"]["value"], json["data"]["port"],
        json["data"]["id_device"],
        (err) => {
            if (err) {
                var errorJson =
                {
                    data: err.message,
                    type: "ERROR"
                };
                return fn(errorJson);
            }
            console.log('Device updated.');
            addLog(json["data"]["id_device"], `Device updated: new value: ` + json["data"]["value"] );
            return fn(json);
        });
}

function close() {
    db.close();
}

// add new log ( value is the log message)
function addLog(id_device, value){
    db.run(
        `INSERT INTO Logs (time, value, id_device)
        VALUES ( datetime('now', '+2 hours'), ? , ?)`,
        value, id_device,
        (err) => {
            if (err) {
                console.log('Log DB error: ' + err);
                return;
            }
            console.log('Log added.');
        });
}



function getDeviceLogs(id_device, fn){
    db.each("SELECT * FROM Logs Where id_device = ?",id_device, (err, row) => {
        if(err){
            console.log("Log db error:"+ err);
            return
        }
        return fn(row);
    });
};

function getAllLogs( fn){
    db.each("SELECT * FROM Logs", (err, row) => {
        if(err){
            console.log("Log db error:"+ err);
            return;
        }
        return fn(row);
    });
};

// exporting functions 
module.exports = {
    connect:connect,
    getDevices: getDevices,
    createDevice: createDevice,
    deleteDevice: deleteDevice,
    updateDevice: updateDevice,
    addLog:addLog,
    getDeviceLogs:getDeviceLogs,
    getAllLogs:getAllLogs,
    close: close
}

