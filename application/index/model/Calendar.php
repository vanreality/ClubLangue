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
        //TODO select insert
        $db = Db::name("events");
        $db ->insertGetId([
            'title'=>'Todo',
            'start_event'=> '2019-06-25 05:00:00',
            'end_event'=>'2019-06-25 06:00:00',
        ]);
    }
    public function deleteEvent($id){
        Calendar::where("id",$id)->delete();
    }

    public function loadEvent(){
        $idload = session('userinfo')["id"];
        $res=Calendar::where('user_id',$idload)->select();
        return $res;
    }
    public function loadRefEvent(){
        $type=0;
        switch (\session("type")){
            case "apprendre":
                $type=1;
                break;
            case "enseigner":
                $type=0;
                break;
        }
        $res=Calendar::where('user_id',\session("ref_id"))
                     ->where("status",0)
                     ->where("type",$type)
                     ->select();
        return $res;
    }

    public function updateRefEvent($id){
        Calendar::where("id",$id)->data("status",1)->update;
    }

    public function dragInsertEvent($time, $language, $type){
        $data = [
            'user_id'   => session("userinfo")["id"],
            'time'      => $time,
            'language'  => $language,
            'type'      => $type
        ];
        Calendar::insert($data);
    }
}