# Letmeask | NLW Together (NLW6)

## Descrição
  - Aplicação para envio de perguntas. Nesta aplicação existem dois tipos de usuários, o dono da sala, e o membro da sala.
    - **Dono**: Para ser um dono de sala basta seguir os passos:
      - Faça login com o Google
      - Na página do usuário, clique em criar sala
      - Dê um nome para sua sala
      - Pronto, agora é só compartilhar o código da sala com as pessoas que você quer que tenham acesso.
      - Com a sala criada você tem as seguintes ações disponível:
        - Excluir mensagem
        - Marcar com highlight(Para deixar uma mensagem em evidência)
        - Marcar mensagem como respondida
        - Encerrar a sala
    - **Membro**
      - Tendo o código da sala em mãos, você precisa fazer os seguintes passos para acessá-la
        - Faça login com o Google
        - Na página de usuário, insira o código da sala no campo "Digite o código da sala"
        - Clique em entrar na sala
        - Pronto, agora você pode:
          - Postar novas perguntas
          - Ver perguntas já realizadas na sala
          - Curtir perguntas
  - Está aplicação tem por finalidade, auxiliar o gerenciamento de perguntas durante uma live ou palestra, de maneira fácil, com o palestrante iniciando uma sala, passando o código para todos os participantes/ouvintes, e recebendo as perguntas em tempo real que poderam ser respondida por número de curtidas ou o método que ele assim desejar.

## Tecnologias
  - ReactJS
    - HTML
    - SASS
    - JS
  - Firebase
    - RealtimeDatabase
    - Auth (Autenticação do Google)
    - Hosting (Aplicação hospedada no Firebase)

## Destaques da Aplicação
  - Integração com Firebase
  - Banco Realtime
  - Autenticação com o Google
  - Deploy no Firebase/Hosting
  - Contextos do React, para compartilhamento de informação entre componentes
  - Hooks, para compartilhamento de funções entre componentes

## Milha Extra
  - Features acrescentadas após o final da NLW:
    - ThemeDark
    - Responsividade
    - Tela do Usuário, para listar todas as Salas criadas por ele
    - Logout

[APP](https://letmeask-25175.web.app/)