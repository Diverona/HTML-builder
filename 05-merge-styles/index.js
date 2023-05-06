const fs = require("fs/promises");
const path = require("path");

const stylesDir = path.join(__dirname, "styles");
const outputDir = path.join(__dirname, "project-dist");
const outputFile = path.join(outputDir, "bundle.css");

async function mergeStyles() {
  try {
    const files = await fs.readdir(stylesDir);

    const cssPromises = files
      .filter((file) => path.extname(file) === ".css")
      .map(
        async (file) => await fs.readFile(path.join(stylesDir, file), "utf-8")
      );

    const cssFiles = await Promise.all(cssPromises);

    await fs.mkdir(outputDir, { recursive: true });

    await fs.writeFile(outputFile, cssFiles.join("\n"));

    console.log("Стили успешно объединены в bundle.css");
  } catch (error) {
    console.error("Произошла ошибка при слиянии стилей:", error);
  }
}

mergeStyles();
