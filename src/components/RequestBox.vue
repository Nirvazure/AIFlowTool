<template>
<v-container>
    <v-select v-model="dagName" rounded dense prefix="DAG_NAME" solo label="Choose DAG" :items="dags|getDagName" @change="selectChange"></v-select>
    <v-data-table hide-default-footer dense :headers="headers" :items='testcases' @click:row="showE">
        <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>Request</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{on}">
                        <v-btn class="mx-2" small dark color="primary" v-on="on">
                            <v-icon dark>mdi-plus</v-icon>
                        </v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="headline">{{ formTitle }}</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" sm="6" md="6">
                                        <!-- <v-text-field v-model="editedItem.key" label="Key"></v-text-field> -->
                                        <v-select v-model="editedItem.key" :items="keys" label="Key"></v-select>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-select v-model="editedItem.type" :items="types" label="Type"></v-select>
                                    </v-col>
                                </v-row>
                                <PhotoCard v-on:childContent="showMsgFromChild" v-if="editedItem.type=='image'"></PhotoCard>
                                <AudioCard v-on:childContent="showMsgFromChild" v-else-if="editedItem.type=='audio'"></AudioCard>
                                <v-textarea v-model=editedItem.content v-else-if="editedItem.type=='text'" outlined></v-textarea>
                                <CamCard v-on:childContent="showMsgFromChild" v-else-if="editedItem.type=='camera'"></CamCard>
                                <VideoCard v-on:childContent="showMsgFromChild" v-else-if="editedItem.type=='video'"></VideoCard>
                                <FileCard :childContent='showMsgFromChild' v-else-if="editedItem.type=='file'"></FileCard>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn @click="close">Cancel</v-btn>
                            <v-btn color="green darken-1" dark @click="save">Save</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-spacer></v-spacer>
                <v-btn small color="green" :loading="loading" dark @click="startTest">SEND</v-btn>
            </v-toolbar>
        </template>
        <template v-slot:item.action="{ item }">
            <v-chip dark small color="cyan">
                <v-icon @click="editItem(item)">edit</v-icon>
            </v-chip>
            <v-chip dark small color="red">
                <v-icon @click="deleteItem(item)">delete</v-icon>
            </v-chip>
        </template>
        <template v-slot:item.type="{ item }">
            <v-chip label :color="item.type|getColor" dark>{{ item.type }}</v-chip>
        </template>
    </v-data-table>
</v-container>
</template>

<script>
import axios from "axios";
import CamCard from '@/components/CamCard'
import AudioCard from '@/components/AudioCard'
import PhotoCard from '@/components/PhotoCard'
import VideoCard from '@/components/VideoCard'
import FileCard from '@/components/FileCard'
export default {
    components: {
        AudioCard,
        PhotoCard,
        CamCard,
        VideoCard,
        FileCard
    },
    data: () => ({
        myFile: [],
        loading: false,
        dagName: "",
        dags: [],
        dialog: false,
        editedIndex: -1,
        editedItem: {
            key: '',
            type: '',
            content: '',
        },
        defaultItem: {
            key: '',
            type: '',
            content: '',
        },
        keys: [],
        types: ['audio', 'image', 'text', 'camera', 'video', 'file'],
        headers: [{
                text: 'key',
                align: 'left',
                sortable: false,
                value: 'key'
            },
            {
                text: 'type',
                value: 'type'
            },
            {
                text: 'Actions',
                value: 'action',
                sortable: false
            }
        ],
        testcases: [],
        reqData: {}
    }),

    created() {
        //这里是生产环境的请求
        // axios.get('/dagsChannelName').then((res) => {
            //这里是开发环境的请求
            axios.get('service/dagsChannelName').then((res) => {
            console.log('正在从服务端获取dag列表数据')
            for (let itemKey in res.data) {
                let dag = {}
                dag['name'] = itemKey
                dag['inputs'] = res.data[itemKey]
                this.dags.push(dag)
            }
            console.log('dag列表数据已经传输进本地变量')
        }).catch((err) => {
            console.log(err)
        })
    },

    watch: {
        dialog(val) {
            val || this.close() //不知道是干嘛的
        },
    },
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'New Item' : 'EditItem'
        }
    },
    methods: {
        startTest() {
            this.loading = true
            let mediaData = {}
            this.testcases.forEach(elem => {
                if (elem['type'] == "audio") {
                    mediaData[elem['key']] = {
                        'pcm': {
                            'data': elem.content.split(',')[1]
                        }
                    }
                } else if (elem['type'] == 'text') {
                    mediaData[elem['key']] = {
                        'text': {
                            'data': elem['content']
                        }
                    }
                } else if (elem['type'] == 'image') {
                    mediaData[elem['key']] = {
                        'image': {
                            'image': elem['content'].split(',')[1]
                        }
                    }
                } else if (elem['type'] == 'video') {
                    mediaData[elem['key']] = {
                        'video': {
                            'video': elem['content'].split(',')[1]
                        }
                    }
                }
            });
            this.reqData['dagName'] = this.dagName
            this.reqData['data'] = mediaData
            //这里是生产环境的请求
            //axios.post('http://' + window.location.hostname + ':8600/v1/aiflow/dagservice/call', this.reqData).then((res) => {
            //这里是开发环境的请求
            axios.post('gateway/v1/aiflow/dagservice/call', this.reqData).then((res) => {
                this.$root.eventHub.$emit('responseData', res)
            }).catch((err) => {
                this.$root.eventHub.$emit('resErrData', err)
                console.log(err)
            }).then(() => {
                this.loading = false
            })
        },
        showE(item) {
            console.log('这是request发的')
            console.log(item)
            this.$root.eventHub.$emit('testcase', {
                'src': 'Request',
                'type': item.type,
                'content': item.content
            });
        },
        selectChange(target) {
            console.log("你当前选择的是" + target)
            let dagTypes = []
            for (let k in this.dags) {
                let dag = this.dags[k]
                if (dag.name == target) {
                    this.keys = dag.inputs
                }
            }
        },
        editItem(item) {
            this.editedIndex = this.testcases.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },
        deleteItem(item) {
            const index = this.testcases.indexOf(item)
            confirm('Are you sure you want to delete this item') && this.testcases.splice(index, 1)
        },
        close() {
            this.dialog = false
            setTimeout(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            }, 300) //这里改成30000感觉没什么变化啊
        },
        save() {
            if (this.editedIndex > -1) {
                Object.assign(this.testcases[this.editedIndex], this.editedItem)
            } else {
                this.testcases.push(this.editedItem)
            }
            this.close()
        },

        showMsgFromChild(data) {
            this.editedItem.content = data
        },

    },
}
</script>
