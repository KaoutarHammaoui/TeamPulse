package db

import (
	"database/sql"
	_ "modernc.org/sqlite"
)
func Connect(path string)(*sql.DB,error){
	//open just initializes a connection pool configuration without validationg the network connectionl
	db,err:=sql.Open("sqlite",path)
	if err!=nil{
		return nil,err
	}
	//2 verify that db coonnection is alive and it accepts traffic
	if err:=db.Ping();err!=nil{ 
		return  nil,err
	}
	return db,nil
}