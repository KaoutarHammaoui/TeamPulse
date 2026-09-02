package main

import (
	"auth/db"
	"log"
)

func main(){
	db,err:= db.Connect("../app.db")
	if err!=nil{
		log.Fatal(err)
		return
	}
	defer db.Close()
}