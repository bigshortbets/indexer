# Substrate node processor

This project purpose is to aggregate events from the Substrate-based blockchain and provide GraphQL API enpoint for accessing
on chain historic data, events and calls. Project uses Subsquid squid technology, for more information see [Subsquid documentation](https://docs.subsquid.io/).

## Prerequisites

* node 16.x
* docker
* npm
* access to the blockchain node

## Quickstart

1. Run the processor
    * Run docker container via docker compose
    * Build the squid, for more information follow [this documentation](https://docs.subsquid.io/quickstart/)
      *   from the processor dir run: `npm i -g @subsquid/cli@latest`
      *   check version: `sqd --version`
      *   initialize squid with <project-name> : `sqd init <project-name> --template substrate`
      *   install dependencies: `npm i`
    * Launch Postgres in a detached Docker container: `sqd up`
    * Generate `model` files, `v1` and `events`: Workflow section, parts 1 and 3.
    * Build the project and start the processor: `sqd process`
    * On another instance of the terminal run GraphQL server: `sqd serve`
    * GraphQL API will be accessible under `/graphql` endpoint on the port prompted by `sqd serve`

## Workflow

1. Entities are generated based on the `schema.graphql` file, instruction on defining entities may be found under this [Subsquid documentation page](https://docs.subsquid.io/basics/store/postgres/schema-file/).
To map changes from `schema.graphql` to the codebase (files inside `/model/generated`) call `sqd codegen` method, delta between current state of database and state of the model
is represented by the migration file - new one must be generated after each change made to the model (using `sqd migration:generate` command).
2. All squid command's with brief explanation are defined in the `commands.json` file
3. In `/types` directory there are generated classes that represent access API for the Substate chain metadata:
to update those files after chain node change call generate `.jsonl` file by running: `squid-substrate-metadata-explorer --chain <url> --out <file>`
where in `<url>` write chain node url and in `<file>` output destination and name of your `.jsonl` file (by relation to the root project directory).
Next call `sqd typegen <file>`.
4. CRUD operations on the database are made using `BatchContext.store` `TypeormDatabase` member. General info about using `TypeormDatabase` is available [here](https://docs.subsquid.io/basics/store/postgres/typeorm-store/).
For advanced query operations see [this documentation page](https://typeorm.io/find-options#advanced-options).

## Project conventions

Squid tools assume a certain project layout.

* All compiled js files must reside in `lib` and all TypeScript sources in `src`.
The layout of `lib` must reflect `src`.
* All TypeORM classes must be exported by `src/model/index.ts` (`lib/model` module).
* Database schema must be defined in `schema.graphql`.
* Database migrations must reside in `db/migrations` and must be plain js files.
* `squid-*(1)` executables consult `.env` file for a number of environment variables.

See the [full description](https://docs.subsquid.io/basics/squid-structure/) in the documentation.