<template>
    <div>
        <head-top :goBack="true" :userinfo="true" :title="'服务管理'"></head-top>
        <van-form @submit="updateServiceInfo" style="margin-top: 2rem" ref="serviceInfo">
            <van-cell-group inset>
                <van-field
                v-model="shopInfo.shopName"
                name="shopName"
                placeholder="服务名"
                label="服务名"
                autocomplete="off"
                class="form_item"
                :rules="[{ required: true, message: '请填写服务名' }]"
                />
                <van-field
                v-model="shopInfo.contact"
                name="contact"
                placeholder="联系人"
                label="联系人"
                class="form_item"
                autocomplete="off" 
                :rules="[{ required: true, message: '请填写联系人' }]"
                />
                <van-field
                v-model="shopInfo.payway"
                name="contact"
                placeholder="计费方式"
                label="计费方式"
                class="form_item"
                autocomplete="off" 
                :rules="[{ required: true, message: '计费方式' }]"
                />
                <van-field
                v-model="shopInfo.phone"
                name="phone"
                label="联系电话"
                placeholder="联系电话"
                class="form_item"
                autocomplete="off" 
                :rules="[{ required: true, message: '请填写联系电话' }]"
                />
                <!-- <van-field
                v-model="shopInfo.content"
                name="content"
                label="服务内容"
                placeholder="服务内容"
                class="form_item"
                rows="3"
                autocomplete="off" 
                type="textarea"
                :rules="[{ required: true, message: '请填写服务内容' }]"
                /> -->
                <van-field name="license" label="服务图片" class="form_item" :rules="[{ required: true, message: '请上传服务图片' }]">
                    <template #input>
                        <van-uploader v-model="shopInfo.shopPic" :max-count="1" preview-size="110"/>
                    </template>
                </van-field>
            </van-cell-group>
            <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic" :inline='true'>
                <div v-for="(domain, index) in dynamicValidateForm.domains" :key="domain.key">
                    <el-form-item
                    :inline="true"
                    :key="domain.key"
                    :label="'服务项目' + (index+1)"
                    :prop="'domains.' + index + '.project'"
                    :rules="{
                    required: true, message: '服务项目不能为空', trigger: 'blur'
                    }"
                    >
                    <el-input v-model="domain.project"></el-input>
                    </el-form-item>
                    <el-form-item
                    :inline="true"
                    :key="domain.key"
                    :label="'价格' + (index+1)"
                    :prop="'domains.' + index + '.price'"
                    :rules="{
                    required: true, message: '价格不能为空', trigger: 'blur'
                    }"
                    >
                    <el-input v-model="domain.price" style="width:6rem"></el-input>
                    <el-button @click.prevent="removeDomain(domain)" style="float:right">删除</el-button>
                    </el-form-item>
                </div>
                <el-form-item>
                    <el-button @click="addDomain" type="primary" style="margin-left:.6rem">新增服务项目</el-button>
                </el-form-item>
            </el-form>    
            <div style="margin: 16px;">
                <van-button type="primary" native-type="submit">
                保存
                </van-button>
            </div>
        </van-form>
    </div>
</template>

<script>
import axios from 'axios'
import headTop from '../components/head.vue'
import { Toast } from 'vant'
import config from '@/../myConfig'
export default {
    components:{
        headTop
    },
    data() {
        return {
            dynamicValidateForm:{
                domains:[{namekey:1,valuekey:1,project:null,price:null}]
            },
            shopInfo: {
                shopName: null,
                phone: null,
                contact: null,
                content: null,
                shopPic: [],
                payway: null
            }
        }
    },
    methods: {
        updateServiceInfo(){
            console.log(this.dynamicValidateForm.domains);
            // this.shopInfo.content = JSON.stringify(this.dynamicValidateForm.domains)
            this.$refs['dynamicValidateForm'].validate().then(res=>{
                this.$refs['serviceInfo'].validate().then(res=>{
                    this.shopInfo.content = JSON.stringify(this.dynamicValidateForm.domains)
                    axios.post(`/private/updateShopInfo`,{
                        serve_id: this.id,
                        shop_name: this.shopInfo.shopName,
                        phone: this.shopInfo.phone,
                        contact: this.shopInfo.contact,
                        content: this.shopInfo.content,
                        payway: this.shopInfo.payway
                    }).then(res => {
                        if( res.data.status === 0) {
                            if(this.shopInfo.shopPic[0] && this.shopInfo.shopPic[0].file){
                                let formdata = new FormData();
                                formdata.append('serve_id', this.id);
                                formdata.append('file', this.shopInfo.shopPic[0].file)
                                axios.post(`/private/updateShopPic`, formdata).then(res => {
                                    if(res.data.status === 0) {
                                        Toast({message: '保存成功'})
                                    }
                                })
                            }
                            else {
                                Toast({message: '保存成功'})
                            }
                        }
                    })
                }, res=>{})
            }, res=> {})
      
       
        },
        getServiceById(){
            axios.get(`/private/getServiceById?id=${this.id}`).then(res => {
                if(res.data.status === 0){
                    console.log(res.data);
                    let data = res.data.data
                    this.shopInfo.shopName = data.shop_name;
                    this.shopInfo.phone = data.phone;
                    this.shopInfo.contact = data.contact;
                    this.shopInfo.content = data.content;
                    this.shopInfo.payway = data.payway
                    if(data.shop_pic){
                        this.shopInfo.shopPic = [{
                            url: config.serverIp + data.shop_pic
                        }]
                    }
                    this.dynamicValidateForm.domains = JSON.parse(data.content)
                }
            }).catch(err => {

            })
        },
        removeDomain(item) {
            var index = this.dynamicValidateForm.domains.indexOf(item)
            if (index !== -1) {
            this.dynamicValidateForm.domains.splice(index, 1)
            }
        },
        addDomain() {
            this.dynamicValidateForm.domains.push({
                valuekey: Date.now()+'V',
                namekey: Date.now()+'N',
                project: null,
                price: null
            });
        }
    },
    activated(){
        this.dynamicValidateForm.domains= []
        this.getServiceById()
    },
    props:['id'],
    // watch:{
    //     id: function(){
    //         this.shopInfo = []
    //         this.getServiceById()
    //     }
    // }
}
</script>

<style>

</style>