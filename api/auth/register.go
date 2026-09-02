package auth

import "net/http"

func createUser(w http.ResponseWriter, r *http.Request) {
	if r.Method!=http.MethodPost{
		http.Error(w,"not valid method",http.StatusMethodNotAllowed)
		return
	}
	
}