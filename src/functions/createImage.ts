import { TerminalSpinner } from "https://deno.land/x/spinners@v1.1.2/mod.ts";
import { existsSync } from "https://deno.land/std@0.203.0/fs/exists.ts";
import config from "@/config.json" assert { type: "json" };
import {
  createCanvas,
  loadImage,
} from "https://deno.land/x/canvas@v1.4.1/mod.ts";

const coordinates = [165, 262.5, 375, 487.5, 592.5, 690, 780];

const main = async () => {
  const terminalSpinner = new TerminalSpinner("Starting to generate images...");

  const outputDirectory = `${config.outDir}/images`;
  const fileData = Deno.readTextFileSync(`${config.outDir}/result.json`);

  if (!fileData)
    return console.error(
      "No result file found, aborting. Run the main file first to generate a result file."
    );

  const result = JSON.parse(fileData);

  const tickImage = await loadImage("src/assets/tick.png");
  const crossImage = await loadImage("src/assets/false.png");

  if (existsSync(outputDirectory))
    Deno.removeSync(outputDirectory, { recursive: true });
  Deno.mkdirSync(outputDirectory);

  for (const [i, website] of result.entries()) {
    terminalSpinner.set(`Generating image (${i + 1}/${result.length})`);

    const favicon = await loadImage(
      `http://www.google.com/s2/favicons?domain=${website.link}`
    ).catch(() => null);

    const canvas = createCanvas(450, 900);
    const ctx = canvas.getContext("2d");

    const image = await loadImage("src/assets/base-image.png");
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    if (favicon) ctx.drawImage(favicon, canvas.width / 2 - 17.5, 30, 35, 35);

    ctx.font = "bold 24px Inter";
    ctx.fillStyle = "#000";

    const textWidth = ctx.measureText(website.link).width;
    ctx.fillText(website.link, canvas.width / 2 - textWidth / 2, 100);

    if (website.city) {
      ctx.font = "18px Inter";
      ctx.fillStyle = "#00000050";

      const textWidth = ctx.measureText(website.city).width;
      ctx.fillText(website.city, canvas.width / 2 - textWidth / 2, 100);
    }

    for (const [i, tick] of [
      website.ssl,
      website.instagram,
      website.facebook,
      website.linkedin,
      website.twitter,
      website.discord,
      website.youtube,
    ].entries()) {
      ctx.drawImage(tick ? tickImage : crossImage, 255, coordinates[i]);
    }

    const hostname = new URL(`https://${website.link}`).hostname.replace(
      "www.",
      ""
    );

    if (!hostname) continue;

    Deno.writeFileSync(`${outputDirectory}/${hostname}.png`, canvas.toBuffer());
  }

  terminalSpinner.succeed();
};

main();
