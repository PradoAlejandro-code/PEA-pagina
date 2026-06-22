package domain

type Registro struct {
	ID       int    `grom:"primaryKey" json:"id"`
	Orden    int    `gorm:"unique" json:"orden"`
	Nombre   string `json:"nombre"`
	Apellido string `json:"apellido"`
	DNI      string `json:"dni"`
	Voto     bool   `json:"voto"`
}
