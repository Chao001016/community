<template>
  <div>
      <head-top :goBack="true" :userinfo="true"></head-top>
      <van-form style="margin-top: 2rem" class="form" ref="applyIn">
        <van-cell-group inset>
            <van-field
            name="serveType"
            v-model="applyInfo.applyIdentity"
            label="入驻人身份"
            :disabled="$route.params.type==0"
            v-if="$route.params.type==0"
            class="form_item"
            label-class="label_class"
            />
            <van-field
            name="serveType"
            v-model="applyInfo.payIdentity"
            label="支付宝账号"
            :disabled="$route.params.type==0"
            placeholder="输入支付宝账号"
            class="form_item"
            @click="$route.params.type!=0&&(showTypePicker = true)"
            label-class="label_class"
            :rules="[{ required: true, message: '输入支付宝账号' }]"
            />
            <van-field
            name="serveType"
            v-model="applyInfo.serveTypeName"
            :is-link="$route.params.type!=0"
            readonly
            label="服务类型"
            :disabled="$route.params.type==0"
            placeholder="点击选择服务类型"
            class="form_item"
            @click="$route.params.type!=0&&(showTypePicker = true)"
            label-class="label_class"
            :rules="[{ required: true, message: '请选择服务类型' }]"
            />
            <van-field
            v-model="applyInfo.shopName"
            name="shopName"
            label="服务名"
            placeholder="服务名"
            autocomplete="off"
            :disabled="$route.params.type==0"
            class="form_item"
            :rules="[{ required: true, message: '请填写服务名' }]"
            />
            <van-field
            v-model="applyInfo.phone"
            name="phone"
            label="联系电话"
            placeholder="联系电话"
            :disabled="$route.params.type==0"
            class="form_item"
            autocomplete="off"
            :rules="[{ required: true, message: '请填写联系电话' }]"
            />
            <van-field
            v-model="applyInfo.shopAddr"
            name="shopAddr"
            label="商家地址"
            placeholder="商家地址"
            :disabled="$route.params.type==0"
            autocomplete="off"
            class="form_item"
            :rules="[{ required: true, message: '请选择服务商家地址' }]"
            />
            <van-field name="license" label="营业证书" class="form_item" :disabled="$route.params.type==0" :rules="[{ required: userInfo.user_type==1, message: '请上传营业证书' }]">
                <template #input>
                    <van-uploader v-model="applyInfo.license" :max-count="4" :deletable="$route.params.type!=0" :show-upload="$route.params.type!=0"/>
                </template>
            </van-field>
        </van-cell-group>
        <div style="margin: 16px;">
            <el-button round type="primary" @click="applyIn()" v-show="$route.params.type==1">
            申请入驻
            </el-button>
            <el-button round type="primary" @click="pass()" v-show="$route.params.type==0 && (userInfo.user_type==2||userInfo.user_type==3)">
            通过
            </el-button>
            <el-button round type="primary" @click="deny()" v-show="$route.params.type==0 && (userInfo.user_type==2||userInfo.user_type==3)">
            否决
            </el-button>
        </div>
      </van-form>
      <van-popup v-model="showTypePicker" position="bottom" ref="typePopup">
        <van-picker
            :columns="TypeColumn"
            @confirm="onTypeConfirm"
            :show-toolbar="true"
            @cancel="showPicker = false"
        />
        </van-popup>
  </div>
</template>

