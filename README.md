# Social Media Links Scraper

This project scrapes social media URLs from any given URLs and saves them as images or Excel files (optional).

### Requirements

You will need [Deno](https://docs.deno.com/runtime/manual/getting_started/installation) installed on your system to run this project.

### Running

Simply add your links to `links.txt` file and run the following command:

```bash
deno run --allow-net --allow-read --allow-write --allow-env --unstable src/main.ts
```

This will check every page that is listed in your text file and will save the results in the output folder; you can change the folder name from `src/config.json`.

Additionally you can run the `createaImage.ts` and `convertXlsx.ts` file to create images and Excel files from the results.
