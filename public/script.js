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

const addDocument = async () => {
  const documentInput = document.getElementById("docInput");
  const doc = documentInput.value.trim();

  if (!doc) {
    alert("Please enter a document.");
    return;
  }

  await fetch(`/add-doc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ doc }),
  });

  documentInput.value = "";

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
