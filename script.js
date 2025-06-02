function createTask(listEl, counterEl, text, totalObj, completedObj) {
  const li = document.createElement("li");
  li.className = "task-item";

  const label = document.createElement("label");
  label.className = "task-label";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "custom-checkbox";

  const span = document.createElement("span");
  span.textContent = text;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "+";
  deleteBtn.className = "delete-btn";

  label.appendChild(checkbox);
  label.appendChild(span);
  li.appendChild(label);
  li.appendChild(deleteBtn);
  listEl.appendChild(li);

  totalObj.count++;
  updateCounter();

  checkbox.addEventListener("change", () => {
    li.classList.toggle("completed", checkbox.checked);
    completedObj.count += checkbox.checked ? 1 : -1;
    updateCounter();
  });

  deleteBtn.addEventListener("click", () => {
    if (checkbox.checked) completedObj.count--;
    totalObj.count--;
    li.remove();
    updateCounter();
  });

  function updateCounter() {
    counterEl.textContent = `${completedObj.count}/${totalObj.count} Completed`;
  }
}

function setupList(container) {
  const listEl = container.querySelector("ul");
  const input = container.querySelector(".input-container input[type='text']");
  const button = container.querySelector(".input-container button"); // FIXED selector here
  const counter = container.querySelector(".task-counter");

  const totalObj = { count: 0 };
  const completedObj = { count: 0 };

  button.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) return;
    createTask(listEl, counter, text, totalObj, completedObj);
    input.value = "";
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const text = input.value.trim();
      if (!text) return;
      createTask(listEl, counter, text, totalObj, completedObj);
      input.value = "";
    }
  });
}

// Functions for modal handling - define once outside to avoid duplicate listeners

function createList(name = "New List") {
  const template = document.getElementById("taskListTemplate");
  const clone = template.content.cloneNode(true);
  const container = clone.querySelector(".container");
  const headerInput = container.querySelector(".editable-header");
  headerInput.value = name;

  // Add delete button to each list
const deleteListBtn = document.createElement("button");
deleteListBtn.textContent = "Delete";
deleteListBtn.className = "delete-list-btn";
container.appendChild(deleteListBtn);

// Handle delete list button
deleteListBtn.addEventListener("click", () => {
  openDeleteModal(container);
});


  document.getElementById("listsContainer").appendChild(container);
  setupList(container);
}

let listToDelete = null;

function openDeleteModal(container) {
  listToDelete = container;
  document.getElementById("deleteModal").classList.remove("hidden");
}

function closeDeleteModal() {
  listToDelete = null;
  document.getElementById("deleteModal").classList.add("hidden");
}

// Handle confirm/cancel buttons
document.getElementById("confirmDelete").addEventListener("click", () => {
  if (listToDelete) {
    listToDelete.remove();
    listToDelete = null;
  }
  closeDeleteModal();
});

document.getElementById("cancelDelete").addEventListener("click", () => {
  closeDeleteModal();
});


function closeModal() {
  const modal = document.getElementById("customModal");
  modal.classList.add("hidden");

  // Remove listeners when closing to prevent duplicates
  document.getElementById("modalCreate").removeEventListener("click", handleCreate);
  document.getElementById("modalCancel").removeEventListener("click", closeModal);
  document.getElementById("modalInput").removeEventListener("keydown", handleKeyDown);
}

function handleCreate() {
  const input = document.getElementById("modalInput");
  const name = input.value.trim() || "New List";
  createList(name);
  closeModal();
}

function handleKeyDown(e) {
  if (e.key === "Enter") {
    handleCreate();
  }
}

function addNewList() {
  const modal = document.getElementById("customModal");
  const input = document.getElementById("modalInput");

  modal.classList.remove("hidden");
  input.value = "";
  input.focus();

  // Remove listeners first to prevent duplicates
  document.getElementById("modalCreate").removeEventListener("click", handleCreate);
  document.getElementById("modalCancel").removeEventListener("click", closeModal);
  input.removeEventListener("keydown", handleKeyDown);


  // Add event listeners once per modal open
  document.getElementById("modalCreate").addEventListener("click", handleCreate);
  document.getElementById("modalCancel").addEventListener("click", closeModal);
  input.addEventListener("keydown", handleKeyDown);
}

document.getElementById("addListBtn").addEventListener("click", addNewList);

// Initialize with one default list
createList();

// Optional: Close custom modal when clicking outside of modal content
window.addEventListener("click", function (event) {
  const customModal = document.getElementById("customModal");
  if (event.target === customModal) {
    closeModal();
  }

  const deleteModal = document.getElementById("deleteModal");
  if (event.target === deleteModal) {
    closeDeleteModal();
  }
});
