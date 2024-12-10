import { CURRENT_YEAR, DATA_DIR, FIRST_YEAR, getPaths } from "@/config";
import { fetchInput } from "@/utils/api";
import { getSolutionTemplate, getTestTemplate } from "@/utils/templates";
import { cancel, log } from "@clack/prompts";
import {
  writeFileSync,
  readFileSync,
  existsSync,
  readdirSync,
  mkdirSync,
} from "fs";

export const writeFile = (path: string, content: string): void => {
  try {
    if (existsSync(path)) {
      log.warning(`${path} already exists`);
      return;
    }

    writeFileSync(path, content);

    log.success(`Created ${path}`);
  } catch (error) {
    log.error(`Failed to create ${path}: ${error}`);
  }
};

export const initializeDay = async (
  year: number,
  day: number
): Promise<void> => {
  const { solutionFile, solutionsDir, inputFile } = getPaths(year, day);

  const input = await fetchInput(year, day);

  writeFile(inputFile, input);
  writeFile(solutionFile, getSolutionTemplate());
  writeFile(`${solutionsDir}/day${day}.test.ts`, getTestTemplate(year, day));
};

export const getAvailableYears = (): number[] => {
  try {
    const years = readdirSync(DATA_DIR)
      .filter((file) => {
        const year = parseInt(file);
        return !isNaN(year) && year >= FIRST_YEAR && year <= CURRENT_YEAR;
      })
      .map(Number)
      .sort((a, b) => b - a);

    if (years.length === 0) {
      log.warning("No solutions found. Create a new day first.");
      cancel();
      process.exit(0);
    }

    return years;
  } catch {
    return [];
  }
};

export const initializeProject = (): void => {
  const years = Array.from(
    { length: CURRENT_YEAR - FIRST_YEAR + 1 },
    (_, i) => FIRST_YEAR + i
  );

  for (const y of years) {
    const { yearDir, inputsDir, solutionsDir } = getPaths(y, 1);

    for (const dir of [yearDir, inputsDir, solutionsDir]) {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    }
  }
};

export const runSolution = async (
  year: number,
  day: number,
  part?: number
): Promise<void> => {
  try {
    const { inputFile, solutionFile } = getPaths(year, day);

    if (!existsSync(solutionFile)) {
      cancel(`Solution for day ${day} not found`);
      process.exit(0);
    }

    const input = readFileSync(inputFile, "utf-8").trim();

    const solution = await import(solutionFile);

    const start = performance.now();

    if (!part || part === 1) {
      try {
        const result1 = solution.part1(input);

        log.success(`Part 1: ${result1}`);
      } catch (error) {
        log.error(`Part 1 failed: ${error}`);
      }
    }

    if (!part || part === 2) {
      try {
        const result2 = solution.part2(input);

        log.success(`Part 2: ${result2}`);
      } catch (error) {
        log.error(`Part 2 failed: ${error}`);
      }
    }

    const end = performance.now();

    log.info(`Completed in ${(end - start).toFixed(2)}ms`);
  } catch (error) {
    log.error(`Failed to run solution: ${error}`);
  }
};

export const getYearOptions = (availableYears?: number[]) => {
  if (availableYears) {
    return availableYears.map((y) => ({
      value: y,
      label: String(y),
    }));
  }

  return Array.from({ length: CURRENT_YEAR - FIRST_YEAR + 1 }, (_, i) => ({
    value: FIRST_YEAR + i,
    label: String(FIRST_YEAR + i),
  }));
};

export const getDayOptions = (year: number) => {
  try {
    const { solutionsDir } = getPaths(year, 1);

    const availableDays = readdirSync(solutionsDir)
      .filter(
        (file) =>
          file.startsWith("day") &&
          !file.includes("test") &&
          file.endsWith(".ts")
      )
      .map((file) => parseInt(file.replace(/[^\d]/g, "")))
      .filter((day) => !isNaN(day) && day >= 1 && day <= 25)
      .sort((a, b) => a - b);

    return Array.from({ length: 25 }, (_, i) => ({
      value: i + 1,
      label: `Day ${i + 1}`,
      initialValue: availableDays[availableDays.length - 1],
    }));
  } catch {
    return [];
  }
};
