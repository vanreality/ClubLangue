<?php
namespace app\index\controller;

use app\index\model\User;
use think\Request;
use think\Db;
use think\Controller;

class Index extends Controller
{
    public function index()
    {
        return $this->fetch();
    }

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
    public function connexion()
        {
            return $this->fetch();
        }
    public function profile()
       {
           return $this->fetch();
       }



}
