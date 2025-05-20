package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"
)

type User struct {
	HumanUser                   string
	CreateDate                  time.Time
	PasswordChangedDate         time.Time
	DaysSinceLastPasswordChange int
	LastAccessDate              time.Time
	DaysSinceLastAccess         int
	MFAEnabled                  bool
}
type ResponseUser struct {
	User
	PasswordExpired bool
	Inactive        bool
}

var users = []User{
	{
		HumanUser:           "alice@example.com",
		CreateDate:          time.Now().AddDate(-1, 0, -10),
		PasswordChangedDate: time.Now().AddDate(-2, 0, 0),
		LastAccessDate:      time.Now().AddDate(0, -4, 0),
		MFAEnabled:          true,
	},
	{
		HumanUser:           "bob@example.com",
		CreateDate:          time.Now().AddDate(0, -6, 0),
		PasswordChangedDate: time.Now().AddDate(0, 0, -30),
		LastAccessDate:      time.Now().AddDate(0, 0, -10),
		MFAEnabled:          false,
	},
	{
		HumanUser:           "carol@example.com",
		CreateDate:          time.Now().AddDate(0, -3, 0),
		PasswordChangedDate: time.Now().AddDate(0, -1, 0),
		LastAccessDate:      time.Now().AddDate(0, 0, -100),
		MFAEnabled:          true,
	},
}

var NowFunc = time.Now

func usersHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Content-Type", "application/json")
	now := NowFunc()
	resp := make([]ResponseUser, 0, len(users))
	for _, u := range users {
		daysPwd := int(now.Sub(u.PasswordChangedDate).Hours() / 24)
		daysAcc := int(now.Sub(u.LastAccessDate).Hours() / 24)
		u.DaysSinceLastPasswordChange = daysPwd
		u.DaysSinceLastAccess = daysAcc
		expired := daysPwd > 365
		inactive := daysAcc > 90

		resp = append(resp, ResponseUser{
			User:            u,
			PasswordExpired: expired,
			Inactive:        inactive,
		})
	}

	if err := json.NewEncoder(w).Encode(resp); err != nil {
		log.Printf("error encoding users: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
	}
}

func main() {
	http.HandleFunc("/api/users", usersHandler)
	log.Println("Server starting on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
