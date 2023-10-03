import { readFileSync, rmSync, mkdirSync, writeFileSync, existsSync } from "fs";
import { createCanvas, loadImage } from "canvas";
import { createSpinner } from "nanospinner";

const spinner = createSpinner("Resim oluşturuluyor...").start();

const fileData = readFileSync("./data.json", "utf8");
const result = JSON.parse(fileData);

const coordinates = [165, 262.5, 375, 487.5, 592.5, 690, 780];

const main = async () => {
  const tickImage = await loadImage("./tick.png");
  const crossImage = await loadImage("./false.png");

  if (existsSync("./images")) rmSync("./images", { recursive: true });
  mkdirSync("./images");

  for (const [i, website] of result.entries()) {
    const favicon = await loadImage(
      `http://www.google.com/s2/favicons?domain=${website.link}`
    ).catch(() => null);

    spinner.update({
      text: `Resim oluşturuluyor (${i + 1}/${result.length})`,
    });

    const canvas = createCanvas(450, 900);
    const image = await loadImage("./base-image.png");
    const ctx = canvas.getContext("2d");

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    if (favicon) ctx.drawImage(favicon, canvas.width / 2 - 17.5, 30, 35, 35);

    ctx.font = "bold 24px Inter";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.fillText(
      website.link,
      canvas.width / 2,
      favicon ? 100 : 80,
      canvas.width - 30
    );

    if (website.city) {
      ctx.font = "18px Inter";
      ctx.fillStyle = "#00000050";
      ctx.fillText(
        website.city,
        canvas.width / 2,
        favicon ? 125 : 105,
        canvas.width - 30
      );
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

    writeFileSync(`./images/${hostname}.png`, canvas.toBuffer());
  }

  spinner.success();
};

main();
