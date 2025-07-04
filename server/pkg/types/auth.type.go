package types

type SignupPayload struct {
	Username string
	Email    string
	Password string
}

type AuthResponse struct {
	Data   interface{}
	Status int32
	OK     bool
}
