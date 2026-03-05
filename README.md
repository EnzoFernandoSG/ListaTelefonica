# ListaTelefonica
Este projeto implementa uma aplicação Agenda Telefônica completa (CRUD: Cadastro, Pesquisa, Alteração e Exclusão) desenvolvida como um teste prático de engenharia de software e integração de sistemas.

🏛️ Arquitetura e Tecnologia

A aplicação segue uma arquitetura Full Stack, onde as camadas de frontend e backend são mantidas em branches separadas dentro deste repositório para clareza, separação de responsabilidades e simulação de um ambiente de desenvolvimento real:

Backend (API)	backend	ASP.NET Core (C#) e Entity Framework Core (EF Core)	Responsável pela lógica de negócios, persistência de dados, e geração de LOGs de exclusão em arquivo texto. A API expõe endpoints RESTful para o consumo do frontend, utilizando DTOs para garantir a correta serialização e model binding.

Frontend (Interface)	frontend	React com TypeScript (TS) e Vite	Responsável pela interface do usuário (UI) e pelo consumo dos endpoints da API. Implementa formulários dinâmicos de cadastro e uma tabela de pesquisa com funcionalidades de filtro, alteração in-line e exclusão.

💾 Persistência de Dados

A aplicação utiliza o PostgreSQL (configurado via Supabase) como sistema de gerenciamento de banco de dados, acessado pelo backend através do Entity Framework Core e do driver Npgsql.

✨ Destaques da Implementação

  .Separação de Preocupações (DTOs): Uso de Data Transfer Objects (ContatoInclusaoDTO, ContatoAlteracaoDTO, ContatoRetornoDTO) no backend para isolar as entidades de domínio da validação e dos problemas de serialização (ciclo de objetos) e model binding.

  .Gerenciamento de Entidades Aninhadas: Implementação robusta da lógica de PUT (Alteração) para garantir a correta atualização, adição e remoção de Telefones aninhados dentro da entidade Contato no EF Core.

  .Controle de Versão: Manutenção rigorosa de branches separadas para facilitar o desenvolvimento paralelo e a revisão de código em cada respectiva camada.
  
💻SQL para criar tabelas no supabase:

CREATE TABLE "Contato" (
    "ID" BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
    "NOME" VARCHAR(100) NOT NULL,
    "IDADE" SMALLINT
);

-- TABELA TELEFONE 
CREATE TABLE "Telefone" (
    "IDCONTATO" BIGINT NOT NULL,
    "ID" BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL, 
    "NUMERO" VARCHAR(16) NOT NULL,
    
  PRIMARY KEY ("IDCONTATO", "ID"), 
    CONSTRAINT fk_telefone_contato 
        FOREIGN KEY ("IDCONTATO") 
        REFERENCES "Contato"("ID") 
        ON DELETE CASCADE
);
