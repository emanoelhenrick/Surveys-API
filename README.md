<div align="center">

# Surveys API

Uma API REST para criação e consulta de pesquisas, construída com **TypeScript**, **Express** e **MongoDB**, seguindo princípios de Clean Architecture e Domain-Driven Design.

<p>
	<img src="https://img.shields.io/badge/Node.js-18%2B-3C873A?logo=node.js&logoColor=white" alt="Node.js 18 ou superior" />
	<img src="https://img.shields.io/badge/TypeScript-4.9%2B-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
	<img src="https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white" alt="Express" />
	<img src="https://img.shields.io/badge/MongoDB-5.x-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
</p>

</div>

## Sobre o projeto

O **Surveys API** centraliza o fluxo essencial de uma plataforma de pesquisas:

- criação de contas e autenticação com JWT;
- controle de acesso por token;
- cadastro de pesquisas com perguntas e alternativas;
- consulta de pesquisas disponíveis;
- persistência em MongoDB;
- validações, tratamento de erros e testes automatizados.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Runtime | Node.js 18+ |
| Linguagem | TypeScript |
| HTTP | Express |
| Banco de dados | MongoDB |
| Autenticação | JWT |
| Hash de senha | bcrypt |
| Testes | Vitest + SuperTest |
| Ambiente local | Docker Compose |

## Arquitetura

O código é dividido por responsabilidade para manter regras de negócio independentes de frameworks e infraestrutura:

```text
src/
├── domain/         # Modelos e contratos dos casos de uso
├── data/           # Implementação dos casos de uso e protocolos de dados
├── infra/          # MongoDB, JWT, bcrypt e validadores externos
├── presentation/   # Controllers, middlewares, erros e protocolos HTTP
├── validation/     # Validadores reutilizáveis
└── main/           # Composição da aplicação, rotas e factories
```

## Começando

### Pré-requisitos

- Node.js 18 ou superior;
- npm;
- Docker e Docker Compose, para executar o MongoDB localmente.

### Instalação

```bash
git clone https://github.com/EmanoelHenrick/Surveys-API.git
cd Surveys-API
npm install
```

### Configuração

Crie um arquivo `.env.dev` na raiz do projeto:

```env
MONGO_URL=mongodb://docker:docker@localhost:27017/?authMechanism=DEFAULT
PORT=10000
JWT_SECRET=troque-esta-chave-em-ambientes-reais
```

O modo de desenvolvimento usa o banco `test`. Em outros ambientes, a aplicação usa o banco `prod`.

### Executando

Inicie o MongoDB:

```bash
npm run up
```

O comando compila a aplicação e sobe o container do MongoDB. Para trabalhar com recarregamento automático, execute a API em outro terminal:

```bash
npm run dev
```

A API ficará disponível em `http://localhost:10000/api`.

Para desligar os containers:

```bash
npm run down
```

## API

Todas as rotas são prefixadas com `/api` e recebem/retornam JSON.

### Criar conta

```http
POST /api/signup
Content-Type: application/json
```

```json
{
	"name": "Ana Silva",
	"email": "ana@example.com",
	"password": "senha-segura"
}
```

Resposta `200 OK`:

```json
{
	"accessToken": "<jwt>"
}
```

### Entrar

```bash
curl -X POST http://localhost:10000/api/login \
	-H 'Content-Type: application/json' \
	-d '{"email":"ana@example.com","password":"senha-segura"}'
```

Resposta `200 OK`:

```json
{
	"accessToken": "<jwt>"
}
```

### Criar pesquisa

Requer um token de uma conta com perfil de administrador no header `x-access-token`.

```bash
curl -X POST http://localhost:10000/api/surveys \
	-H 'Content-Type: application/json' \
	-H 'x-access-token: <jwt>' \
	-d '{
		"question": "O que você achou do produto?",
		"answers": [
			{"answer":"Excelente"},
			{"answer":"Bom"},
			{"answer":"Pode melhorar"}
		]
	}'
```

Resposta `204 No Content`.

Cada alternativa aceita também um campo opcional `image`:

```json
{
	"answer": "Excelente",
	"image": "https://example.com/excelente.png"
}
```

### Listar pesquisas

Requer o header `x-access-token`. Quando existem pesquisas, a API retorna `200 OK` com uma lista. Sem registros, retorna `204 No Content`.

```bash
curl http://localhost:10000/api/surveys \
	-H 'x-access-token: <jwt>'
```

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Executa a API em modo desenvolvimento com watch |
| `npm run build` | Remove `dist/` e compila o TypeScript |
| `npm start` | Executa a versão compilada |
| `npm run up` | Compila o projeto e sobe o MongoDB com Docker Compose |
| `npm run down` | Para e remove os containers |
| `npm test` | Executa todos os testes |
| `npm run test:unit` | Executa os testes unitários |
| `npm run test:integration` | Executa os testes de integração |
| `npm run test:coverage` | Executa os testes com cobertura |

## Testes

```bash
npm run test:unit
npm run test:integration
npm run test:coverage
```

Os testes cobrem casos de uso, repositórios MongoDB, adaptadores criptográficos, validações, middlewares e rotas HTTP.

## Licença

Distribuído sob a licença ISC. Consulte o arquivo `package.json` para mais informações.

<div align="center">
	<sub>Construído para praticar arquitetura limpa, testes automatizados e desenvolvimento de APIs com TypeScript.</sub>
</div>
