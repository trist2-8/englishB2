
const storageKeys = {
  vocab: "english_b2_hub_vocab",
  readingJournal: "english_b2_hub_reading_journal",
  grammar: "english_b2_hub_grammar",
  speaking: "english_b2_hub_speaking",
  writing: "english_b2_hub_writing",
  habits: "english_b2_hub_habits",
  noteListening: "english_b2_hub_listening_notes",
  noteWriting: "english_b2_hub_writing_draft"
};

const grammarItems = [
  "Present simple / continuous / perfect / perfect continuous",
  "Past simple / continuous / perfect",
  "Future forms and degrees of certainty",
  "Modal verbs: obligation, advice, deduction, criticism",
  "Conditionals 0–3 and mixed conditionals",
  "Passive voice in common tenses",
  "Reported speech and reporting verbs",
  "Relative clauses and reduced relative clauses",
  "Articles, quantifiers and determiners",
  "Gerunds, infinitives and verb patterns",
  "Comparing ideas with linkers",
  "Complex sentences with clauses of reason, result and contrast"
];

const speakingItems = [
  "Tôi có trả lời đúng trọng tâm câu hỏi không?",
  "Tôi có mở và kết câu trả lời rõ ràng không?",
  "Tôi có dùng ví dụ cụ thể không?",
  "Tôi có dùng linking words không?",
  "Tôi có nói đủ 60–120 giây không?",
  "Tôi có tự sửa hoặc diễn đạt lại khi bí từ không?",
  "Tôi có nghe lại bản ghi âm và sửa 3 lỗi lớn nhất không?"
];

const writingItems = [
  "Có trả lời đúng task và đúng dạng bài không?",
  "Mở bài có nêu chủ đề / mục đích rõ không?",
  "Mỗi đoạn có 1 ý chính rõ ràng không?",
  "Có ví dụ hoặc giải thích hỗ trợ không?",
  "Có dùng linking words hợp lý không?",
  "Có kiểm tra verb tense, articles, prepositions không?",
  "Kết bài có tóm ý hoặc recommendation không?"
];

const habitItems = [
  "Học 50+ từ/collocations trong tuần",
  "Ôn ít nhất 3 chủ điểm grammar",
  "Nghe 4 bài có transcript",
  "Nghe 2 bài không transcript ngay từ đầu",
  "Đọc 3 bài và tóm tắt lại",
  "Nói 4 buổi có ghi âm",
  "Viết ít nhất 1 đoạn / 1 bài ngắn",
  "Làm 1 bài test hoặc sample task"
];

const speakingPrompts = [
  "Describe a skill you want to improve this year. Why is it important and how will you improve it?",
  "Do you think online learning is better than classroom learning? Give reasons and examples.",
  "Talk about a memorable trip or place you visited. What made it special?",
  "What are the advantages and disadvantages of using social media every day?",
  "Describe a problem students often face when learning English and suggest two solutions.",
  "Do you prefer working alone or in a team? Explain your opinion with examples.",
  "What makes a good teacher? Talk about qualities, examples and your own experience.",
  "How can young people use technology in a productive way instead of wasting time?"
];

const writingPrompts = [
  "Essay: Do online courses make education more effective? Give your opinion and examples.",
  "Article: Write an article about the best way to improve English outside the classroom.",
  "Review: Write a review of a useful app, website or course for learning English.",
  "Report: Suggest two ways your school or team can help learners improve their English faster.",
  "Email: Write to a friend explaining how you plan to reach B2 in English this year.",
  "Opinion paragraph: Should students use AI tools when learning languages? Why / why not?"
];

const flashcards = [
  {front:"take responsibility", back:"chịu trách nhiệm", example:"You need to take responsibility for your mistakes."},
  {front:"make progress", back:"tiến bộ", example:"Consistent practice helps you make progress."},
  {front:"meet a deadline", back:"đáp ứng hạn chót", example:"We worked late to meet the deadline."},
  {front:"in my opinion", back:"theo quan điểm của tôi", example:"In my opinion, reading daily is essential."},
  {front:"a wide range of", back:"một phạm vi rộng của", example:"B2 learners need a wide range of vocabulary."},
  {front:"deal with", back:"xử lý", example:"She can deal with common problems in English."}
];

