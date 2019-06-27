<?php


namespace app\index\model;

use think\Model;
use think\Db;
use think\Session;
use think\View;
class Calendar extends Model
{
    protected $field = true;
    public function insertEvent(){

        $db = Db::name("events");
        $db ->insertGetId([
            'title'=>'Todo',
            'start_event'=> '2019-06-25 05:00:00',
            'end_event'=>'2019-06-25 06:00:00',
        ]);
    }

    public function loadEvent(){
        $id = session('userinfo')["id"];
        $res=Calendar::where('user_id','like',$id)->select();
        return $res;
    }

    public function dragInsertEvent($time){
        $data = [
            'user_id'   => 3,
            'time'      => $time,
            'language'  => "en",
            'type'      => 0
        ];
        Calendar::insert($data);
    }
}