$(document).ready(function() {
  var newItem = $("input.new-item");
  var todoItems = $(".todo-container");

  $(document).on("click", "button.delete", deleteItem);
  $(document).on("click", "button.complete", toggleComplete);
  $(document).on("click", ".todo-item", editTodo);
  $(document).on("keyup", ".todo-item", finishEdit);
  $(document).on("blur", ".todo-item", cancelEdit);
  $(document).on("submit", "#todo-form", newTodo);

  var todos = [];

  getTodos();

  function createnew() {
    todoItems.empty();
    var newItems = [];
    for (var i = 0; i < todos.length; i++) {
      newItems.push(createNewRow(todos[i]));
    }
    todoItems.prepend(newItems);
  }

  function getTodos() {
    $.get("/api/todoItems", function(data) {
      todos = data;
      createnew();
    });
  }

  function deleteItem(event) {
    event.stopPropagation();
    var id = $(this).data("id");
    $.ajax({
      method: "DELETE",
      url: "/api/todoItems/" + id
    }).then(getTodos);
    id.find("button.delete").data("id", todo.id);
  }

  function editTodo() {
    var currentTodo = $(this).data("todo");
    $(this).children().hide();
    $(this).children("input.edit").val(currentTodo.text);
    $(this).children("input.edit").show();
    $(this).children("input.edit").focus();
  }

  function toggleComplete(event) {
    event.stopPropagation();
    var todo = $(this).parent().data("todo");
    todo.complete = !todo.complete;
    updateTodo(todo);
  }

  function finishEdit(event) {
    var updatedTodo = $(this).data("todo");
    if (event.which === 13) {
      updatedTodo.text = $(this).children("input").val().trim();
      $(this).blur();
      updateTodo(updatedTodo);
    }
  }

  function updateTodo(todo) {
    $.ajax({
      method: "PUT",
      url: "/api/todoItems",
      data: todo
    }).then(getTodos);
  }


  function cancelEdit() {
    var currentTodo = $(this).data("todo");
    if (currentTodo) {
      $(this).children().hide();
      $(this).children("input.edit").val(currentTodo.text);
      $(this).children("span").show();
      $(this).children("button").show();
    }
  }

  function createNewRow(todo) {
    var newTodo = $(
      [
        "<li class='todo-item'>",
        "<button class='complete btn'>✓</button>",
        "<span>",
        todo.text,
        "</span>",
        "<input type='text' class='edit' style='display: none;'>",
        "</li>"
      ].join("")
    );

    newTodo.find("input.edit").css("display", "none");
    newTodo.data("todo", todo);
    if (todo.complete) {
      newTodo.find("button").css("background", "green");
      newTodo.find("button").addClass("delete");
      newTodo.find("span").css("text-decoration", "line-through");
    } 
    return newTodo;
  }

  function newTodo(event) {
    event.preventDefault();
    var todo = {
      text: newItem.val().trim(),
      complete: false
    };

    $.post("/api/todoItems", todo, getTodos);
    newItem.val("");
  }
});
