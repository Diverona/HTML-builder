const fs = require("fs").promises;
const path = require("path");

const secretFolderPath = path.join(__dirname, "secret-folder");

async function main() {
  try {
    const items = await fs.readdir(secretFolderPath, { withFileTypes: true });

    for (const item of items) {
      if (item.isFile()) {
        const filePath = path.join(secretFolderPath, item.name);
        const stats = await fs.stat(filePath);
        const ext = path.extname(item.name);
        const fileName = path.basename(item.name, ext);
        const sizeKB = stats.size / 1024;

        console.log(`${fileName} - ${ext.slice(1)} - ${sizeKB}kb`);
      }
    }
  } catch (err) {
    console.error("Произошла ошибка при чтении содержимого папки:", err);
  }
}

main();
