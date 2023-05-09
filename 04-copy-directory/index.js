const fs = require("fs").promises;
const path = require("path");

const srcFolderPath = path.join(__dirname, "files");
const destFolderPath = path.join(__dirname, "files-copy");

async function deleteExtraFiles(src, dest) {
  const itemsDest = await fs.readdir(dest, { withFileTypes: true });

  for (const item of itemsDest) {
    const srcPath = path.join(src, item.name);
    const destPath = path.join(dest, item.name);

    try {
      await fs.access(srcPath);
    } catch {
      if (item.isFile()) {
        await fs.unlink(destPath);
      } else if (item.isDirectory()) {
        await deleteExtraFiles(srcPath, destPath);
        await fs.rmdir(destPath);
      }
    }
  }
}

async function copyDir(src, dest) {
  try {
    await fs.mkdir(dest, { recursive: true });

    const itemsSrc = await fs.readdir(src, { withFileTypes: true });

    for (const item of itemsSrc) {
      const srcPath = path.join(src, item.name);
      const destPath = path.join(dest, item.name);

      if (item.isFile()) {
        await fs.copyFile(srcPath, destPath);
      } else if (item.isDirectory()) {
        await copyDir(srcPath, destPath);
      }
    }

    await deleteExtraFiles(srcFolderPath, destFolderPath);
  } catch (err) {
    console.error("Произошла ошибка при копировании папки:", err);
  }
}

copyDir(srcFolderPath, destFolderPath);
