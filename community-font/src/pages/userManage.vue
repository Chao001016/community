<template>
    <div>
        <head-top :goBack="true" :userinfo="true" :title="'用户管理'"></head-top>
        <div style="margin-top: 2rem;height:24rem">
            <el-table
                :data="user"
                style="width: 100%;">
                <el-table-column
                    prop="uid"
                    label="用户ID"
                    width="80">
                </el-table-column>
                <el-table-column
                    prop="nickname"
                    label="用户名"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="user_type"
                    label="用户类别"
                    width="90">
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="100">
                    <template v-slot="scope">
                        <el-button size="mini" @click="showPermission(scope.$index, scope.row)">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
            :page-size="size"
            layout="prev, pager, next"
            @current-change="getAllUserByPage"
            :total="totalPage*size">
            </el-pagination>
        </div>
        <van-dialog v-model="permissionShow" 
            className="dialog"    
            :closeOnClickOverlay="true"
            :showConfirmButton="false"
            :showCancelButton="false">
           <el-table
            :data="perData"
            :stripe="true"
           >
            <el-table-column
                prop="name"
                label="权限名称"
                width="100">
            </el-table-column>
            <el-table-column
                prop="number"
                label="权限编号"
                width="100">
            </el-table-column>
            <el-table-column
                label="操作"
            >
                <template v-slot="scope">
                    <el-button @click="deletePermission(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
           </el-table>
        </van-dialog>
    </div>
</template>

<script>
import axios from 'axios'
import headTop from '../components/head.vue'
export default {
  name: 'userManage',
  components: {
    headTop
  },
  data () {
    return {
        curUid: null,
        user: [],
        permissionShow: false,
        perData: [],
        size: 10,
        totalPage: null
    }
  },
  methods:{
      getAllUserByPage (page=1) {
          axios.get(`/private/account/getAllUser?size=${this.size}&page=${page}`).then(res => {
            if(res.data.status === 0){
                let _data = res.data.data
                _data.data.forEach(item => {
                    if(item.user_type === 0){
                        item.user_type = '居民'
                    }
                    else if(item.user_type === 1) {
                        item.user_type = '商家'
                    }
                    else if(item.user_type === 2) {
                        item.user_type = '管理员'
                    }
                    else if(item.user_type === 3) {
                        item.user_type = '超级管理员'
                    }
                }) 
                this.user = _data.data
                this.totalPage = _data.totalPage
            }
        })
      },
      showPermission (index, row) {
          this.permissionShow = true
          this.curUid = row.uid
          this.getPermission(row.uid)
      },
      getPermission (uid) {
          axios.get(`/private/account/getPermission?uid=${uid}`).then(res => {
              if (res.data.status === 0) {
                //   console.log(res.data.data.permission);
                  let _per = JSON.parse(res.data.data.permission)
                  for(let item in _per){
                      this.perData.push({name: _per[item], number: item})
                  }
              }
          })
      },
      deletePermission (index, row) {
          let _permission = {}
          this.perData.splice(index, 1)
          this.perData.forEach(item => {
              _permission[item.number] = item.name
          })
          axios.post(`/private/account/updatePermission`,{
              uid: this.curUid,
              permission: JSON.stringify(_permission)
          })
      }
  },
  created() {
      this.getAllUserByPage()
  },
}
</script>

<style scoped>
.dialog{
    height: 20rem;
    overflow: scroll;
    /* height: 10rem; */
}
</style>
