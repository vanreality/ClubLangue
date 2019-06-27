<?php
namespace app\index\controller;

use app\index\model\User;
use think\Request;
use think\Db;
use think\Controller;
use think\Session;
use think\View;

class Index extends Controller
{
    public function index()
    {
        return $this->fetch();
    }

    public function index_btn(){
        if (!session('?userinfo')) {
            return $this->fetch('signin');
        } else {
            return $this->fetch('calendar');
        }
    }

    public function signin(){
        if (session('?userinfo')) {
            return $this->fetch('profile');
        } else {
            return $this->fetch();
        }
    }

    public function signin_check() {
        $email = trim(input('email'));
        $password = md5(trim(input('password'))); //进行md5加密
        // 判断用户名是否存在
//        $data = Db::name('user')->where('email',$email)->select();
//        $data = User::where('email', $email)->find()->toArray();
        $data = (new \app\index\model\User)->getUser($email);
//         dump($data);exit;
        if (!$data) {
            $this->error("Le compte n'existe pas, vérifiez votre saisie");
        }
        // 判断密码是否正确
        if ($data['password'] == $password) {
            // 一般把用户信息存入session，记录登录状态
            session('userinfo',$data);
            return $this->fetch('profile');
        }else{
            $this->error("Le mot de passe n'est pas correcte！");
        }
    }

    public function profile()
    {
        return $this->fetch();
    }

    public function signout() {
        session('userinfo', null);
        return $this->fetch('index');
    }

    public function signup()
    {
        return $this->fetch();
    }

    public function signup_check() {
        $email = trim(input('email'));
        $username = trim(input('username'));
        $password = trim(input('password'));
        $password_check = trim(input('password_check'));

        if (strlen($password) < 6) {
            $this->error('Votre mot de passe doit contenir au moins 6 caractères！');
        }

        if ($password != $password_check) {
            $this->error('Le mot de passe ne correspond pas！');
        }

        $userdata = (new \app\index\model\User)->getUser($email);
        if ($userdata) {
            $this->error("L'utilisateur existe déjà！");
        }
        $data = [
            'email'    => $email,
            'username' => $username,
            'password' => md5($password)
        ];
        $status = (new \app\index\model\User)->insert($data);
        if ($status == 1) {
            $this->success('Félicitations pour votre inscription, allez maintenant à la page de connexion！','signin');
        }else{
            $this->error('Un problème est survenu lors de l\'inscription. Veuillez réessayer ou contacter l\'administrateur.！');
        }
    }

    public function calendar(){
        if (!session('?userinfo')) {
            return $this->fetch('signin');
        } else {
            $this->assign("userinfo", session('userinfo'));
            return $this->fetch();
        }
    }

    // Part Search

    public function search() {
        if (!session('?userinfo')) {
            return $this->fetch('signin');
        } else {
            $type = trim(input("type"));
            $language = trim(input("language"));

            switch ($type) {
                case "apprendre":
                    $type = 1;
                    break;
                case "enseigner":
                    $type = 0;
                    break;
            }

            $users = (new \app\index\model\User)->searchUser($type, $language);
//            dump($users);
            $this->assign("users", $users);
            return $this->fetch();
        }
    }

    public function search_to_calendar() {
        $this->assign("ref_id", session("ref_id"));
        //TODO fetch ref_id calendar
       return $this->fetch('calendar_ref');
    }

    public function calendar_ref() {
        return $this->fetch();
    }

    // Part Message

    public function message(){
        if (!session('?userinfo')) {
            return $this->fetch('signin');
        }
        $user = session('userinfo');
        $id =  $user['id'];

        $conv = (new \app\index\model\Conversation)->getConvByUserId($id);
        /** person pour enregistrer les personnes que l'utilisateur ont deja parle**/
        $person = array();

        foreach($conv as $val){
            $ref = $val->ref_id;
            $user = $val->user_id;
            /** Pour eviter les redondence on utilise un cov pour garder les deux cotes
             * donc il faut faire un verification si user est user_id ou ref_id avant sortir les donnee*
             */
            if($ref!=$id){
                $per = User::get($ref)->toArray();
            }
            else{
                $per = User::get($user)->toArray();
            }
            /** obtenir les infos des autres personnes dans la tableau user **/
            array_push($person, $per);
        }
        $this->assign("persons",$person);

        return $this->fetch();
    }

