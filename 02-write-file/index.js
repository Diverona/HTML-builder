const fs = require("fs");
const readline = require("readline");
const path = require("path");

const outputFilePath = path.join(__dirname, "output.txt");
const writeStream = fs.createWriteStream(outputFilePath, {
  flags: "a",
  encoding: "utf8",
});

console.log('Введите текст или наберите "exit" для выхода:');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on("line", (input) => {
  if (input.trim() === "exit") {
    exitProcess();
  } else {
    writeStream.write(input + "\n");
    console.log(
      'Текст сохранен. Введите следующую строку или наберите "exit" для выхода:'
    );
  }
});

function exitProcess() {
  console.log("Спасибо за внимание. Завершение работы...");
  rl.close();
  process.exit(0);
}

process.on("SIGINT", () => {
  exitProcess();
});
