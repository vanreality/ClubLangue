<?php


namespace app\index\model;

use think\Model;

class Conversation extends Model
{
    /** Parce que on a decide d'utiliser qu'une seul tableu pour enregistrer le cov des deux uers
     * Donc il faut chercher sur user_id et sur ref_id et rendre tous les covs correspondant
     */
    public function getConvByUserId($id) {
        $data = Conversation::where('user_id|ref_id', $id)->select();
        return $data;
    }


    /**Maj L'etat de conversation**/
    public function upConvStatus($id,$data){
        Conversation::where('id', $id)->setField('status',$data);
    }


}