    public function info(){
        $conv = (new \app\index\model\Conversation)->getConvByUserId(1);
        $mes = array();
        /** person pour enregistrer les personnes que l'utilisateur ont deja parle**/
        $person = array();
        /** content pour enregistrer les messages envoye **/
        $content = array();

        foreach($conv as $val){
            $cov_id = $val->id;
            echo($cov_id);
            $ref = $val->ref_id;
            /** obtenir les infos des autres personnes dans la tableau user **/
            $per = User::get($ref)->toArray();

            array_push($person, $per);
            array_merge((new \app\index\model\Message)->getMes($cov_id), $mes);
        }

        foreach($mes as $val){
            echo($val->content);
        }
    }

    public function getConversation(){
        if (!session('?userinfo')) {
            return null;
        }
        $user = session('userinfo');
        $id =  $user['id'];

        $conv = (new \app\index\model\Conversation)->getConvByUserId($id);
        /** Envoyer en meme temps les id de utilisateur a la fin de tableau **/
        array_push($conv,$id);
        return $conv;
    }

    public function getMessage(){
        if (!session('?userinfo')) {
            return null;
        }
        $user = session('userinfo');
        $id =  $user['id'];
        $conv = (new \app\index\model\Conversation)->getConvByUserId($id);

        $mes = array();
        /** person pour enregistrer les personnes que l'utilisateur ont deja parle**/
        $person = array();
        /** content pour enregistrer les messages envoye **/
        $content = array();

        foreach($conv as $val){
            $cov_id = $val->id;
            $ref = $val->ref_id;
            /** obtenir les infos des autres personnes dans la tableau user **/
            $per = User::get($ref)->toArray();
            array_push($person, $per);
            /** obtenir les infos des autres personnes dans la tableau user **/
            $mes = [strval($cov_id) => (new \app\index\model\Message)->getMes($cov_id)];
            $content += $mes;
        }
        return $content;
    }

    public function createConv(){

        if (!session('?userinfo')) {
            return null;
        }
        $user = session('userinfo');
        $id =  $user['id'];


        $user = $id;
        $ref = session('ref_id');
        $status = '1';
        $data = [
            'user_id' => $user,
            'ref_id' => $ref,
            'status' => $status
        ];
        $status = (new \app\index\model\Conversation) -> insert($data);
    }

    public function upMessage(){
        $speaker = trim(input('speaker'));
        $cov_id = trim(input('cov_id'));
        $content = trim(input('content'));

        $data = [
            'cov_id'    => $cov_id,
            'content' => $content,
            'speaker_id' => $speaker
        ];

        $status = (new \app\index\model\Message) -> insert($data);

        if ($status == 1) {

        }else{
            $this->error('Veuillez renvoyer');
        }
    }

    // Part Calendar

    public function load_event(){
        return (new \app\index\model\Calendar)->loadEvent();
    }

    public function load_ref_event($ref_id,$type){
        session('ref_id',$ref_id);
        session('type',$type);
        return (new \app\index\model\Calendar)->loadRefEvent($ref_id,$type);
    }

    public function update_ref_event($id){
        (new \app\index\model\Calendar)->updateRefEvent($id,session("type"));
    }

    public function insert_event(){
        (new \app\index\model\Calendar)->insertEvent();
    }

    public function delete_event($id){

        (new \app\index\model\Calendar)->deleteEvent($id);
    }

    public function drag_insert_event($time, $language, $type){
        (new \app\index\model\Calendar)->dragInsertEvent($time, $language, $type);
    }

    public function cancel_ref_event($id){
        (new \app\index\model\Calendar)->cancelRefEvent($id);
    }

//    public function load_event_check(){
//        return (new \app\index\model\Calendar)->loadEventCheck();
//    }
}
