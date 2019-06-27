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

        $res1=Calendar::where("ref_id",$idload)->select();

        $res2=Calendar::where('user_id',$idload)->select();

        $res=array_merge($res1,$res2);
        return $res;
    }

//    public function loadEventCheck(){
//
//        $idload = session('userinfo')["id"];
//
//
//        return $res1;
//    }

    public function loadRefEvent($ref_id, $type){
        switch ($type){
            case "apprendre":
                $type=1;
                break;
            case "enseigner":
                $type=0;
                break;
        }
        $res=Calendar::where('user_id',$ref_id)
                     ->where("status",0)
                     ->where("type",$type)
                     ->select();
        return $res;
    }

    public function updateRefEvent($id){

        Calendar::where("id",$id)->data("status",1)->update();
        Calendar::where("id",$id)->data("ref_id",session('userinfo')["id"])->update();

    }

    public function cancelRefEvent($id){
        Calendar::where("id",$id)->data("status",0)->update();
        Calendar::where("id",$id)->data("ref_id",null)->update();

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