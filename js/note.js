var id = 0;
var title = $("#title-id");
var content = $("#content-note-id");


$(function() {

  if(!IronService.isAuthenticated()){
    window.location.href = '../index.html';
    return;
  }


  id = getNoteId();

  if (id == 0) {
    return;
  }

  IronService.getNoteById(id).then(note => {
    console.log(note);
    title.val(note.title);
    content.val(note.content);
  })
  .catch(handlerError);
});

function getNoteId() {
  const href = location.href;
  const id = href.substr(href.lastIndexOf("?") + 4);
  return parseInt(id, 10);
}

function onSave() {
  let noteEntity = {
    id: id,
    title: title.val(),
    content: content.val()
  };

  if (
    noteEntity.title.trim().length === 0 ||
    noteEntity.content.trim().length === 0
  ) {
    mdtoast("Complete all fields", {
      interaction: true,
      interactionTimeout: 5000,
      type: 'warning'
  });
    return;
  }


  IronService.createOrUpdateNote(noteEntity)
  .then(result => {
    window.location.href = '../index.html';
  })
  .catch(handlerError);

}

function onCancel(){
  window.location.href = '../index.html';
}