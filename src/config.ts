import { join } from "path";

export const CURRENT_YEAR = new Date().getFullYear();
export const FIRST_YEAR = 2024;
export const PROJECT_ROOT = process.cwd();
export const DATA_DIR = join(PROJECT_ROOT, "data");

export const getPaths = (year: number, day: number) => ({
  yearDir: join(DATA_DIR, String(year)),
  inputsDir: join(DATA_DIR, String(year), "inputs"),
  solutionsDir: join(DATA_DIR, String(year), "solutions"),
  inputFile: join(DATA_DIR, String(year), "inputs", `day${day}.txt`),
  solutionFile: join(DATA_DIR, String(year), "solutions", `day${day}.ts`),
});
