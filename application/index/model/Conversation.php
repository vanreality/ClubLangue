<?php


namespace app\index\model;

use think\Model;

class Conversation extends Model
{
    public function getConvByUserId($id) {
        $data = Conversation::where('user_id|ref_id', $id)->select();
        return $data;
    }
}