/**
 * Pour faciliter les manipulation des conversations
 * Tout d'abord, on definir deux tableaux
 * un pour enregistrer les donnees des contacteurs
 * l'autre pour enregistrer les donnees des conversations
 * **/
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

/**
 * Pour garder id de l'utilisateur
 * on definit d'abord une variable
 * **/
var id_user;

/**
 * On utilise ready pour faire des requetes et operations apres la page est bien complie
 * **/
$(document).ready(function(){
  var urlC = 'getConversation';
  var urlM = 'getMessage';

  /**
   * Ici on utilise ajax pour envoyer les requetes et receoir les reponses
   * grace a jQuery on peut plus facile a faire des operations sans programmer trop
   * la methode get est une facon de ajax qui ont la meme fonctionnalite
   * que l'on utilise la methode ajax avec type de get
   * **/
    $.get(urlC,{},function(data) {
        id_user = data[data.length-1];
        for(i=0; i<data.length-1; i++) {
            var idR = data[i].ref_id;
            var idU = data[i].user_id;
            var cov_id = data[i].id;
            var status = data[i].status;

            /**
             * Cette fonction est qu'utiliser au debut d'ouvrir la page
             * On considere que le status des covs est 0 veut dire pas lu
             * le status est 1 veut dire deja lu
             * si le cov est pas lu
             * le couleur de l'etat est rouge
             * si le cov est lu
             * le couleur de l'etat est vert
             * */

            /**
             * Ici on doit verifier si l'utilsateur est user_id or ref_id
             *  **/

            if(idR == id_user){
                var div = '<div class="chat" data-chat=' + idU + ' ' + 'cov_id=' + cov_id + '>';
                if(status == 0){
                    var friend = friends.list.querySelector('[data-chat="' + idU + '"]');
                    var statusCov = friend.querySelector('.etatDeCov');
                    $(statusCov).css('background', 'red');
                }

            }else{
                var div = '<div class="chat" data-chat=' + idR + ' ' + 'cov_id=' + cov_id + '>';
                if(status == 0){
                    var friend = friends.list.querySelector('[data-chat="' + idR + '"]');
                    var statusCov = friend.querySelector('.etatDeCov');
                    $(statusCov).css('background', 'red');
                }
            }
            $('.right .top').after(div);
        }
    });

    /** ajax get pour obtenir les donnees de messages **/
    $.get(urlM,{ },function(data){
        allCov(data);
    });

    /** on appelle la fonction gestionMes pour actualiser les mes  **/
    gestionMes();
});


/** allCov est pour initialiser
 * tous les conversation et tous les messages inclures
 * dans un premier temps
 *
 * Sachant que chaque message a une date
 * donc chaque fois quand on ajoute un message dans notre div de chat
 * on ajoute en meme temps de la date envoye
 * Pour la dernier message envoye
 * on l'ajoute dans la partie a gauche: le module des personnes
 * **/
