<template>
    <transition name="slide-left">
        <div>
            <head-top :goBack="true" :title="'编辑地址'"></head-top>
            <van-address-edit
                :address-info="addrInfo"
                :area-list="areaList"
                :show-area="false"
                show-delete
                show-search-result
                :search-result="searchResult"
                :area-columns-placeholder="['请选择', '请选择', '请选择']"
                @save="onSave"
                @delete="onDelete"
                @change-detail="onChangeDetail"
                style="margin-top: 2rem"
            />
            
        </div>
    </transition>
</template>

<script>
import { AddressEdit, Toast } from 'vant';
import headTop from '../components/head.vue'
import axios from 'axios';
import { mapState } from 'vuex'
export default {
    components:{
       [AddressEdit.name]: AddressEdit,
       headTop
    },
    data() {
        return {
            areaList: {},
            searchResult: [],
            addrInfo: {
                name: this.$route.query.name,
                tel: this.$route.query.tel,
                addressDetail: this.$route.query.addressDetail,
                isDefault: this.$route.isDefault
            }
        }
    },
    methods: {
        onSave(content){
            // 新增
            if(this.$route.query.type === 'insert')
            axios.post(`/private/insertAddr`,{
                uid: this.userInfo.uid,
                name: content.name,
                phone: content.tel,
                isDefault: content.isDefault,
                detailaddr: content.addressDetail
            }).then(res => {
                if(res.data.status === 0){
                    Toast({message: '保存成功'})
                }
            })
            //修改
            else if(this.$route.query.type === 'update')
            axios.post(`/private/updateAddr`,{
                aid: this.$route.query.aid,
                uid: this.userInfo.uid,
                name: content.name,
                phone: content.tel,
                isDefault: content.isDefault,
                detailaddr: content.addressDetail
            }).then(res => {
                if(res.data.status === 0){
                    Toast({message: '保存成功'})
                }
            })
        },
        onDelete(){
            axios.post(`/private/deleteAddr`,{
                aid: this.$route.query.aid,
            }).then(res => {
                if(res.data.status === 0){
                    Toast({message: '保存成功'})
                }
            })
        },
        onChangeDetail(){

        }
    },
    computed:{
        ...mapState(['userInfo'])
    },
    deactivated() {
      this.$destroy()  
    },

}
</script>

<style scoped>
.slide-left-enter-active {
  transition: all .3s ease;
}

.slide-left-enter
{
  transform: translateX(-20rem);
}
</style>