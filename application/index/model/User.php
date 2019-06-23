<?php


namespace app\index\model;

use think\Model;

class User extends Model
{
    public function getUser($email) {
        $data = User::where('email', $email)->find()->toArray();
        return $data;
    }
}