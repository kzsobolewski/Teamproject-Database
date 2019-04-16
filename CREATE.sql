DROP TABLE Logs;
DROP TABLE Devices;

-- Table: Devices
CREATE TABLE Devices (
    Device_id integer NOT NULL CONSTRAINT Devices_pk PRIMARY KEY AUTOINCREMENT UNIQUE,
    Type text NOT NULL,
    Name text NOT NULL UNIQUE,
    State_Value real NOT NULL,
    Port integer NOT NULL UNIQUE
);

-- Table: Logs
CREATE TABLE Logs (
    Log_id integer NOT NULL CONSTRAINT Logs_pk PRIMARY KEY AUTOINCREMENT UNIQUE,
    Time text NOT NULL,
    Content blob NOT NULL,
    Devices_Device_Id integer NOT NULL,
    CONSTRAINT Logs_Devices FOREIGN KEY (Devices_Device_Id)
    REFERENCES Devices (Device_id)
);

-- Insertion examples

INSERT INTO Devices (Type, Name, State_Value, Port)
VALUES ('out','diode_1', "0", "5");

INSERT INTO Logs(Time, Content, Devices_Device_Id)
VALUES(datetime('now', '+2 hours'),'201: Working fine, no worries', 7);


