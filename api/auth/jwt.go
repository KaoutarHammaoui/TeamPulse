package auth

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserID int    `json:"user_id"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

func GenerateToken(userID int,role string,secretKey []byte)(string,error){
	claims:=Claims{
		UserID: userID,
		Role: role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		
	}}
	token:=jwt.NewWithClaims(jwt.SigningMethodHS256,claims)
	return token.SignedString(secretKey)
}

func CheckToken(tokenString string, secretKey []byte)(*Claims,error){
	claims:=&Claims{}
	tok, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		if _,ok:=token.Method.(*jwt.SigningMethodHMAC); !ok{
			return nil, fmt.Errorf("unexpected signing method: %v",token.Header["alg"])
		}
		return secretKey, nil
	})

	if err != nil {
		return nil, err
	}

	if !tok.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	return claims, nil		
}