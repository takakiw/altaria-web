<template>
    <div class="note-editor">
        <div class="create-container">
            <div class="container-top">
                <div class="container-left">
                    <div class="title" @dblclick="showTitleInput = true" >
                        <el-tooltip
                          effect="dark"
                          content="双击编辑标题"
                          placement="top"
                          :disabled="showTitleInput"
                        >
                            <div v-if="showTitleInput">
                              <el-input v-model="title"
                              ref="titleInput"
                              @blur="checkTitle"
                              class="title-input"
                              :autofocus="true"
                              placeholder="addNoteTitle"></el-input>
                            </div>
                            <span v-else>{{ title }}</span>
                        </el-tooltip>
                    </div>
                    <div class="select-category">
                      <el-select
                        v-model="currentCategory"
                        clearable
                        size="small"
                        placeholder="默认分组"
                        style="width: 160px;margin-top: 5px;"
                      >
                        <el-option
                          v-for="item in categoryList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </div>
                    <div class="private-container">
                      <el-switch
                        v-model="isPrivate"
                        inline-prompt
                        style="--el-switch-on-color: #ff4949; --el-switch-off-color: #13ce66"
                        active-text="私密"
                        inactive-text="公开"
                      />
                    </div>
                </div>
                <div class="container-right">
                    <el-button type="primary" plain round @click="saveNote">保存</el-button>
                    <el-button type="primary" plain round @click="exitNote">退出</el-button>
                </div>
            </div>
            <MdEditor v-model="text"
              :toolbarsExclude="toolbarsExclude"
              class="container-bottom"
              codeTheme="github"
              previewTheme="github"
              :showCodeRowNumber="true" 
              @onUploadImg="onUploadImg" />
        </div>
      </div>
</template>

<script setup>
import Container from "@/components/common/Container.vue"
import { onMounted, reactive, ref, watch } from 'vue';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css'
import { ElMessage, ElMessageBox } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { getNoteCategories, getNoteInfo, postCreateNote, PutUpdateNote } from "../../service/note";

const router = useRouter();
const route = useRoute();
const toolbarsExclude = ["github", "save","htmlPreview", ];
const title = ref('DefaultTitle');
const text = ref('');
const showTitleInput = ref(false);
const titleInput = ref(null);
const currentCategory = ref(history.state.id || '');
const isPrivate = ref(true); 
const noteId = route.params.noteId; // 笔记id

const note = reactive({
  id: noteId || '',
  title: '',
  text: '',
  isPrivate: false,
  categoryId: '',
});



const updateTileAndTextFlag = ref(false); // 标记是否更新标题和内容

watch(title, (newVal, oldVal) => {
  if(noteId){
    if(newVal !== note.title){
      updateTileAndTextFlag.value = true;
    }
  }else{
    if(newVal!== oldVal){
    updateTileAndTextFlag.value = true;
    }
  }
})

watch(text, (newVal, oldVal) => {
  if(noteId){
    if(newVal !== note.text){
      updateTileAndTextFlag.value = true;
    }
  }else{
    if(newVal !== oldVal){
      updateTileAndTextFlag.value = true;
    }
  }
})

watch(currentCategory, (newVal, oldVal) => {
  if(noteId){
    if(newVal !== note.categoryId){
      updateTileAndTextFlag.value = true;
    }
  }else{
    if(newVal !== oldVal){
      updateTileAndTextFlag.value = true;
    }
  }
})

watch(isPrivate, (newVal, oldVal) => {
  if(noteId){
    if(newVal !== note.isPrivate){
      updateTileAndTextFlag.value = true;
    }
  }else{
    if(newVal !== oldVal){
      updateTileAndTextFlag.value = true;
    }
  }
})

const categoryList = ref([
  {
    value: '',
    label: '默认分组',
  }
])

