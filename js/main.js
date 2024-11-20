// Function to load tasks from localStorage when the page loads
function loadTasks() {
  // Get tasks from localStorage, if any, or initialize as an empty array
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const result = document.querySelector("#result");

  // Iterate over the tasks and create their HTML elements
  tasks.forEach(task => {
    const myLi = createTaskElement(task.content);
    const checkbox = myLi.querySelector(".task-checkbox");

    // Set the checkbox state based on the saved state from localStorage
    checkbox.checked = task.checked;

    // If the task is checked, apply the strikethrough style (mark it as done)
    if (task.checked) {
      const taskContent = myLi.querySelector(".task-content");
      taskContent.style.textDecoration = "line-through";  // Strikethrough the text
      taskContent.style.color = "gray";  // Change the text color to gray
    }

    // Append the task to the result list
    result.appendChild(myLi);
  });
}

// Function to create a task element (HTML structure for each task)
function createTaskElement(work) {
  const myLi = document.createElement("li");
  myLi.className = "flexes"; // Add class for styling the list item

  // Create task content (the text part of the task)
  const taskContent = document.createElement("div");
  taskContent.className = "task-content";
  taskContent.textContent = work; // Set the task text

  // Create actions container (buttons like edit and delete)
  const actionsDiv = document.createElement("div");
  actionsDiv.className = "task-actions";

  // Create checkbox for task completion
  const checker = document.createElement("input");
  checker.type = "checkbox";
  checker.className = "task-checkbox";

  // Create delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "Delete";
  deleteBtn.className = "btn-delete";  // Add class for styling or targeting

  // Create edit button
  const editBtn = document.createElement("button");
  editBtn.innerHTML = "Edit";
  editBtn.className = "btn-edit";  // Add class for styling or targeting

  // Append the created elements to the actions div
  actionsDiv.appendChild(checker);
  actionsDiv.appendChild(deleteBtn);
  actionsDiv.appendChild(editBtn);

  // Append the task content and actions to the list item
  myLi.appendChild(taskContent);
  myLi.appendChild(actionsDiv);

  return myLi; // Return the created list item
}

// Event listener for the form submission (adding a new task)
document.querySelector("form").addEventListener("submit", getData);

function getData(event) {
  event.preventDefault(); // Prevent form from reloading the page

  const work = document.querySelector("#work").value; // Get the task content
  const result = document.querySelector("#result");

  // If the input is empty, return early (do nothing)
  if (work.length === 0) {
    return;
  }

  // Create a new task element and add it to the list
  const myLi = createTaskElement(work);
  result.appendChild(myLi);

  // Clear the input field and set focus back to it
  document.querySelector("#work").value = "";
  document.querySelector("#work").focus();

  // Save the tasks to localStorage
  saveTasks();

  // Show a success notification
  showNotification("Task added successfully!");
}

// Event listener for task actions (delete, checkbox, edit) on the result container
document.querySelector("#result").addEventListener("click", function(event) {
  // If the delete button is clicked, remove the task
  if (event.target.classList.contains("btn-delete")) {
    event.target.closest("li").remove();  // Remove the task from the list
    showNotification("Task deleted successfully!");  // Show a notification
    saveTasks();  // Save the updated tasks to localStorage
  }

  // If the checkbox is clicked, mark the task as completed or not
  if (event.target.classList.contains("task-checkbox")) {
    const taskContent = event.target.closest("li").querySelector(".task-content");

    // If the task is already marked as completed (has strikethrough), remove the style
    if (taskContent.style.textDecoration === "line-through") {
      taskContent.style.textDecoration = "none";  // Remove strikethrough
      taskContent.style.color = "black";  // Restore original color
    } else {
      taskContent.style.textDecoration = "line-through";  // Apply strikethrough
      taskContent.style.color = "gray";  // Change color to gray
    }

    saveTasks();  // Save the updated task list to localStorage
  }

  // If the edit button is clicked, enable editing the task
  if (event.target.classList.contains("btn-edit")) {
    const taskContent = event.target.closest("li").querySelector(".task-content");

    // Create an input field pre-filled with the current task text
    const currentText = taskContent.textContent;
    const input = document.createElement("input");
    input.type = "text";
    input.value = currentText;
    taskContent.textContent = '';  // Remove the current text
    taskContent.appendChild(input);  // Add the input field to the task

    // When user presses Enter, save the new text as the task content
    input.addEventListener("keydown", function(e) {
      if (e.key === "Enter" && input.value.trim() !== "") {
        taskContent.textContent = input.value;  // Update task text with new value
        saveTasks();  // Save the changes to localStorage
        showNotification("Task edited successfully!");  // Show a notification
      }
    });
  }
});

// Function to show notification messages (temporary pop-up alerts)
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";  // Add a class for styling
  notification.textContent = message;  // Set the message text

  document.body.appendChild(notification);  // Add notification to the page

  // Remove the notification after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Function to save the tasks to localStorage
function saveTasks() {
  const tasks = [];
  const listItems = document.querySelectorAll("#result li");  // Get all list items

  // Loop through each list item and push its data to the tasks array
  listItems.forEach(item => {
    tasks.push({
      content: item.querySelector(".task-content").textContent,  // Get task text
      checked: item.querySelector(".task-checkbox").checked  // Get checkbox state
    });
  });

  // Save the tasks array to localStorage
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage when the page is loaded
window.addEventListener("load", loadTasks);
