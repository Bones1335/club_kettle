package main

import (
	"fmt"
	"net/http"
)

func handlerReadiness(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Content-Type", "plain/text, charset=utf-8")
	w.WriteHeader(http.StatusOK)
	text := fmt.Sprintf("%v\n", http.StatusText(http.StatusOK))
	w.Write([]byte(text))
}
