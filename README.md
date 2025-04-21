# 🍷 Sistema de Controle de Estoque para Adegas

Um sistema web completo para gerenciamento de estoque de adegas, desenvolvido com PHP, MySQL, CSS, JavaScript, jQuery, ExcelJS, jsPDF e WebSockets para atualizações em tempo real. Ideal para controle preciso de vinhos e bebidas em estabelecimentos como adegas, distribuidoras e bares.

## 🚀 Funcionalidades Principais

- Cadastro e gerenciamento de produtos (vinhos, destilados, cervejas, etc.)
- Controle de entrada e saída de estoque
- Relatórios em tempo real exportáveis em:
  - PDF (via jsPDF)
  - Excel (via ExcelJS)
- Atualização em tempo real com WebSockets
- Busca rápida e filtros dinâmicos com jQuery AJAX
- Histórico de movimentações detalhado
- Dashboard com gráficos de estoque e movimentação
- Controle de usuários e permissões
- Design responsivo e moderno

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Finalidade |
|------------|------------|
| PHP        | Backend e lógica de negócios |
| MySQL      | Banco de dados relacional |
| JavaScript | Interatividade no frontend |
| jQuery     | Manipulação DOM e AJAX |
| CSS3       | Estilização responsiva |
| ExcelJS    | Geração de relatórios em Excel |
| jsPDF      | Geração de relatórios em PDF |
| WebSockets | Comunicação em tempo real entre usuários |

## 🔄 Atualizações em tempo real

O sistema utiliza WebSockets para manter todas as telas sincronizadas. Por exemplo:
- Quando um produto é adicionado ou removido, o dashboard e a listagem de produtos se atualizam automaticamente.
- Quando há movimentação de estoque, todos os usuários conectados recebem a atualização em tempo real.

## 📤 Exportação de Relatórios

Você pode exportar relatórios de estoque e movimentação em dois formatos:
- Excel (.xlsx) — com colunas personalizadas e dados filtrados
- PDF — com layout limpo, cabeçalho, rodapé e logo da empresa

## 👤 Permissões de Usuário

- Administrador: acesso completo ao sistema
- Operador: acesso ao estoque, movimentações e relatórios
- Visualizador: apenas leitura dos dados

## 📝 Licença

Este projeto está licenciado sob a MIT License.
