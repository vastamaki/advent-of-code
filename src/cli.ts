#!/usr/bin/env bun
import { intro } from "@clack/prompts";
import {
  getAvailableYears,
  getDayOptions,
  getYearOptions,
  initializeDay,
  initializeProject,
  runSolution,
} from "@/utils/cli";
import color from "picocolors";
import * as prompt from "@clack/prompts";

const main = async () => {
  initializeProject();

  intro(color.bgCyan(" 🎄 Advent of Code CLI "));

  const result = await prompt.group(
    {
      action: () =>
        prompt.select({
          message: "What would you like to do?",
          options: [
            { value: "run", label: "Run a solution" },
            { value: "new", label: "Create a new day" },
          ],
        }),
      year: () =>
        prompt.select({
          message: "Select year",
          options: getYearOptions(getAvailableYears()),
        }),
      day: ({ results }) =>
        prompt.select({
          message: "Select day",
          options: getDayOptions(results.year!),
        }),
      part: ({ results }) => {
        if (results.action !== "run") return undefined;

        return prompt.select({
          message: "Select part",
          options: [
            { value: "both", label: "Both parts" },
            { value: "1", label: "Part 1" },
            { value: "2", label: "Part 2" },
          ],
        });
      },
    },
    {
      onCancel: () => {
        prompt.cancel("Operation cancelled");
        process.exit(0);
      },
    }
  );

  switch (result.action) {
    case "run":
      await runSolution(
        result.year,
        result.day as number,
        parseInt(result.part as string) ?? undefined
      );
      break;
    case "new":
      await initializeDay(result.year, result.day as number);
      break;
  }
};

main();
