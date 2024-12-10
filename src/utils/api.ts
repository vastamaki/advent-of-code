import { log } from "@clack/prompts";

export const fetchInput = async (
  year: number,
  day: number
): Promise<string> => {
  const url = `https://adventofcode.com/${year}/day/${day}/input`;

  try {
    const response = await fetch(url, {
      headers: {
        Cookie: `session=${process.env.AOC_SESSION}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        log.error(`Input not available yet for year ${year} day ${day}`);
      }
      log.error(`Failed to fetch input: ${response.statusText}`);
    }

    const input = await response.text();
    return input.trimEnd();
  } catch (error) {
    log.error(`Failed to fetch input: ${error}`);
    return "";
  }
};
