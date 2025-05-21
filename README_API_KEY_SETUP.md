# Guia para Configuração da API Key do OpenWeatherMap

Este guia irá te ajudar a criar e configurar sua chave de API para que a funcionalidade de previsão do tempo funcione corretamente no projeto.

## Passo 1: Criar uma conta no OpenWeatherMap

1. Acesse o site: https://openweathermap.org/
2. Clique em "Sign Up" (Registrar-se) no canto superior direito.
3. Preencha os dados para criar sua conta gratuita.
4. Confirme seu e-mail e faça login.

## Passo 2: Gerar a API Key

1. No painel do usuário, vá para a seção "API keys" ou "Chaves de API".
2. Clique em "Create Key" (Criar chave).
3. Dê um nome para sua chave (ex: "Garagem Inteligente").
4. Copie a chave gerada.

## Passo 3: Configurar a API Key no projeto

### Opção 1: Configurar diretamente no arquivo (não recomendado para produção)

1. Abra o arquivo `weatherService.js`.
2. Substitua o valor da constante `API_KEY` pela sua chave copiada, por exemplo:

```js
const API_KEY = 'SUA_CHAVE_AQUI';
```

3. Salve o arquivo.

### Opção 2: Usar variável de ambiente (recomendado)

1. Crie um arquivo `.env` na raiz do projeto (se ainda não existir).
2. Adicione a linha:

```
OPENWEATHER_API_KEY=SUA_CHAVE_AQUI
```

3. Instale a biblioteca `dotenv` para carregar variáveis de ambiente (se ainda não estiver instalada):

```
npm install dotenv
```

4. Modifique o arquivo `weatherService.js` para carregar a chave da variável de ambiente:

```js
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.OPENWEATHER_API_KEY;
```

5. Certifique-se de que o `.env` está listado no `.gitignore` para não subir a chave para o repositório.

## Passo 4: Testar a funcionalidade

1. Inicie o servidor local.
2. Acesse a aplicação e teste a previsão do tempo para qualquer cidade, data e hora.
3. Verifique se a previsão é exibida corretamente.

---

Se precisar de ajuda em algum desses passos, estou à disposição para guiar você.
