<?php


namespace app\index\model;

use think\Model;
use think\Db;
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
        //TODO query要根据用户id

        $res = Db::query("select * from calendar");
//        foreach($res as $row)
//        {
//            $data[] = array(
//                'id'   => $row["id"],
//                'user_id'   => $row["user_id"],
//                'ref_id'   => $row["ref_id"],
//                'status'   => $row["status"],
//                'time'     =>$row['time'],
//                'language'    =>$row['language'],
//                'type'     =>$row['type']
//            );
//        }
//        View::share("load",json_encode($data));

//        return json_encode($res);
        return $res;
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