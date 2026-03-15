/*
Endpoints:
POST   /services
GET    /services
GET    /services/:id
PUT    /services/:id
DELETE /services/:id
GET    /services/category/:categoryId

Regras:
Endpoint	Permissão
GET services	público
GET service	público
GET by category	público
POST	PROVIDER
PUT	PROVIDER dono
DELETE	PROVIDER dono

No update/delete precisamos verificar:
service.providerId === providerProfile.id
Se não:
403 Forbidden
*/