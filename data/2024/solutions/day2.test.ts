import { createDayTests, dedent } from "@/utils/tests";
import solution from "./day2";

createDayTests(2024, 2, solution, {
  part1: [
    {
      input: dedent`
        example
        input
        here
      `,
      expected: 0,
    },
  ],
  part2: [
    {
      input: dedent`
        example
        input
        here
      `,
      expected: 0,
    },
  ],
});