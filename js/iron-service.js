const API_BACKEND = "http://localhost:63180/api";

var IronService = (function() {
  var login = function(user) {

    return fetch(`${API_BACKEND}/account`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    }).then(response => {
      if (response.ok) return response.json();

      //ERROR 400: custom message
      throw new Error("User or password not valid");

      //If I want to return the server message
      // return response.json().then(error => {
      //   //throw new Error(error.Message)
      // });
    });
  };

  var getAllNotes = function(user) {

    return fetch(`${API_BACKEND}/note`, {
      method: "GET",
      headers: {
        Authorization: `iron-auth ${getToken().token}`
      }
    }).then(response => response.json())
    
  };

  var getNoteById = function(noteId) {

    return fetch(`${API_BACKEND}/note/${noteId}`, {
      method: "GET",
      headers: {
        Authorization: `iron-auth ${getToken().token}`
      }
    }).then(response => response.json());
  };

  var createOrUpdateNote = function(note) {

    if (note.id === 0) {
      return createNote(note);
    } else {
      return editNote(note);
    }
  };

  var createNote = function(note){
    return fetch(`${API_BACKEND}/note`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `iron-auth ${getToken().token}`
      },
      body: JSON.stringify(note)
    }).then(response => {
      if (response.ok) return response.json();

      throw new Error("The note has not been created");
    });
  }

  var editNote = function(note){
    return fetch(`${API_BACKEND}/note`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `iron-auth ${getToken().token}`
      },
      body: JSON.stringify(note)
    }).then(response => {
      if (response.ok) return response.json();

      throw new Error("The note has not been updated");
    });
  }

  var deleteNote = function(noteId) {

    return fetch(`${API_BACKEND}/note/${noteId}`, {
      method: "DELETE",
      headers: {
        Authorization: `iron-auth ${getToken().token}`
      }
    }).then(response => {
      if (response.ok) return response.json();

      throw new Error("The note has not been deleted");
    })
  };

  getToken = function() {
    var token = JSON.parse(localStorage.getItem("token"));
    return token;
  };

  getCurrentUser = function() {
    var token = getToken();
    return token.profile;
  };

  isAuthenticated = function() {
    var token = getToken();

    if (typeof token === "undefined" || token === null) {
      return false;
    }

    let dateNow = new Date();
    if (dateNow > token.expirationDate) {
      return false;
    }

    return true;
  };

  return {
    login: login,
    getAllNotes: getAllNotes,
    getNoteById: getNoteById,
    createOrUpdateNote: createOrUpdateNote,
    deleteNote: deleteNote,
    getCurrentUser: getCurrentUser,
    isAuthenticated: isAuthenticated
  };
})();


function handlerError(error){
  var message = error.message;

  if (!navigator.onLine)
   message = "You are Offline, please connect to the Internet";

  mdtoast(message, {
    interaction: true,
    interactionTimeout: 5000,
    type: 'error'
});
}
