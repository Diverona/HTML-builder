const fs = require("fs/promises");
const path = require("path");

const componentsDir = path.join(__dirname, "components");
const stylesDir = path.join(__dirname, "styles");
const assetsDir = path.join(__dirname, "assets");
const templateFile = path.join(__dirname, "template.html");
const outputDir = path.join(__dirname, "project-dist");

async function copyAssets() {
  async function copyDirectory(srcDir, destDir) {
    await fs.mkdir(destDir, { recursive: true });
    const entries = await fs.readdir(srcDir, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(srcDir, entry.name);
      const destPath = path.join(destDir, entry.name);

      if (entry.isDirectory()) {
        await copyDirectory(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }

  const assetsOutputDir = path.join(outputDir, "assets");
  await copyDirectory(assetsDir, assetsOutputDir);
}

async function mergeStyles() {
  const cssFiles = (await fs.readdir(stylesDir)).filter((file) =>
    file.endsWith(".css")
  );
  let bundleCss = "";

  for (const cssFile of cssFiles) {
    const cssContent = await fs.readFile(
      path.join(stylesDir, cssFile),
      "utf-8"
    );
    bundleCss += cssContent;
  }

  await fs.writeFile(path.join(outputDir, "style.css"), bundleCss);
}

async function buildPage() {
  try {
    await fs.mkdir(outputDir, { recursive: true });

    let template = await fs.readFile(templateFile, "utf-8");

    const tags = template.match(/{{\w+}}/g);

    for (const tag of tags) {
      const componentName = tag.slice(2, -2);
      const componentFile = path.join(componentsDir, `${componentName}.html`);

      try {
        const componentContent = await fs.readFile(componentFile, "utf-8");
        template = template.replace(tag, componentContent);
      } catch (error) {
        console.error(`Ошибка при чтении компонента ${componentName}:`, error);
      }
    }

    await fs.writeFile(path.join(outputDir, "index.html"), template);

    await copyAssets();
    await mergeStyles();
  } catch (error) {
    console.error("Произошла ошибка при сборке страницы:", error);
  }
}

buildPage();
