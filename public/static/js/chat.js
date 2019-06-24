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


$(document).ready(function(){

  var url = 'getMessage';
  var data = {

  };

  $.get(url,data,function(data){
    friends.all.forEach(function (f) {

      var name = f.querySelector('.name').innerText;
      var id = f.getAttribute('data-chat');

      //TODO Il faut remplacer les cov_id par les data[]
      var div = '<div class="chat" data-chat=' + id + ' ' + 'cov_id=' + 1 + '>';
      $('.right .top').after(div);

    });

    allCov(data);
  });
});

function allCov(data){
    var message ={
      all: document.querySelectorAll('.right .chat'),
    };

    message.all.forEach(function (m) {
      var id = m.getAttribute('data-chat');   /** id est id de personne**/
      var cov_id = m.getAttribute('cov_id'); /** id de conversation dans sql **/
      for(i=0; i<data.length; i++){
        var dCov_id = data[i].cov_id;
        var dSpeakId = data[i].speaker_id;
        if(dCov_id == cov_id && dSpeakId == id){
            var time = $('<span>::before').html(data[i].time);   /** Indiquer la date du dernier message  **/
            var start = $('<div class="conversation-start">');
            start.append(time);
            $(m).append(start);
            var divM = $('<div class="bubble you">').html(data[i].content);
            $(m).append(divM);
        }
        else{
          var time = $('<span>::before').html(data[i].time);   /** Indiquer la date du dernier message  **/
          var start = $('<div class="conversation-start">');
          start.append(time);
          $(m).append(start);
          var divY = $('<div class="bubble me">').html(data[i].content);
          $(m).append(divY);
        }
      }
    });
}


friends.all.forEach(function (f) {
  f.addEventListener('mousedown', function () {
    f.classList.contains('active') || setAciveChat(f);
  });
});

function setAciveChat(f) {
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

  chat.container.querySelector('[data-chat="' + chat.person + '"]').classList.add('active-chat');

  friends.name = f.querySelector('.name').innerText;
  chat.name.innerHTML = friends.name;
}

function createConv(){
  var id = '';
  var user = '';
  var ref = '';
  var status = '';

  var data ={
    'id': id,
    'user' : user,
    'ref' : ref,
    'status' : status
  }

}

function sentMessage() {
  var mes = $("input[name=message]").val();
  var send = $("<div class='bubble me'>::before").html(mes);
  $(".active-chat").append(send);


  var cov_id = document.querySelector('.active-chat').getAttribute('cov_id');

  var url = 'upMessage';

  var date = new Date();

  //TODO Il faut remplacer speaker par id de l'utilisateur
  var data = {
      'cov_id' : cov_id,
      'content' : mes,
      'speaker' : 1
  };


  $.get(url,data,function(data){
  })

}


function urlMessage() {

}
