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
//        $password = md5(trim(input('password'))); //进行md5加密
        $password = trim(input('password'));
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
//            session('userinfo',$data);
            Session::set('userinfo', $data);
//            $this->success('登录成功！','index');
            return $this->fetch('profile');
        }else{
            //TODO 修改提醒信息
            $this->error('用户名和密码不匹配，请确认后重试！');
        }
    }

    //test

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

    public function profile()
    {
           return $this->fetch();
    }

}
