// 该文件专门用于创建整个应用的路由器
import VueRouter from 'vue-router'
//引入组件
import LoginPage from '../views/LoginPage'
import Home from '../views/Home'
import Main from '../views/Main'
import TeamPageList from '../views/TeamPageList';
import TeamPage from '../views/TeamPage';
import Forum from '../views/Forum';
import Post from '../views/Post';
import AddTeam from '../views/AddTeam';
import AddPost from '../views/AddPost';
import UserInfo from '../views/UserInfo';
import Register from '../views/Register';
import UpdatePost from '../views/UpdatePost';
import UpdateTeam from '../views/UpdateTeam';
import AuditTeamPage from '../views/AuditTeamPage';
import AuditTeamPageList from '../views/AuditTeamPageList';
import UserInfoUpdate from '../views/UserInfoUpdate';
import UpdatePassword from '../views/UpdatePassword';
import UserManagement from '../views/UserManagement';
import Test from '../views/Test';

//创建并暴露一个路由器
export default new VueRouter({
    routes: [
        {
            path: '/test',
            component: Test
        },
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/login',
            component: LoginPage
        },
        {
            path: '/register',
            component: Register
        },
        {
            path: '/home',
            component: Home,
            redirect: '/home/main',
            children: [
                {
                    path: 'main',
                    component: Main,
                },
                {
                    path: 'teamPageList',
                    component: TeamPageList,
                },
                {
                    path: 'teamPage',
                    component: TeamPage,
                    props($route) {
                        return {
                            id: $route.query.id
                        }
                    }
                },
                {
                    path: 'forum',
                    component: Forum
                },
                {
                    path: 'post',
                    component: Post,
                    props($route) {
                        return {
                            id: $route.query.id
                        }
                    }
                },
                {
                    path: 'addTeam',
                    component: AddTeam
                },
                {
                    path: 'addPost',
                    component: AddPost
                },
                {
                    path: 'updatePost',
                    component: UpdatePost,
                    props($route) {
                        return {
                            id: $route.query.id
                        }
                    }
                },
                {
                    path: 'userInfo',
                    component: UserInfo,
                    props($route) {
                        return {
                            id: $route.query.id
                        }
                    }
                },
                {
                    path: 'updateTeam',
                    component: UpdateTeam,
                    props($route) {
                        return {
                            id: $route.query.id
                        }
                    }
                },
                {
                    path: 'auditTeamPageList',
                    component: AuditTeamPageList,
                },
                {
                    path: 'auditTeamPage',
                    component: AuditTeamPage,
                    props($route) {
                        return {
                            id: $route.query.id
                        }
                    }
                },
                {
                    path: 'userInfoUpdate',
                    component: UserInfoUpdate,
                    props($route) {
                        return {
                            id: $route.query.id
                        }
                    }
                },
                {
                    path: 'updatePassword',
                    component: UpdatePassword
                },
                {
                    path: 'userManagement',
                    component: UserManagement
                }
            ]
        }
        // {
        // 	name:'guanyu',
        // 	path:'/about',
        // 	component:About
        // },
        // {
        // 	path:'/home',
        // 	component:Home,
        // 	children:[
        // 		{
        // 			path:'news',
        // 			component:News,
        // 		},
        // 		{
        // 			path:'message',
        // 			component:Message,
        // 			children:[
        // 				{
        // 					name:'xiangqing',
        // 					path:'detail',
        // 					component:Detail,

        // 					//props的第一种写法，值为对象，该对象中的所有key-value都会以props的形式传给Detail组件。
        // 					// props:{a:1,b:'hello'}

        // 					//props的第二种写法，值为布尔值，若布尔值为真，就会把该路由组件收到的所有params参数，以props的形式传给Detail组件。
        // 					// props:true

        // 					//props的第三种写法，值为函数
        // 					props($route){
        // 						return {
        // 							id:$route.query.id,
        // 							title:$route.query.title,
        // 							a:1,
        // 							b:'hello'
        // 						}
        // 					}

        // 				}
        // 			]
        // 		}
        // 	]
        // }
    ]
})