function getSaved(key, fallback = []) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (error) {
    return fallback;
  }
}
function setSaved(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function bindTabs() {
  const tabs = document.querySelectorAll(".skill-tab");
  const panels = document.querySelectorAll(".resource-panel");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => item.classList.remove("active"));
      panels.forEach((panel) => panel.classList.remove("active"));
      tab.classList.add("active");
      const target = document.getElementById(tab.dataset.panel);
      if (target) target.classList.add("active");
    });
  });
}
function bindAccordions() {
  document.querySelectorAll(".accordion-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.closest(".accordion-item").classList.toggle("open");
    });
  });
}
function renderCheckboxList(containerId, items, storageKey) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const saved = getSaved(storageKey, Array(items.length).fill(false));
  container.innerHTML = items.map((item, index) => `
    <div class="check-item">
      <input type="checkbox" data-key="${storageKey}" data-index="${index}" ${saved[index] ? "checked" : ""} />
      <label>${item}</label>
    </div>
  `).join("");
  container.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const current = getSaved(storageKey, Array(items.length).fill(false));
      current[Number(checkbox.dataset.index)] = checkbox.checked;
      setSaved(storageKey, current);
      if (storageKey === storageKeys.habits) updateProgress();
    });
  });
}
function updateProgress() {
  const data = getSaved(storageKeys.habits, Array(habitItems.length).fill(false));
  const done = data.filter(Boolean).length;
  const percent = Math.round((done / habitItems.length) * 100);
  const text = document.getElementById("progressText");
  const bar = document.getElementById("progressBar");
  if (text) text.textContent = `${done} / ${habitItems.length} thói quen hoàn thành`;
  if (bar) bar.style.width = `${percent}%`;
}
function renderPrompt(targetId, list) {
  const box = document.getElementById(targetId);
  if (!box) return;
  box.textContent = list[Math.floor(Math.random() * list.length)];
}
function bindPromptButton(buttonId, boxId, list) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;
  btn.addEventListener("click", () => renderPrompt(boxId, list));
}
function renderVocabList() {
  const container = document.getElementById("vocabList");
  if (!container) return;
  const list = getSaved(storageKeys.vocab, []);
  if (!list.length) {
    container.innerHTML = `<div class="note">Chưa có từ nào được lưu. Hãy thêm từ từ bài đọc, bài nghe hoặc speaking practice của bạn.</div>`;
    return;
  }
  container.innerHTML = list.map((item, index) => `
    <div class="vocab-item">
      <div>
        <strong>${item.word}</strong>
        <div class="small">${item.meaning}</div>
        ${item.example ? `<p style="margin-top:8px;color:var(--muted)">${item.example}</p>` : ""}
      </div>
      <button class="icon-btn" data-remove-index="${index}" title="Xóa">✕</button>
    </div>
  `).join("");
  container.querySelectorAll("[data-remove-index]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.removeIndex);
      const current = getSaved(storageKeys.vocab, []);
      current.splice(index, 1);
      setSaved(storageKeys.vocab, current);
      renderVocabList();
    });
  });
}
function bindVocabSave() {
  const btn = document.getElementById("saveWordBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const wordInput = document.getElementById("wordInput");
    const meaningInput = document.getElementById("meaningInput");
    const exampleInput = document.getElementById("exampleInput");
    const word = wordInput.value.trim();
    const meaning = meaningInput.value.trim();
    const example = exampleInput.value.trim();
    if (!word || !meaning) {
      alert("Hãy nhập ít nhất từ/cụm từ và nghĩa.");
      return;
    }
    const current = getSaved(storageKeys.vocab, []);
    current.unshift({word, meaning, example});
    setSaved(storageKeys.vocab, current);
    wordInput.value = "";
    meaningInput.value = "";
    exampleInput.value = "";
    renderVocabList();
  });
}
function bindFlashcards() {
  const card = document.getElementById("flashcard");
  const btn = document.getElementById("nextFlashcardBtn");
  if (!card || !btn) return;
  let idx = 0;
  let showBack = false;
  function paint() {
    const item = flashcards[idx];
    card.innerHTML = showBack
      ? `<div><div class="kicker">Meaning</div><h3>${item.back}</h3><p>${item.example}</p><div class="hint">Bấm vào thẻ để quay lại mặt trước</div></div>`
      : `<div><div class="kicker">Collocation</div><h3>${item.front}</h3><div class="hint">Bấm vào thẻ để xem nghĩa và ví dụ</div></div>`;
  }
  card.addEventListener("click", () => { showBack = !showBack; paint(); });
  btn.addEventListener("click", () => { idx = (idx + 1) % flashcards.length; showBack = false; paint(); });
  paint();
}
function bindTextStorage(textareaId, key) {
  const el = document.getElementById(textareaId);
  if (!el) return;
  const saved = getSaved(key, "");
  if (typeof saved === "string") el.value = saved;
  el.addEventListener("input", () => setSaved(key, el.value));
}
function renderJournal() {
  const container = document.getElementById("journalList");
  if (!container) return;
  const list = getSaved(storageKeys.readingJournal, []);
  if (!list.length) {
    container.innerHTML = `<div class="note">Chưa có reading journal. Sau mỗi bài đọc, hãy lưu 1 câu tóm tắt + 3 từ/cụm mới.</div>`;
    return;
  }
  container.innerHTML = list.map((item, index) => `
    <div class="journal-item">
      <div>
        <strong>${item.title}</strong>
        <p style="margin:0 0 8px;color:var(--muted)">${item.summary}</p>
        <div class="small code-like">${item.words}</div>
      </div>
      <button class="icon-btn" data-remove-journal="${index}" title="Xóa">✕</button>
    </div>
  `).join("");
  container.querySelectorAll("[data-remove-journal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.removeJournal);
      const current = getSaved(storageKeys.readingJournal, []);
      current.splice(index, 1);
      setSaved(storageKeys.readingJournal, current);
      renderJournal();
    });
  });
}
function bindJournalSave() {
  const btn = document.getElementById("saveJournalBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const title = document.getElementById("journalTitle").value.trim();
    const summary = document.getElementById("journalSummary").value.trim();
    const words = document.getElementById("journalWords").value.trim();
    if (!title || !summary) {
      alert("Hãy nhập ít nhất tiêu đề và tóm tắt.");
      return;
    }
    const current = getSaved(storageKeys.readingJournal, []);
    current.unshift({title, summary, words});
    setSaved(storageKeys.readingJournal, current);
    document.getElementById("journalTitle").value = "";
    document.getElementById("journalSummary").value = "";
    document.getElementById("journalWords").value = "";
    renderJournal();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  bindTabs();
  bindAccordions();
  renderCheckboxList("grammarChecklist", grammarItems, storageKeys.grammar);
  renderCheckboxList("speakingChecklist", speakingItems, storageKeys.speaking);
  renderCheckboxList("writingChecklist", writingItems, storageKeys.writing);
  renderCheckboxList("habitChecklist", habitItems, storageKeys.habits);
  renderPrompt("speakingPromptBox", speakingPrompts);
  bindPromptButton("newSpeakingPromptBtn", "speakingPromptBox", speakingPrompts);
  renderPrompt("writingPromptBox", writingPrompts);
  bindPromptButton("newWritingPromptBtn", "writingPromptBox", writingPrompts);
  renderVocabList();
  bindVocabSave();
  bindFlashcards();
  bindTextStorage("listeningNotes", storageKeys.noteListening);
  bindTextStorage("writingDraft", storageKeys.noteWriting);
  renderJournal();
  bindJournalSave();
  updateProgress();
});
