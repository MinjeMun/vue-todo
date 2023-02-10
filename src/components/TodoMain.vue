<template>
    <div class="page">
    <header><h1>
        Vue Fire todo1
        <span class="pie">
            <svg viewBox="0 0 64 64">
            <circle class="pie" r="32" cx="32" cy="32" style="stroke-width: 64;"></circle>
            <circle class="slice" r="32" cx="32" cy="32" 
            :style="{
                strokeWidth: 64,
                strokeDasharray: totalTodo + ', 201', 
                transition: 'all 0.3s linear'
            }"></circle>
            </svg>
        </span>
    </h1></header>
    <main>
      <div class="todos">
        <transition name="fade">
            <div class="write" v-if="writeState === 'add'" key="add"> <!--등록-->
            <input
                ref="writeArea"
                type="text" 
                v-model="todoItem" 
                @keyup.enter="addItem"/>
            <button class="btn add" @click="addItem">Add</button>
            </div>
            <div class="write edit" v-else key="edit"> <!--수정-->
            <input 
                ref="writeArea"
                type="text" 
                v-model="editItemText" 
                @keyup.enter="editSave"/>
            <button class="btn add" @click="editSave">Save</button>
            </div>
        </transition>
        
        <ul class="list" ref="list">
          <li v-for="(todo, i) in todos" :key="i">
            <i 
                @click="checkItem(i)"
                :class="[todo.state === 'yet' ? 'far' : 'fas', 'fa-check-square']"></i>
            <span>
              {{ todo.text }}
              <b>
                <a href="" @click.prevent="editShow(i)">Edit</a>
                <a href="" @click.prevent="del(i)">Del</a>
              </b>
            </span>
          </li>
        </ul>
    
      </div>
    </main>
    </div>
</template>

<script>
import {db} from '../firebase/db';

export default {
    data() {
        return {
            writeState: 'add',
            crrEditItem: '',
            editItemText: '',
            todoItem: '',
            todos:[]
        }
        
    },
    computed: {
        totalTodo() {
            let totalNum = 0;
            this.todos.forEach(item => {
                if (item.state === 'done') totalNum++;
            });
            return (totalNum / this.todos.length) * 201 // 비례 공식
        }
    },
    methods: {
        addItem () {
            if (this.todoItem === '') return;
            db.collection('todos').add({
                text: this.todoItem, 
                state: 'yet', 
                createdAt: new Date()}).then(sn => {
                db.collection('todos').doc(sn.id).update({
                    id: sn.id
                })
            });
            // this.todos.unshift({text: this.todoItem, state: 'yet'})
            this.todoItem = ''
        },
        checkItem(index) {
            if (this.todos[index].state === 'yet') {
                // this.todos[index].state = 'done'
                db.collection('todos').doc(this.todos[index].id).update({state:'done'})
            } else {
                // this.todos[index].state = 'yet'
                db.collection('todos').doc(this.todos[index].id).update({state:'yet'})
            }
        },
        editSave() {
            // this.todos[this.crrEditItem].text = this.editItemText;
            db.collection('todos')
                .doc(this.todos[this.crrEditItem].id)
                    .update({text: this.editItemText})

            this.writeState = 'add';
            this.$refs.list.children[this.crrEditItem].className = '';
        },
        editShow(index) {
            this.crrEditItem = index;
            this.writeState = 'edit';
            this.editItemText = this.todos[index].text
            this.$refs.list.children[index].className = 'editing';
        },  
        del(index) {  
            // this.todos.splice(index,1)
            db.collection('todos').doc(this.todos[index].id).delete()
        }
    },
    mounted() {
        // this.$refs.writeArea.focus();
        // db.collection('todos').get().then((result) => {
        //     result.forEach((doc)=>{
        //         console.log(doc.data())
        //         this.todos.push(doc.data());
        //     })
        // });
    },
    firestore: {
        todos: db.collection('todos').orderBy('createdAt', 'desc')
    }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Jua&family=Merriweather:ital,wght@1,900&display=swap');

/* reset */
* {margin:0; padding:0}
html {font-size:16px}
body {font-family: 'Jua', sans-serif;}
li {list-style:none;}
a {text-decoration-line: none; color:black}
input, button, a {outline: none;}


</style>