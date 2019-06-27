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
            //TODO 修改提醒信息
            $this->error('用户名不存在，请确认后重试！');
        }
        // 判断密码是否正确
        if ($data['password'] == $password) {
            // 一般把用户信息存入session，记录登录状态
            session('userinfo',$data);
            //TODO 修改提醒信息
//            $this->success('登录成功！','index');
            return $this->fetch('profile');
        }else{
            //TODO 修改提醒信息
            $this->error('用户名和密码不匹配，请确认后重试！');
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

        //TODO 修改提醒信息
        if (strlen($password) < 6) {
            $this->error('密码长度不得小于6位！');
        }

        //TODO 修改提醒信息
        if ($password != $password_check) {
            $this->error('两次密码输入不相同！');
        }

        $userdata = (new \app\index\model\User)->getUser($email);
        if ($userdata) {
            //TODO 修改提醒信息
            $this->error('该用户名已经存在，请换一个重试！');
        }
        $data = [
            'email'    => $email,
            'username' => $username,
            'password' => md5($password)
        ];
        $status = (new \app\index\model\User)->insert($data);
        if ($status == 1) {
            //TODO 修改提醒信息
            $this->success('恭喜您注册成功，现在前往登录页！','signin');
        }else{
            //TODO 修改提醒信息
            $this->error('注册时出现问题，请重试或联系管理员！');
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
                    $type = 0;
                    break;
                case "enseigner":
                    $type = 1;
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
            $cov_id = $val->id;
            $ref = $val->ref_id;
            /** obtenir les infos des autres personnes dans la tableau user **/
            $per = User::get($ref)->toArray();
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
        $user = trim(input('user'));
        $ref = trim(input('ref'));
        $status = trim(input('id'));
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
            //TODO 修改提醒信息
            $this->error('Veuillez renvoyer');
        }
    }

    // Part Calendar

    public function load_event(){
        return (new \app\index\model\Calendar)->loadEvent();
    }

    public function load_ref_event(){
        return (new \app\index\model\Calendar)->loadRefEvent();
    }
    public function insert_event(){
        (new \app\index\model\Calendar)->insertEvent();
    }

    public function delete_event($id){

        (new \app\index\model\Calendar)->deleteEvent($id);
    }

    public function drag_insert_event($time, $language, $type){
        //TODO ajax传的参数目前只写了time，需要添加其他参数
        (new \app\index\model\Calendar)->dragInsertEvent($time, $language, $type);
    }
}