<script>
import axios from 'axios'
import headTop from '../components/head.vue'
import { mapState } from 'vuex'
import { Dialog, Toast } from 'vant';
import { Form, Field, CellGroup, Button, Uploader, RadioGroup, Radio  } from 'vant'
import config from '@/../myConfig'
export default {
    components:{
        [Dialog.Component.name]: Dialog.Component,
        [Form.name]: Form,
        [Field.name]: Field,
        [CellGroup.name]: CellGroup,
        [Button.name]: Button,
        [Uploader.name]: Uploader,
        [RadioGroup.name]: RadioGroup,
        [Radio.name]: Radio,
        headTop
    },
    data(){
        return {
            TypeColumn: [{text:'售卖(衣服、食品)',value: 1},{text:'修理',value: 2},{text:'清洁', value:3},
                        {text:'二手交易',value: 4},{text:'车位出租',value:5},{text:'装修', value:6},{text:'房屋出租',value:7},
                        {text:'搬家',value:8},{text: '艺术培训', value: 9}],
            showTypePicker: false,
            applyInfo:{
                payIdentity: '',
                shopName: '',
                serveTypeValue: '',
                shopAddr: '',
                license: [],
                phone: '',
                id:'',
                serveTypeName: ''
            }
        }
    },
    methods:{
        applyIn(){
            this.$refs['applyIn'].validate().then(res => {
                const formData = new FormData();
                if(this.applyInfo.license.length>4){
                    alert('最多只能上传四张图片')
                    return
                }
                for(let item of this.applyInfo.license){
                    formData.append('file',item.file)
                }
                formData.append('serve_id',this.$route.params.id)
                
                axios.post(`/private/uploadCertificate`,
                            formData
                ).then(res => {
                    if(res.data.status === 0){
                        axios.post(`/private/applyIn`,{
                            shop_name: this.applyInfo.shopName,
                            serve_type: this.applyInfo.serveTypeValue,
                            shop_addr: this.applyInfo.shopAddr,
                            phone: this.applyInfo.phone,
                            status: 0,
                            serve_id: this.$route.params.id
                        }).then(res => {
                            if(res.data.status === 0) {
                                Dialog({message: '申请成功'})
                            }
                        })
                    }
                })
                axios.post(`/private/updateUserInfo`,{
                    app_identity: this.applyInfo.payIdentity
                })
            },res => {
                return;   
            }).catch(err=>err)
        },
        pass(){
            axios.post('/private/updateServStatus',{
                status: 2,
                serve_id: this.$route.params.id
            }).then(res => {
                if(res.data.status === 0) {
                    Toast('审核成功')
                    this.$router.go(-1)
                }
            })
    
        },
        deny(){
            axios.post('/private/updateServStatus',{
                serve_id: this.$route.params.id,
                status: 3
            }).then(res => {
                if(res.data.status === 0) {
                    Toast('已否决')
                    this.$router.go(-1)
                }
            })
        },
        getServiceById(id){
            axios.get(`/private/getServiceById?id=${id}`).then(res => {
                if(res.data.status === 0){
                    let data = res.data.data
                    if(data.user_type==0) this.applyInfo.applyIdentity='居民'
                    else if(data.user_type==1) this.applyInfo.applyIdentity='商家'
                    else if(data.user_type==2) this.applyInfo.applyIdentity='管理员'
                    else if(data.user_type==3) this.applyInfo.applyIdentity='超级管理员'
                    this.applyInfo.serveType = data.serve_type;
                     switch (String(data.serve_type)) {
                            case '1':
                                this.applyInfo.serveTypeName =  '售卖(衣服、食品)'
                                break;
                            case '2':
                                this.applyInfo.serveTypeName  =  '修理'
                                break;
                            case '3':
                               this.applyInfo.serveTypeName  =  '清洁'  
                               break;  
                            case '4':
                                this.applyInfo.serveTypeName  =  '二手交易'
                                break;
                            case '5':
                                this.applyInfo.serveTypeName  =  '车位出租' 
                                break;
                            case '6':
                                 this.applyInfo.serveTypeName  =  '装修' 
                                 break;
                            case '7':
                                 this.applyInfo.serveTypeName  =  '房屋出租' 
                                 break;
                            case '8':
                                 this.applyInfo.serveTypeName  =  '搬家' 
                                 break;
                            case '9':
                                 this.applyInfo.serveTypeName  =  '艺术培训'
                                 break; 
                            default:
                        }
                    this.applyInfo.shopName = data.shop_name;
                    this.applyInfo.shopAddr = data.shop_addr;
                    this.applyInfo.phone = data.phone;
                    this.applyInfo.license = data.license.split(',').map(item => {
                        return {url: config.serverIp + item, isImage: true}
                    })
                }
            }).catch(err => {

            })
        },
        onTypeConfirm(item){
            this.applyInfo.serveTypeName = item.text
            this.applyInfo.serveTypeValue = item.value
            this.$refs['typePopup'].close();
        }
    },
    computed:{
        ...mapState(['userInfo'])
    },
    activated(){
        // type为1时,服务未被发布
        if(this.$route.params.type === '0')
        this.getServiceById(this.$route.params.id)
    },
    mounted(){
        this.applyInfo.payIdentity = this.userInfo.pay_identity
    },
    deactivated(){
        this.$destroy()
    }
}
</script>

<style>
.label_class{
    font-weight: 500;
}
.form_item{
    font-size: .65rem;
    font-weight: 500;
    color: black !important;
}
#userPic{
    width: 3rem;
    height: 3rem;
}
.apply_form{
    padding-top: 2.1rem;
}
.input_container{
    display: flex;
    justify-content: space-between;
    padding: .6rem .8rem;
    border-bottom: 1px solid #f1f1f1;
}
.input_container input{
    font-size: .7rem;
    color:#666;
    border: 1px solid rgba(0, 0, 0, .4);
    padding-left: 0.25rem;
}
.input_container input[type=button]{
    width: 100%;
    padding: .28rem .4rem;
    border: 1px;
    margin: .2rem;
    border-radius: 0.15rem;
    color: #f1f1f1;
    font-family: Helvetica Neue,Tahoma,Arial;
    background-color: #4cd964;
}
.input_container input[type=file]{
    width: 8.7rem;
    padding: 0;
    border: 0;
}
.input_container .right_phone_number{
    background-color: #4cd964;
}
.input_container select{
    width: 6rem;
    outline: none;
}
.required{
    color: red;
}
</style>