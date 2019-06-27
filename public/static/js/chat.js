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
  var urlC = 'getConversation';
  var urlM = 'getMessage';

    $.get(urlC,{},function(data) {
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

    $.get(urlM,{ },function(data){
        allCov(data);
    });

    gestionMes();
});


function allCov(data){
    var conversation ={
        all: document.querySelectorAll('.right .chat'),
    };

    conversation.all.forEach(function (c) {
        var id = c.getAttribute('data-chat');   /** id est id de personne**/
        var cov_id = parseInt(c.getAttribute('cov_id')); /** id de conversation dans sql **/

        var friend = friends.list.querySelector('[data-chat="' + id + '"]');
        var time = friend.querySelector('.time');
        var length = data[cov_id].length;
        var date = data[cov_id][length-1].time.substr(5,16);
        $(time).html(date);

        for (i = 0; i < data[cov_id].length; i++) {
            var dataM = data[cov_id];
            var dSpeakId = dataM[i].speaker_id;

            if (dSpeakId == id) {
                var time = $('<span>::before').html(dataM[i].time);
                var start = $('<div class="conversation-start">');
                start.append(time);
                $(c).append(start);
                var divM = $('<div class="bubble you">').html(dataM[i].content);
                $(c).append(divM);
            } else {
                var time = $('<span>::before').html(dataM[i].time);
                var start = $('<div class="conversation-start">');
                start.append(time);
                $(c).append(start);
                var divY = $('<p class="bubble me">').html(dataM[i].content);
                $(c).append(divY);
            }
        }

    });
}


function gestionMes(){
    var urlM = 'getMessage';

    $.get(urlM,{ },function(data){
        actualiseCov(data);
    });

    setTimeout(gestionMes,1000);
}

function actualiseCov(data){
    var conversation ={
        all: document.querySelectorAll('.right .chat'),
    };

    conversation.all.forEach(function (c) {
        var id = c.getAttribute('data-chat');   /** id est id de personne**/
        var cov_id = parseInt(c.getAttribute('cov_id')); /** id de conversation dans sql **/

        var friend = friends.list.querySelector('[data-chat="' + id + '"]');
        var time = friend.querySelector('.time');
        var etat = friend.querySelector('.etatDeCov');
        var length = data[cov_id].length;
        var date = data[cov_id][length-1].time.substr(5,16);

        if($(time).html() != date){
            $(time).html(date);
            var dataM = data[cov_id];
            var dSpeakId = dataM[length-1].speaker_id;

            if (dSpeakId == id) {
                var time = $('<span>::before').html(dataM[length-1].time);
                var start = $('<div class="conversation-start">');
                start.append(time);
                $(c).append(start);
                var divM = $('<div class="bubble you">').html(dataM[length-1].content);
                $(c).append(divM);
            } else {

            }

            if(c.getAttribute('class') == 'chat'){
                $(etat).css('background','red');
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
    $(f.querySelector('.etatDeCov')).css('background','green');

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

function searchPerson(){
 var mesSearch = $("input[placeholder=Search]").val();
 friends.all.forEach(function (f){
     var nameP = $(f.querySelector('.name')).html();

     nameP = nameP.toUpperCase();
     mesSearch = mesSearch.toUpperCase();
     if(nameP.indexOf(mesSearch) == -1){
         $(f).hide();
     }else{
         $(f).show();
     }
 })
}


$(document).on('click','input[name=message]',function(){
    $(".active-chat").css('justify-content','flex-end');
});

function sentMessage() {
  var mes = $("input[name=message]").val();

  var send = $("<div class='bubble me'>::before").html(mes);
  $(".active-chat").append(send);
  $("input[name=message]").val('');
  var cov_id = document.querySelector('.active-chat').getAttribute('cov_id');
  var url = 'upMessage';
  var data = {
      'cov_id' : cov_id,
      'content' : mes,
      'speaker' : id_user
  };

  $.post(url,data,function(data){
  },"json")

}


function showMore() {
    var chatActive = $(".active-chat");
    $(chatActive).css('justify-content','start');
}
