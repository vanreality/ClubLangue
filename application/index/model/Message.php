<?php


namespace app\index\model;

use think\Model;

class Message extends Model
{
    public function getMes($cov_id) {
        $data = Message::where('cov_id', $cov_id)->find();
        return $data;
    }
}