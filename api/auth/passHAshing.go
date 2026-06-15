package auth

import "golang.org/x/crypto/bcrypt"

func HashPassword(pass string) ([]byte, error) {
	passwordBytes := []byte(pass)
	generated, err := bcrypt.GenerateFromPassword(passwordBytes, bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	return generated, nil
}