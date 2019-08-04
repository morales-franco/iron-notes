var notesContainer = $("#notes-container-id");
var loginBtn = $("#login-btn");

//==================== LISTENER EVENTS ====================
loginBtn.on("click", () => login());
//=========================================================

$(function() {
  if (!IronService.isAuthenticated()) {
    $("#body-login-id").removeClass("d-none");
    return;
  }

  loadHome();
});

function loadHome() {
  showGps();
  $("#body-container-id").removeClass("d-none");

  let currentUser = IronService.getCurrentUser();
  setGreeting(currentUser);

  IronService.getAllNotes()
    .then(notes => {
      notes.forEach(note => {
        createNoteElement(note);
      });
    })
    .catch(handlerError);
}

function setGreeting(user) {
  $("#title-user-id").text(user.name);
}

function createNoteElement(note) {
  let content = `
    <div class="col-md-3 mb-3">
        <div class="card border-primary" data-note-id="${note.id}">
            <div class="card-header">${note.title}</div>
            <div class="card-body">
                <p class="card-text">${note.content}</p>

                <a href="#" class="card-link" onclick="deleteNote(${
                  note.id
                })">Delete</a>
                <a href="#" class="card-link" onclick="editNote(${
                  note.id
                })">Edit</a>
            </div>
        </div>
    </div>`;

  notesContainer.prepend(content);
}

function deleteNote(id) {
  IronService.deleteNote(id)
    .then(result => {
      if (!result) {
        return;
      }

      IronService.getAllNotes().then(notes => {
        notesContainer.empty();
        notes.forEach(note => {
          createNoteElement(note);
        });
      });
    })
    .catch(handlerError);
}

function editNote(id) {
  window.location.href = "../views/note.html?id=" + id;
}

function login() {
  var username = $("#username-id").val();
  var password = $("#password-id").val();

  var user = {
    username: username,
    password: password
  };

  IronService.login(user)
    .then(token => {
      localStorage.clear("token");
      localStorage.setItem("token", JSON.stringify(token));
      $("#body-login-id").addClass("d-none");
      loadHome();
    })
    .catch(handlerError);
}

function showGps() {
  // check for Geolocation support
  if (navigator.geolocation) {
    console.log("Geolocation is supported!");
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
  } else {
    console.log("Geolocation is not supported for this Browser/OS.");
  }
}

function geoSuccess(position) {
  $("#gps-data-id").text(
    `Latitude: ${position.coords.latitude} - Longitude: ${
      position.coords.longitude
    }`
  );
}

function geoError(error) {
  console.log(error);
  $("#gps-data-id").text(error.message);
}
