package handlers

import (
	"auth/auth"
	"database/sql"
	"encoding/json"
	"net/http"
)

type LoginRequest struct{
	Email string `json:"email"`
	Password string `json:"password"`
}

type LoginResp struct{
	Token string `json:"token"`
}


func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request){
	//h  It turns a regular function into a method attached to the AuthHandler struct
	if r.Method!=http.MethodPost{
		http.Error(w,"method not allowed",405)
		return
	}
	body:=r.Body
	LoginR:=LoginRequest{}
	DecodeResp:=json.NewDecoder(body).Decode(&LoginR)

	if DecodeResp!=nil{
		http.Error(w,"error in decoding responde", 400)
		return
	}
	query:= `SELECT id,password_hash,role 
				FROM users WHERE email=?
	`
	var USerid int
	var UserRole string
	var Userpassword string
	err:=h.DB.QueryRow(query,LoginR.Email).Scan(&USerid,&Userpassword,&UserRole)
	if err == sql.ErrNoRows || err !=nil {
		http.Error(w,"error in getting users infos",400)
		return
	}
	ComparingPass:=auth.ComparePassword([]byte(Userpassword),LoginR.Password)

	if ComparingPass!=true {
		http.Error(w,"incorrect password",400)
		return
	}

	TokenGenerated,err:=auth.GenerateToken(USerid,UserRole,h.Secret)
	if err!=nil{
		http.Error(w,"error in generating error",400)
		return
	}
	w.Header().Set("Content-Type","application/json")
	w.WriteHeader(200) 
	json.NewEncoder(w).Encode(LoginResp{Token: TokenGenerated})

}