onMounted(() => {
  if(localStorage.getItem('token')){
    getNoteCategories().then(res => {
      if(res.code === 200){
        res.data.records.forEach(item => {
          categoryList.value.push({
            value: item.id,
            label: item.name,
          })
        })
      }else{
        ElMessage.error(res.msg);
      }
    }).catch(err => {
      ElMessage.error("检查网络连接");
    })
  }
  if(noteId){
    getNoteInfo(noteId).then(res => {
      if(res.code === 200){
        note.title = res.data.title;
        note.text = res.data.text;
        note.isPrivate = res.data.isPrivate;
        note.categoryId = res.data.cid;
        title.value = res.data.title;
        text.value = res.data.text;
        isPrivate.value = res.data.isPrivate;
        currentCategory.value = res.data.cid;
        console.log(note);
      }else{
        ElMessage.error(res.msg);
      }
    }).catch(err => {
      ElMessage.error("检查网络连接");
    })
  }
})

watch(showTitleInput, (newVal) => {
  if(newVal){
    setTimeout(() => {
      titleInput.value.focus();
    }, 10);
  }
})

const checkTitle = () => {
  if (title.value.trim() === '') {
    title.value = 'DefaultTitle';
  }
  showTitleInput.value = false;
}

const onUploadImg = (file) => {
  console.log(file);
}

const saveNote = () => {
  if(!title.value || !text.value){
    ElMessage.warning("标题和内容不能为空");
    return;
  }
  if(!updateTileAndTextFlag.value){
    if(noteId){
      ElMessage.success("保存成功")
    }else{
      ElMessage.warning("笔记内容不能为空");
    }
    return;
  }
  if(updateTileAndTextFlag.value){
    if(noteId){
      PutUpdateNote(noteId, title.value, text.value, isPrivate.value, currentCategory.value).then(res => {
        if(res.code === 200){
          ElMessage.success('保存成功');
          updateTileAndTextFlag.value = false;
        }else{
          ElMessage.error(res.msg);
        }
      }).catch(err => {
        ElMessage.error("检查网络连接");
        })
    }else{
      postCreateNote(title.value, text.value, isPrivate.value, currentCategory.value).then(res => {
        if(res.code === 200){
          ElMessage.success('新建笔记成功');
          router.replace({
            path: '/notes'
          })
          updateTileAndTextFlag.value = false;
        }else{
          ElMessage.error(res.msg);
        }
      }).catch(err => {
        ElMessage.error("检查网络连接");
      })
    }
  }
}

const exitNote = () => {
  if(updateTileAndTextFlag.value){
    ElMessageBox.confirm("当前有未保存的修改，是否退出？", "提示", {
      confirmButtonText: "保存并退出",
      cancelButtonText: "放弃修改",
      type: "warning",
    }).then(() => {
      saveNote();
      router.replace({
        path: '/notes'
      })
    }).catch(() => {
      router.replace({
        path: '/notes'
      })
    });
  }
  else{
    router.replace({
      path: '/notes'
    })
  }
}

</script>

<style scoped lang="scss">

.note-editor{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
}

.create-container{
  width: 85%;
  height: 95%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  box-shadow: var(--el-box-shadow);
}

.container-top {
  height: 5%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0 20px;
  box-sizing: border-box;
  box-shadow: var(--el-box-shadow);
  min-height: 40px;
}

.private-container{
  display: flex;
  align-items: center;
}

.container-left{
  display: flex;
  justify-content: space-between;
  align-content: center;
  gap: 50px;
}

.title{
  font-size: 24px;
  font-weight: bold;
  color: #333;
  user-select: none;
  &:hover{
    cursor: pointer;
  }
}

.title-input{
  font-size: 24px;
  width: 200px;
  color: black;
  background-color: rgb(158, 158, 158);
}

.container-right{
  display: flex;
  justify-content: space-between;
  align-content: center;
  gap: 10px;
}

.container-bottom {
  flex: 1;
  width: 100%;
}
</style>

<style lang="scss">
.title-input {
  color: black;
  .el-input__wrapper{
    color: black;
    .el-input__inner{
      font-size: 20px;
      color: black;
    }
  }
}
</style>