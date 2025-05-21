# Garagem Inteligente JS Edition

Este projeto é uma aplicação web para controle inteligente de garagem e veículo, incluindo funcionalidades como:

- Controle da porta da garagem, luzes do carro e motor.
- Sistema de marcação e gerenciamento de revisões do carro, com confirmação de pagamento.
- Previsão do tempo dinâmica para qualquer cidade, data e hora, integrada via API OpenWeatherMap.

## Estrutura do Projeto

- `index.html`: Página principal da aplicação com a interface do usuário.
- `style.css`: Estilos CSS para a interface.
- `main.js`: Ponto de entrada principal que inicializa os módulos da aplicação.
- `garagemControles.js`: Módulo que gerencia os controles da garagem e do veículo.
- `revisaoCarro.js`: Módulo para gerenciamento das revisões do carro e confirmação de pagamento.
- `weatherService.js`: Serviço para buscar dados da previsão do tempo via API OpenWeatherMap.
- `weatherUI.js`: Gerencia a interface da previsão do tempo e exibe os resultados.
- `README_API_KEY_SETUP.md`: Guia para criação e configuração da chave de API do OpenWeatherMap.

## Como Usar

1. Configure sua chave de API do OpenWeatherMap conforme o guia em `README_API_KEY_SETUP.md`.
2. Inicie um servidor local para servir os arquivos (ex: `npx http-server`).
3. Acesse a aplicação no navegador.
4. Utilize os controles da garagem, marque revisões do carro e consulte a previsão do tempo.

## Dependências

- Nenhuma dependência externa além do navegador e conexão com a internet para a API de previsão do tempo.
- Para uso de variáveis de ambiente, pode ser necessário instalar `dotenv` via npm.

## Testes

- Testes básicos foram realizados para garantir o funcionamento das funcionalidades principais.
- Recomenda-se realizar testes completos de usabilidade, responsividade e integração com a API.

## Contato

Para dúvidas ou suporte, entre em contato com o desenvolvedor.

---

Este projeto foi desenvolvido para fins educacionais e demonstração de funcionalidades web dinâmicas.
