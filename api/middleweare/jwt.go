package middleweare

import (
	"auth/auth"
	"context"
	"net/http"
	"strings"
)

type contextKey string

const UserIDKey contextKey = "userID"
const RoleKey contextKey="role"

func AuthMiddleware(next http.Handler,secretKey []byte) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "error in header", http.StatusUnauthorized)
			return
		}
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w,"length is incorrect",401)
			return
		}
		checking,err := auth.CheckToken(parts[1],secretKey)
		if err!=nil{
			http.Error(w,"checked failed",401)
			return 
		}
		ctx:=context.WithValue(r.Context(),UserIDKey,checking.UserID)
		ctx=context.WithValue(ctx,RoleKey,checking.Role)
		r=r.WithContext(ctx)
		
		next.ServeHTTP(w,r)
	})
}
