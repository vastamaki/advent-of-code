import { describe, expect, test } from "bun:test";
import { Solution } from "@/types";
import path from "path";

type TestCase = {
  input: string;
  expected: number | string;
};

export const createDayTests = (
  year: number,
  day: number,
  solution: Solution,
  examples: {
    part1?: TestCase[];
    part2?: TestCase[];
  }
) => {
  describe(`Year ${year} Day ${day}`, () => {
    if (examples.part1?.length) {
      describe("Part 1", () => {
        examples.part1?.forEach((testCase, index) => {
          test(`Example ${index + 1}`, () => {
            expect(solution.part1(testCase.input)).toBe(testCase.expected);
          });
        });

        test("Real Input", async () => {
          const input = await Bun.file(
            path.join(process.cwd(), String(year), "inputs", `day${day}.txt`)
          ).text();
          expect(() => solution.part1(input)).not.toThrow();
        });
      });
    }

    if (examples.part2?.length) {
      describe("Part 2", () => {
        examples.part2?.forEach((testCase, index) => {
          test(`Example ${index + 1}`, () => {
            expect(solution.part2(testCase.input)).toBe(testCase.expected);
          });
        });

        test("Real Input", async () => {
          const input = await Bun.file(
            path.join(process.cwd(), String(year), "inputs", `day${day}.txt`)
          ).text();
          expect(() => solution.part2(input)).not.toThrow();
        });
      });
    }
  });
};

export const dedent = (
  strings: TemplateStringsArray,
  ...values: any[]
): string => {
  const raw = String.raw(strings, ...values);
  const lines = raw.split("\n");
  const firstLine = lines.find((line) => line.trim().length > 0);
  if (!firstLine) return raw;

  const indent = firstLine.match(/^\s*/)?.[0].length ?? 0;
  return lines
    .map((line) => line.slice(indent))
    .join("\n")
    .trim();
};
