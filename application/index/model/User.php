<?php


namespace app\index\model;

use think\Db;
use think\Model;

class User extends Model
{
    public function getUser($email) {
        $data = User::where('email', $email)->find();
        return $data;
    }

    public function searchUser($type, $language) {
        $uid = Db::table('user u, calendar c')
            ->Distinct(true)
            ->field('c.user_id')
            ->where('u.id = c.user_id')
            ->where('c.status = 0')
            ->where('c.language = "' . $language . '"')
            ->where('c.type = "' . $type . '"')
            ->select();
        $data = [];
        foreach ($uid as $val) {
            array_push($data, Db::table('user')
                ->where('id', $val['user_id'])
                ->find());
        }
        return $data;
    }

    public function saveDescription($uid, $description) {
        $user = User::where('id', $uid)->find();
        $user->description = $description;
        $user->save();
    }
}