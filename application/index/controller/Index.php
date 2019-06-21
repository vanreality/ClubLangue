<?php
namespace app\index\controller;

use think\Request;
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
        return dump(config());
    }
}
