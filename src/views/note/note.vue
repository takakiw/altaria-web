<template>
  <Container style="min-width: 1242px;">
    <div class="left-container">
      <div class="left-top">
        <el-input 
          v-model="searchQuery" 
          placeholder="搜索分组" 
          clearable
          class="search-input"
        />
        <el-button 
          type="primary" 
          @click="addCategory"
          circle
          class="add-button"
        ><el-icon><Plus /></el-icon></el-button>
      </div>
      <div class="left-bottom">
        <el-menu :default-active="activeIndex" @select="handleSelect" class="menu-vertical">
          <el-menu-item 
            v-for="(category, index) in filteredCategories" 
            :key="index" 
            :index="String(index)"
            class="category-item"
            @select="handleSelect"
          >
            <span>{{ category.name }}</span>
            <div class="category-operation">
              <el-icon ><MoreFilled /></el-icon>
              <div class="category-operation-list">
                <div class="category-operation-item" @click="addNote(category)">创建笔记</div>
                <div v-if="category.id" class="category-operation-item" @click="renameCategory(category)">重命名</div>
                <div v-if="category.id" class="category-operation-item" @click="deleteCategory(category)">删除</div>
              </div>
            </div>
          </el-menu-item>
        </el-menu>
      </div>
    </div>
    <div class="right-container">
      <el-scrollbar style="width: 100%;box-sizing: border-box;">
        <el-row v-if="noteList.length">
          <el-col :span="7" v-for="(note, index) in noteList" :key="index" style="margin: 10px 20px;">
            <el-card :body-style="{ padding: '20px'}" class="note-item">
              <div class="note-item-is-private" :style="{color: note.isPrivate ? '#f56c6c' : '#67c23a'}">{{ note.isPrivate ? 'private' : 'public' }}</div>
              <div @click="toPreviewNote(note)">
                <h3>{{ note.title }}</h3>
                <br>
              </div>
              <div class="note-item-bottom">
                <div>更新于: {{ note.updateTime }}</div>
                <div>评论数: {{ note.commentCount }}</div>
              </div>
              <div class="note-options">
              <el-icon class="options-icon"><MoreFilled class="options-icon" /></el-icon>
              <div class="note-operation-list">
                <div class="note-operation-item" @click="toggleVisibility(note)">设为{{ note.isPrivate ? '公开' : '私密'}}</div>
                <div class="note-operation-item" @click="this.$router.push('/note/' + note.id)">预览</div>
                <div class="note-operation-item" @click="deleteNote(note)">删除</div>
              </div>
            </div>
            </el-card>
          </el-col>
        </el-row>
        <div v-else class="empty-state">
          <div>暂无笔记</div>
        </div>
      </el-scrollbar>
    </div>
  </Container>
</template>

<script setup>
import Container from '@/components/common/Container.vue'
import { reactive, ref, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Plus, MoreFilled } from '@element-plus/icons-vue';
import { deleteNoteCategory, delNote, getNoteCategories, getNoteList, PostAddNoteCategory, PutUpdateNote, updateNoteCategory } from '../../service/note';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../store';

const activeIndex = ref('0')
const categoryList = reactive([{name: '默认分组'}])
const noteList = reactive([])
const searchQuery = ref('')
const router = useRouter() 
const userStore = useUserStore()

if (localStorage.getItem('token')) {
  getNoteCategories().then(res => {
    if(res.code === 200 && res.data.records.length){
      categoryList.push(...res.data.records)
    }
  })
  getNoteList().then(res => {
    console.log(res);
    if(res.code === 200 && res.data.records.length){
      noteList.push(...res.data.records)
    }
  })
}

const handleSelect = (index) => {
  if(!userStore.isLogin) return 
  activeIndex.value = index
  noteList.splice(0, noteList.length)
  console.log(categoryList[index]);
  getNoteList(categoryList[index].id).then(res => {
    if(res.code === 200 && res.data.records.length){
      noteList.push(...res.data.records)
    }
  })
}

