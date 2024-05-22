import { program } from "commander";
import { config } from "dotenv";

program
  .name("upload-csv")
  .description("Upload a CSV file to enroll patients in a careflow")
  .version("0.0.1");

program.option(
  "-e, --env-file <env-file>",
  "environment file to use (default .env)",
  ".env"
);

program.parse(process.argv);
const { envFile } = program.opts();
console.log(`Running upload with env file: ${envFile}`);

config({ path: envFile });
