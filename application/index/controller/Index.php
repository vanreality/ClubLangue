<?php
namespace app\index\controller;

use app\index\model\User;
use think\Request;
use think\Db;
use think\Controller;
use think\Session;

class Index extends Controller
{
    public function index()
    {
        return $this->fetch();
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

    //temp

    public function search()
    {
        return $this->fetch();
    }

    public function info() {
//        $res = Db::query("select * from user");
//        $res = Db::connect();
//        $res = Db::table("user")->select();
        $res = User::get(1)->toArray();
        return dump($res);
    }
    public function calendar(){
        return $this->fetch();
    }




}
