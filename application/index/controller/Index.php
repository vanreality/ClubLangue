<?php
namespace app\index\controller;

use think\Request;

class Index
{
    public function index()
    {
        return view();
    }

    public function info(Request $request)
    {
//        dump(config());
        dump($request->domain());
        dump($request->path());

//        session("test", "test");
        dump($request->session());
    }
}
