var friends = {
  list: document.querySelector('ul.people'),
  all: document.querySelectorAll('.left .person'),
  name: ''};

var chat = {
  container: document.querySelector('.container .right'),
  current: document.querySelector('.active-chat'),
  person: null,
  conversation:null,
  name: document.querySelector('.container .right .top .name'),
};

var id_user;

$(document).ready(function(){
  var urlM = 'getMessage';
  var urlC = 'getConversation';
  var data = {
  };

 $.get(urlC,data,function(data) {
    id_user = data[data.length-1];
    for(i=0; i<data.length-1; i++) {
      var idR = data[i].ref_id;
      var idU = data[i].user_id;
      var cov_id = data[i].id;
      if(idR == id_user){
          var div = '<div class="chat" data-chat=' + idU + ' ' + 'cov_id=' + cov_id + '>';
      }else{
          var div = '<div class="chat" data-chat=' + idR + ' ' + 'cov_id=' + cov_id + '>';
      }
      $('.right .top').after(div);
    }
  });

  $.get(urlM,data,function(data){
    allCov(data);
  });

});

function allCov(data){
    var conversation ={
      all: document.querySelectorAll('.right .chat'),
    };

    conversation.all.forEach(function (c) {
      var id = c.getAttribute('data-chat');   /** id est id de personne**/
      var cov_id = parseInt(c.getAttribute('cov_id')); /** id de conversation dans sql **/
      for(i=0; i<data[cov_id].length; i++) {

        var dataM = data[cov_id];
        var dSpeakId = dataM[i].speaker_id;

        if (dSpeakId == id) {
            var time = $('<span>::before').html(dataM[i].time);
            /** Indiquer la date du dernier message  **/
            var start = $('<div class="conversation-start">');
            start.append(time);
            $(c).append(start);
            var divM = $('<div class="bubble you">').html(dataM[i].content);
            $(c).append(divM);
        } else {
            var time = $('<span>::before').html(dataM[i].time);
            /** Indiquer la date du dernier message  **/
            var start = $('<div class="conversation-start">');
            start.append(time);
            $(c).append(start);
            var divY = $('<p class="bubble me">').html(dataM[i].content);
            $(c).append(divY);
        }
      }
    });
}


friends.all.forEach(function (f) {
  f.addEventListener('mousedown', function () {
    f.classList.contains('active') || setActiveChat(f);
  });
});

function setActiveChat(f) {
  if(friends.list.querySelector('.active')!=null){
    friends.list.querySelector('.active').classList.remove('active');
  }
  f.classList.add('active');

  chat.current = chat.container.querySelector('.active-chat');
  chat.person = f.getAttribute('data-chat');
  chat.conversation = f.getAttribute('cov_id');

  if(chat.current!=null){
    chat.current.classList.remove('active-chat');
  }

  var selectChat = chat.container.querySelector('[data-chat="' + chat.person + '"]');
  if(selectChat!=null){
      selectChat.classList.add('active-chat');
  }
  else{

  }

  friends.name = f.querySelector('.name').innerText;
  chat.name.innerHTML = friends.name;
}

function sentMessage() {
  var mes = $("input[name=message]").val();
  var send = $("<div class='bubble me'>::before").html(mes);
  $(".active-chat").append(send);
  $("input[name=message]").val('');

  var cov_id = document.querySelector('.active-chat').getAttribute('cov_id');

  var url = 'upMessage';

  var date = new Date();

  //TODO Il faut remplacer speaker par id de l'utilisateur
  var data = {
      'cov_id' : cov_id,
      'content' : mes,
      'speaker' : id_user
  };

  $.get(url,data,function(data){
  })

}


function urlMessage() {
}
