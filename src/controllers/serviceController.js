/*
Funções:
createService
getAllServices
getServiceById
updateService
deleteService
getServicesByCategory

Regra importante:
O providerId não vem do body.
Ele vem do usuário logado.

Fluxo:
req.user.id
↓
buscar ProviderProfile
↓
providerProfile.id
↓
salvar no Service
*/

/**

A próxima etapa será ServiceController, que é mais interessante porque envolve:
pegar providerProfile
validar categoria
criar serviço
garantir que provider só edite os próprios serviços
Essa parte é o coração do marketplace.
 */