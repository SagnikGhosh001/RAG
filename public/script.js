const extractPdf = async (file) => {
  const buffer = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({
    data: buffer,
  }).promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);

    const content = await page.getTextContent();

    text += content.items.map((item) => item.str).join(" ") + "\n";
  }

  return text;
};

const extractDocx = async (file) => {
  const buffer = await file.arrayBuffer();

  const result = await mammoth.extractRawText({
    arrayBuffer: buffer,
  });

  return result.value;
};

const extractTxt = async (file) => {
  return await file.text();
};

const loadDocuments = async () => {
  const chunksContainer = document.getElementById("chunks");
  const response = await fetch(`/get-doc`);
  const data = await response.json();

  chunksContainer.innerHTML = "";

  data.database.forEach((chunk, index) => {
    const div = document.createElement("div");
    div.className = "chunk";

    div.innerHTML = `
            <strong>Chunk ${index + 1}</strong>
            <hr style="margin:8px 0">
            ${chunk.text}
        `;

    chunksContainer.appendChild(div);
  });
};

const extractFileText = async (file) => {
  const ext = file.name.split(".").pop().toLowerCase();

  if (ext === "pdf") {
    return await extractPdf(file);
  } else if (ext === "docx") {
    return await extractDocx(file);
  } else if (ext === "txt") {
    return await extractTxt(file);
  }
  return "";
};

const extractAllFileText = async (files) => {
  let finalText = "";

  for (const file of files) {
    finalText += `\n\n===== ${file.name} =====\n\n`;
    finalText += await extractFileText(file);
  }

  return finalText;
};

const addDocument = async () => {
  const documentInput = document.getElementById("docInput");
  const doc = documentInput.value.trim();
  const files = document.getElementById("fileInput").files;
  let text = "";

  console.log(files);

  if (files.length) {
    text += await extractAllFileText(files);
  }

  if (!doc && files.length === 0) {
    alert("Please enter a document or upload a file.");
    return;
  }

  const finalDoc = [doc, text]
    .filter(Boolean)
    .join("\n\n");

  await fetch(`/add-doc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ doc: finalDoc }),
  });

  documentInput.value = "";
  document.getElementById("fileInput").value = "";
  loadDocuments();
};

const appendMessage = (type, text) => {
  const chat = document.getElementById("chat");
  const message = document.createElement("div");

  message.className = `message ${type}`;

  message.innerHTML = `
        <div class="bubble">${text}</div>
    `;

  chat.appendChild(message);

  chat.scrollTop = chat.scrollHeight;
};

const askQuestion = async () => {
  const chat = document.getElementById("chat");
  const questionInput = document.getElementById("question");
  const question = questionInput.value.trim();
  if (!question) return;

  appendMessage("user", question);
  questionInput.value = "";

  appendMessage("bot", "Thinking...");
  const thinking = chat.lastElementChild;

  const response = await fetch(`/ask-question`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  const data = await response.json();

  thinking.remove();
  appendMessage("bot", data.data);
};

globalThis.window.onload = () => {
  const questionInput = document.getElementById("question");

  document.getElementById("uploadBtn").addEventListener("click", () => {
    document.getElementById("fileInput").click();
  });

  document.getElementById("fileInput").addEventListener("change", (e) => {
    const files = [...e.target.files];

    document.getElementById("selectedFiles").innerHTML = files.length === 0
      ? ""
      : files.map((file) => `📄 ${file.name}`).join("<br>");
  });

  document
    .getElementById("addDocBtn")
    .addEventListener("click", addDocument);

  document
    .getElementById("askBtn")
    .addEventListener("click", askQuestion);

  questionInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      askQuestion();
    }
  });

  loadDocuments();
};