function allCov(data){
    var conversation ={
        all: document.querySelectorAll('.right .chat'),
    };

    conversation.all.forEach(function (c) {
        var id = c.getAttribute('data-chat');   /** id est id de contacteur**/
        var cov_id = parseInt(c.getAttribute('cov_id')); /** id de conversation dans sql **/

        var friend = friends.list.querySelector('[data-chat="' + id + '"]');
        var time = friend.querySelector('.time');
        var statu = friend.querySelector('.etatDeCov');
        var length = data[cov_id].length;
        if(length>0) {
            var date = data[cov_id][length - 1].time.substr(5, 16);
            var idSpeakFin = data[cov_id][length-1].speaker_id;
            $(time).html(date);
            console.log(idSpeakFin);

            /** verifier le status par la fin de parleur
             * si l'utilisateur a repondu
             * le couleur de fond est vert
             * si l'utilisatuer a pas encore repondu
             * le couleur de fond est rouge
             * **/
            if(idSpeakFin == id_user){
                $(statu).css('background', 'green');
                console.log("rest");
            }else{
                $(statu).css('background', 'red');
            }

            for (i = 0; i < data[cov_id].length; i++) {
                var dataM = data[cov_id];
                var dSpeakId = dataM[i].speaker_id;

                /** il faut verifier speak_id est utilisateur ou contacteur
                 *
                 * si speak_id egale id de contacteur on utlise la class bubble you
                 * si speak_id egale pas id de contacteur
                 * c'est a dire c'est utlisateur qui envoie le message
                 * on utilise la class bubble me
                 * **/
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
        }
    })
}

/** la fonction gestionMes pour automatiquement actualiser les messages **/
function gestionMes(){
    var urlM = 'getMessage';

    $.get(urlM,{ },function(data){
        actualiseCov(data);
    });

    setTimeout(gestionMes,1000);
}


/** cette fonction est un peu pres pareil que la fonction allCov
 * mais cette fonction on utilise pour actualiser tous les 5 seconds
 * Donc pour bien verifier si les messages sont maj ou restent pas changer
 * on propose de faire avec la date du dernier message
 * c'est a dire si la dernier message est pareil qu'avant on actualise pas
 * la contenu de conversation
 * sinon on maj que la dernier message et la date des deux modules
 *
 * De plus on a pense pour les conversations qui sont pas etat d'active
 * chaque fois quand il y a des messages de ces cons ajoute
 * on change la couleur d'etat dans la module a gauch
 * c'est a dire le petit point devient rouge
 * **/

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
        if(length>0) {
            var date = data[cov_id][length - 1].time.substr(5, 16);

            if ($(time).html() != date) {
                $(time).html(date);
                var dataM = data[cov_id];
                var dSpeakId = dataM[length - 1].speaker_id;

                if (dSpeakId == id) {
                    var time = $('<span>::before').html(dataM[length - 1].time);
                    var start = $('<div class="conversation-start">');
                    start.append(time);
                    $(c).append(start);
                    var divM = $('<div class="bubble you">').html(dataM[length - 1].content);
                    $(c).append(divM);
                } else {

                }

                if (c.getAttribute('class') == 'chat') {
                    $(etat).css('background', 'red');
                }

            }
        }
    });
}

/** ici est pour choisir les conversation qu'on veut se parler
 * Donc la changment d'activer un chat contient
 * la couleur du fond a gauche pour les infos de personnes devient bleu
 * les contenus de conversation doivent etre afficher
 *
 * pour les donnees dans la base de donnees
 * chaque fois quand on clique dnas un conversation
 * on change l'etat de cov a deja lu ca veut dire que le status vaut 1
 *
 * De plus on change la couleur de l'etat de conversation
 * c'est a dire la couleur de l'etat devient vert
 * **/
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

  if(chat.current!=null){
    chat.current.classList.remove('active-chat');
  }

  var selectChat = chat.container.querySelector('[data-chat="' + chat.person + '"]');
  if(selectChat!=null){
      selectChat.classList.add('active-chat');
      var cov_id = selectChat.getAttribute('cov_id');
      var url = 'upConversation';
      var data = {
          'cov_id' : cov_id,
          'statu' : 1
      };

      $.post(url,data,function(data){
      },"json");
  }

  friends.name = f.querySelector('.name').innerText;
  chat.name.innerHTML = friends.name;
}


/** cette fonction est pour quand on a trop de contacteurs
 * on peut chercher les gens qu'on veut parler par taper quelques lettres de leur nom
 * a chercher dans la list de contact
 * */
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

/**ici est pour aller directement au fond de notre conversation
 * quand on clique le zone de saisie
 * **/
$(document).on('click','input[name=message]',function(){
    $(".active-chat").css('justify-content','flex-end');
});


/**cette fonction est pour quand on taper enter
 * la message peut aussi envoyer
 * **/
$('input[name=message]').keydown(function(event){
    if(event.keyCode == 13){
        sentMessage();
    }
});

/**cette fonction est pour envoyer les messages et maj les donnees dans BD
 *
 * on utlise aussi la facon ajax mais avec la type de post a envoyer les requetes
 *
 * de plus chaque fois quand on envoie un message on change l'etat de conversation
 * pour que la pronchaine fois le contacteur ou utilisateur montre dans notre site
 * qui peut bien savoir si le message envoye est lu par l'autre
 *
 * si le couleur d'etat est rouge soit le contacteur n'a pas lu soit il a repondu
 * si le couleur d'etat est vert le contacteur a lu mais pas repondu
 * */
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
      'speaker' : id_user,
      'statu' : 0
  };


  $.post(url,data,function(data){
  },"json")

}


/** cette fonction nous permet de voir les messages prcedents **/
function showMore() {
    var chatActive = $(".active-chat");
    $(chatActive).css('justify-content','start');
}
