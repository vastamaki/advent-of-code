export const getSolutionTemplate = () =>
  `
export default {
  part1: (input: string): number => {
    const lines = input.split('\\n');
    return 0;
  },
  
  part2: (input: string): number => {
    const lines = input.split('\\n');
    return 0;
  }
};
`.trim();

export const getTestTemplate = (year: number, day: number) =>
  `
import { createDayTests, dedent } from "@/utils/tests";
import solution from "./day${day}";

createDayTests(${year}, ${day}, solution, {
  part1: [
    {
      input: dedent\`
        example
        input
        here
      \`,
      expected: 0,
    },
  ],
  part2: [
    {
      input: dedent\`
        example
        input
        here
      \`,
      expected: 0,
    },
  ],
});
`.trim();
