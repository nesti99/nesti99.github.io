// ----------------------
// TYPING INTRO
// ----------------------
const typingArea = document.getElementById("typing-area");

const introLines = [
  "andrea@unix:~$ chmod +x cv.sh",
  "andrea@unix:~$ ./cv.sh",
  "",
  "Benvenuto nel mio cv",
  "Io, sono Andrea Nesticò.",
  "",
  "Ruolo:       Sistemista Unix/Linux – IT Specialist",
  "Location:    Roma, Italia",
  "",
  "Questo non è un semplice CV.",
  "È una shell interattiva.",
  "Digita un comando (help) o usa il menu a sinistra."
];


let currentLine = 0;
let currentChar = 0;

function typeNextChar() {
  if (!typingArea) return;
  if (currentLine >= introLines.length) return;

  const line = introLines[currentLine];

  typingArea.textContent =
    introLines.slice(0, currentLine).join("\n") +
    (currentLine > 0 ? "\n" : "") +
    line.slice(0, currentChar + 1);

  currentChar++;

  if (currentChar >= line.length) {
    currentLine++;
    currentChar = 0;
    typingArea.textContent += "\n";
    setTimeout(typeNextChar, 200);
  } else {
    setTimeout(typeNextChar, 20);
  }
}

typeNextChar();

// ----------------------
// PANNELLI
// ----------------------
const panels = document.querySelectorAll(".panel");

function showPanel(id) {
  panels.forEach(p => p.classList.toggle("active", p.id === id));
}

// ----------------------
// MENU LATERALE
// ----------------------
document.querySelectorAll(".menu button").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;
    if (target) {
      showPanel(target);
      printOutput(""); // non sporcare la shell se usi il menu
    }
  });
});

// ----------------------
// SHELL INTERATTIVA
// ----------------------
const shellInput = document.getElementById("shell-input");
const shellOutput = document.getElementById("shell-output");

// Comandi disponibili
const commands = ["help", "whoami", "skills", "stack", "experience", "contact", "clear", "ls"];

// Cronologia comandi
let history = [];
let historyIndex = -1;

function printOutput(text) {
  if (!shellOutput) return;
  shellOutput.innerText = text;
}

function printOutputHTML(html) {
  if (!shellOutput) return;
  shellOutput.innerHTML = html;
}

// Mostra help
function showHelp() {
  const txt =
    "Comandi disponibili:\n" +
    commands
      .filter(c => c !== "ls") // ls lo usiamo per 'lista comandi'
      .map(c => "  - " + c)
      .join("\n") +
    "\n\nTip:\n  usa TAB per autocompletare, ↑ e ↓ per scorrere la cronologia.";
  printOutput(txt);
}

// Esegue il comando
function runCommand(cmd) {
  const value = cmd.trim().toLowerCase();
  if (!value) {
    printOutput("");
    return;
  }

  // Aggiungi a cronologia
  history.push(value);
  historyIndex = history.length;

  switch (value) {
    case "help":
      showHelp();
      showPanel("intro");
      break;
    case "whoami":
      printOutput("Eseguo: whoami");
      showPanel("whoami");
      break;
    case "skills":
      printOutput("Eseguo: skills");
      showPanel("skills");
      break;
    case "stack":
      printOutput("Eseguo: stack");
      showPanel("stack");
      break;
    case "experience":
      printOutput("Eseguo: experience");
      showPanel("experience");
      break;
    case "contact":
      printOutput("Eseguo: contact");
      showPanel("contact");
      break;
    case "clear":
      printOutput("");
      break;
    case "ls":
      printOutput(
        "Comandi:\n" +
        commands.map(c => "  " + c).join("\n")
      );
      break;
    default:
      printOutput(`command not found: ${value}\nDigita "help" per i comandi disponibili.`);
      break;
  }
}

// Autocompletamento stile bash
function autocomplete(current) {
  const input = current.trim().toLowerCase();
  if (!input) return;

  const matches = commands.filter(c => c.startsWith(input));

  if (matches.length === 1) {
    // Completa direttamente
    shellInput.value = matches[0];
    printOutput("");
  } else if (matches.length > 1) {
    // Mostra suggerimenti
    const html =
      "<div class='suggestion-list'>Possibili comandi:<br>" +
      matches.map(m => "&nbsp;&nbsp;" + m).join("<br>") +
      "</div>";
    printOutputHTML(html);
  } else {
    // nessuna corrispondenza
    printOutput(`Nessun comando trovato che inizi con "${input}"`);
  }
}

// Gestione eventi input
if (shellInput) {
  shellInput.addEventListener("keydown", (e) => {
    const value = shellInput.value;

    // Invio → esegui comando
    if (e.key === "Enter") {
      e.preventDefault();
      runCommand(value);
      shellInput.value = "";
      return;
    }

    // TAB → autocomplete
    if (e.key === "Tab") {
      e.preventDefault();
      autocomplete(value);
      return;
    }

    // Frecce ↑ / ↓ per cronologia
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0 && historyIndex > 0) {
        historyIndex--;
        shellInput.value = history[historyIndex] || "";
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
        historyIndex++;
        shellInput.value = history[historyIndex] || "";
      } else {
        historyIndex = history.length;
        shellInput.value = "";
      }
      return;
    }
  });
}