// 搜索结果
const filteredCategories = computed(() => {
  if (!searchQuery.value) return categoryList
  return categoryList.filter(category => 
    category.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// 添加新分组
const addCategory = () => {
  ElMessageBox.prompt('请输入分组名称', '新增分组', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(({ value }) => {
    if (value) {
      PostAddNoteCategory(value).then(res => {
        if (res.code === 200) {
          ElMessage.success('分组已添加')
          categoryList.push(res.data)
        }else{
          ElMessage.error(res.msg)
        }
      }).catch(() => {
        ElMessage.error('分组添加失败')
      })
    }
  }).catch(() => {
    ElMessage.info('已取消')
  })
}

const addNote = (category) => {
  // 使用state传参
  router.push({path: "/note/edit", state: {"id" : category.id}})
}

const renameCategory = (category) => {
  if(!category.id) return
  ElMessageBox.prompt('请输入新的分组名称', '重命名分组', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(({ value }) => {
    if (value) {
      updateNoteCategory(category.id, value).then(res => {
        if (res.code === 200) {
          ElMessage.success('分组名称已修改')
          category.name = value
        }else{
          ElMessage.error(res.msg)
        }
      }).catch(() => {
        ElMessage.error('分组名称修改失败')
      })
    }
  }).catch(() => {
    ElMessage.info('已取消')
  })
}

const deleteCategory = (category) => {
  if(!category.id) return
  ElMessageBox.confirm('确认删除此分组？', '删除分组', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteNoteCategory(category.id).then(res => {
      if (res.code === 200) {
        ElMessage.success('分组已删除')
        const index = categoryList.indexOf(category)
        categoryList.splice(index, 1)
        handleSelect(0)
      }else{
        ElMessage.error(res.msg)
      }
    }).catch(() => {
      ElMessage.error('分组删除失败')
    })
  }).catch(() => {
    ElMessage.info('已取消')
  })
}

const deleteNote = (note) => {
  ElMessageBox.confirm(
    '确认删除此笔记？',
    '删除笔记',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    delNote(note.id).then(res => {
      if (res.code === 200) {
        ElMessage.success('笔记已删除')
        const index = noteList.indexOf(note)
        noteList.splice(index, 1)
      }else{
        ElMessage.error(res.msg)
      }
    }).catch(() => {
      ElMessage.error('笔记删除失败')
    })
  }).catch(() => {
    ElMessage.info('已取消')
  })
}

const toggleVisibility = (note) => {
  PutUpdateNote(note.id, null, null, note.isPrivate ? 0 : 1, null).then(res => {
    if (res.code === 200) {
      note.isPrivate = !note.isPrivate
      ElMessage.success(note.isPrivate ? '笔记设为私密' : '笔记设为公开')
    }else{
      ElMessage.error(res.msg)
    }
  }).catch(() => {
    ElMessage.error('笔记可见性切换失败')
  })
}


const toPreviewNote = (note) => {
  router.push({
    path: "/note/edit/" + note.id
  })
}

</script>

<style scoped lang="scss">


.el-row{
  width: 100%;
}
.el-menu-item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.note-item-is-private{
  position: absolute;
  top: 13px;
  right: 40px;
  padding: 0 5px;
  font-size: 12px;
  color: #999;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.category-operation{
  position: relative;
  &:hover {
    .category-operation-list{
       display: flex;
    }
  }
}



.category-operation-list{
  position: absolute;
  width: 60px;
  left: -15px;
  top: 45px;
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  z-index: 10;
  color: black;
  padding: 5px 0;
  .category-operation-item{
    width: 100%;
    height: 30px;
    line-height: 30px;
    text-align: center;
    &:hover{
      cursor: pointer;
      background-color: #f5f5f5;
    }
  }
}

.note-item {
  position: relative;
  &:hover {
    cursor: pointer;
  }
}
.note-options {
  position: absolute;
  top: 10px;
  right: 10px;
  &:hover {
    .note-operation-list{
       display: flex;
    }
  }
}

.note-operation-list{
  position: absolute;
  width: 80px;
  left: -60px;
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  z-index: 10;
  color: black;
  padding: 5px 0;
  .note-operation-item{
    width: 100%;
    height: 30px;
    line-height: 30px;
    text-align: center;
    &:hover{
      cursor: pointer;
      background-color: #f5f5f5;
    }
  }
}

.note-item-bottom{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  font-size: 12px;
  font-family: Inter, 'Helvetica Neue', Helvetica, 'PingFang SC',
  'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  color: #23262a;
}

.options-icon {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.left-container {
  width: 20%;
  float: left;
  background-color: #f0f2f5;
  padding: 10px;
}
.left-top {
  display: flex;
  align-items: center;
  padding-bottom: 10px;
}
.search-input {
  flex: 1;
}
.add-button {
  margin-left: 5px;
}

.left-bottom{
  // 隐藏滚动条，但是可以滚动
  overflow-y: scroll;
  scrollbar-width: none; 
  -ms-overflow-style: none;
  margin-top: 10px;
  height: calc(100% - 60px);
}

.right-container {
  width: 80%;
  float: right;
  padding: 10px;
  overflow: hidden;
  box-sizing: border-box;
}
.empty-state {
  text-align: center;
  color: #ccc;
  font-size: 1.2em;
  padding: 50px;
}
</style>
