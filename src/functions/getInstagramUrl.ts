import { TerminalSpinner } from "https://deno.land/x/spinners@v1.1.2/mod.ts";

export const getInstagramUrl = async () => {
  const fileData = Deno.readFileSync("../data-instagram-links.txt");
  const websites = new TextDecoder().decode(fileData).split("\n");

  const terminalSpinner = new TerminalSpinner("Sayfalar kontrol ediliyor...");
  terminalSpinner.start();

  const result: {
    link: string;
    instagramUrl?: string;
  }[] = [];

  const instagramRegex =
    /\bhttps?:\/\/(?:www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?\b/;

  for (const [i, website] of websites.entries()) {
    terminalSpinner.set(`Sayfa kontrol ediliyor (${i + 1}/${websites.length})`);

    try {
      const response = await fetch(`http://${website}`);
      const text = await response.text();

      result.push({
        link: website,
        instagramUrl: instagramRegex.exec(text)?.[0],
      });
    } catch (_err) {
      result.push({
        link: website,
      });
    }
  }

  Deno.writeFileSync(
    "result-instagram.json",
    new TextEncoder().encode(JSON.stringify(result, null, 2))
  );

  terminalSpinner.succeed();
};

getInstagramUrl();
