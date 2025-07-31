# codemasters-mentor
<img width="1172" height="461" alt="image" src="https://github.com/user-attachments/assets/def10392-1f72-4db1-bf2c-f94cdbe1bd04" />


## Deno workspaces
Install dependancies in root folder
* `deno install`

To start backend/ce-api
* cd over to respective package
* `deno run dev`

To import anything from db schema
* Example `import { Submissions } from "@codemasters/db" `
* `@codemasters/db` is the name of db package which exports schema

Commands to use drizzle-kit in db package
* `deno --env -A --node-modules-dir npm:drizzle-kit generate` command to generate migrations
* `deno --env -A --node-modules-dir npm:drizzle-kit migrate` to apply migrations to postgres db
