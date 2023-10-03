import { TerminalSpinner } from "https://deno.land/x/spinners@v1.1.2/mod.ts";
import { existsSync } from "https://deno.land/std@0.203.0/fs/exists.ts";
import { sleep } from "https://deno.land/x/sleep@v1.2.1/mod.ts";
import config from "@/config.json" assert { type: "json" };

const fileData = Deno.readFileSync(config.linksFile);
const websites = new TextDecoder().decode(fileData).split("\n");

const result: {
  link: string;
  ssl: boolean;
  facebook?: boolean;
  instagram?: boolean;
  twitter?: boolean;
  linkedin?: boolean;
  youtube?: boolean;
  discord?: boolean;
}[] = [];

const terminalSpinner = new TerminalSpinner("Starting to check pages...");
terminalSpinner.start();

for (const [i, website] of websites.entries()) {
  terminalSpinner.set(`Checking page (${i + 1}/${websites.length})`);

  try {
    const response = await fetch(`https://${website}`);
    const text = await response.text();

    result.push({
      link: website,
      ssl: true,
      facebook: text.includes("facebook.com"),
      instagram: text.includes("instagram.com"),
      twitter: text.includes("twitter.com"),
      linkedin: text.includes("linkedin.com"),
      youtube: text.includes("youtube.com"),
      discord: text.includes("discord.com"),
    });

    await sleep(1);
  } catch (_err) {
    result.push({
      link: website,
      ssl: false,
    });
  }
}

if (existsSync(config.outDir)) {
  Deno.removeSync(config.outDir, { recursive: true });
}

Deno.mkdirSync(config.outDir);

Deno.writeTextFileSync(
  `${config.outDir}/result.json`,
  JSON.stringify(result, null, 2)
);

terminalSpinner.succeed();
