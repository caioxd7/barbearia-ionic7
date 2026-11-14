# Barbearia — Ionic 7 + Angular

App Android de agendamento de barbearia baseado nas telas fornecidas.

## Tecnologias
- Ionic 7
- Angular 16
- Capacitor 5
- Firebase Authentication
- Cloud Firestore

## Configuração
1. Instale Node.js.
2. Entre na pasta do projeto.
3. Execute `npm install`.
4. Crie um projeto no Firebase e ative Authentication > Email/Password e Firestore Database.
5. Copie as credenciais do Firebase para `src/environments/environment.ts`.
6. Rode `npm start` para testar no navegador.
7. Para Android: `npx cap add android`, `npm run build`, `npx cap sync android` e `npx cap open android`.

## Fluxo
Login/Cadastro → Início → Serviço → Barbeiro → Data/Horário → Confirmação → Histórico.

Os serviços, barbeiros e horários usados como exemplo foram adaptados das telas fornecidas.
