<template>
    <div class="container">
        <div class="app">
        <el-scrollbar class="news-feed" v-if="noteList.length">
            <div
            class="news-card"
            v-for="(item, index) in noteList"
            :key="index"
            >
                <NoteCard :note="item" :userMap="userMap"  />
            </div>
            <div class="load-more">
                <span v-if="hasMore" @click="loadMore" style="cursor: pointer;">加载更多</span>
                <p v-else>没有更多的新鲜事</p>
            </div>
        </el-scrollbar>
        <div v-else class="empty">
            <el-empty description="暂无公开笔记">
              所有公开的笔记将显示在这里~
            </el-empty>
        </div>
        </div>
    </div>
  </template>
  
  <script setup>
  import { ElMessage } from 'element-plus';
  import NoteCard from "@/components/pages/note/NoteCard.vue"
  import { ref, onMounted, reactive } from 'vue';
  import { getPublicNoteList } from '../../service/note';
import { getUserInfo } from '../../service/user';
  const noteList = ref([]); // 显示的公开笔记
  const hasMore = ref(true); // 是否还有更多
  const page = ref(1); // 当前页数
  const size = 5; // 每页显示的数量
  const userMap = reactive({}) // 用户信息
  
  // 加载更多新闻
  const loadMore = () => {
    getPublicNoteList(page.value, size).then((res) => {
        if(res.code !== 200){
            ElMessage.error(res.msg);
            return;
        }
        noteList.value.push(...res.data);
        if (res.data.length < size) {
            hasMore.value = false;
        }
        page.value++;
        res.data.forEach(item => {
            if(userMap[item.uid]){
                return;
            }
            getUserInfo(item.uid).then(res => {
                if(res.code !== 200){
                    ElMessage.error("渲染失败");
                    return;
                }
                userMap[item.uid] = res.data;
            })
        })
        console.log(userMap);
    }).catch((err) => {
        ElMessage.error(err.message);
    })
  };
  

  // 初始化加载内容
  onMounted(() => {
    loadMore();
  });
  </script>
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    height: calc(100% - 70px);
    min-width: 1200px;
    width: 100%;
    justify-content: center;
    align-items: center;
  }

  /* 全局样式 */
  .app {
    display: flex;
    position: relative;
    height: 100%;
    overflow: hidden;
    width: 100%;
    align-items: center;
    width: 60%;
    padding: 0 80px;
    box-shadow: var(--el-box-shadow-lighter);
  }

  .empty {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    font-family: Inter, 'Helvetica Neue', Helvetica, 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
    color: #6b7785;
  }
  
  /* 新闻区域 */
  .news-feed {
    flex: 1;
    padding: 10px;
    box-sizing: border-box;
    width: 100%;
  }
  
  .news-card {
    display: flex;
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 10px;
    margin-bottom: 10px;
    position: relative;
    min-height: 320px;
    box-shadow: var(--el-box-shadow-lighter);
    box-sizing: border-box;
    width: 100%;
  }
  
  /* 加载更多 */
  .load-more {
    text-align: center;
    margin: 20px 0;
    width: 100%;
  }
  
  .load-more button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .load-more button:hover {
    background-color: #0056b3;
  }
  </style>
  