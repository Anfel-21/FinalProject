
    let currentPage = 1
    let lastPage =1

    window.addEventListener("scroll",()=>{
        // endOfPage : boolean
        const endOfPage = window.innerHeight + window.pageYOffset >= document.body.scrollHeight

        if(endOfPage && currentPage < lastPage){
            currentPage = currentPage + 1
            posts(currentPage)
        }
    })

    posts()
    UI()

    function posts(page=1){
        
        axios(`https://tarmeezacademy.com/api/v1/posts?limit=5&page=${page}`)
        .then((response)=>{
            let posts = response.data.data
            lastPage = response.data.meta.last_page

            const postsFragment = document.createDocumentFragment()
            for(let post of posts){

                let user = getCurrentUser()
                let isMyPost = user != null && post.author.id == user.id
                let Content = ``

                if(isMyPost){
                    Content = `
                            <button class="btn btn-danger" style="float:right; margin-left:5px;" onclick="deletePost('${encodeURIComponent(JSON.stringify(post))}')">Delete</button>
                            <button class="btn btn-secondary" style="float:right;" onclick="editPost('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>                            
                    `
                }
                
                let postTitle = ""
                if(post.title != null){
                    postTitle = post.title 
                }

                const div = document.createElement("div")
                div.innerHTML = `
                    <div class="card" style="cursor : pointer;">
                            <span class="card-header">
                                <span onclick="userClicked(${post.author.id})">
                                    <img src="${post.author.profile_image}" alt="header-img" class="card-header-img">
                                    <b>${post.author.username}</b>
                                </span>
                                ${Content}
                            </span>
                             
                            <div class="card-body" onclick="postClicked(${post.id})">
                                <img src="${post.image}" alt="body-img" class="card-body-img">
                                <h6>${post.created_at}</h6>
                                <h5 class="card-title">${postTitle}</h5>
                                <p class="card-body">${post.body}</p>
                                <hr>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                                    </svg>
                                    <span>(${post.comments_count}) comments</span>
                                    <span class="tags-container"></span>
                                </div>
                                <div id="add-comment-div"></div>
                            </div>
                        </div>
                `

                const tagsContainer = div.querySelector(".tags-container")
                const tagsFragment = document.createDocumentFragment()
                for (let tag of post.tags) {
                    const btn = document.createElement("button")
                    btn.className = "tagBtn"
                    btn.innerHTML = tag.name
                    tagsFragment.appendChild(btn)
                }
                tagsContainer.appendChild(tagsFragment)


                postsFragment.appendChild(div)
            }
            document.getElementById("posts").appendChild(postsFragment)
        })
    }


    function login(){
        let username = document.getElementById("username").value
        let password = document.getElementById("password").value

        let body ={
            username : username ,
            password : password
        }

        axios.post(`https://tarmeezacademy.com/api/v1/login`, body)
        .then((response)=>{
            localStorage.setItem( "token" , response.data.token)
            localStorage.setItem( "user" , JSON.stringify(response.data.user))

            const modal = document.getElementById("loginModal")
            const modalInstance = bootstrap.Modal.getInstance(modal) 
            modalInstance.hide()

            alrt('logged in successfully!', "success")
            UI()
        })
        .catch((error)=>{
            alrt(error , "danger")
        })
    }


    function alrt(msg , type){
        const alertPlaceholder = document.getElementById('alert')
        const appendAlert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        alertPlaceholder.append(wrapper)
        }
        appendAlert(msg, type)
    }


    function UI(){
        const token = localStorage.getItem("token")

        const loginDiv = document.getElementById("login-div")
        const logoutDiv = document.getElementById("logout-div")
        const addBtn = document.getElementById("addBtn")
        const addCommentDiv = document.getElementById("add-comment-div") 

        if(token == null){
            loginDiv.style.setProperty("display", "flex" , "important")
            logoutDiv.style.setProperty("display", "none" , "important")
            addBtn.style.setProperty("display", "none" , "important")
            addCommentDiv.style.setProperty("display", "none" , "important")
        }else{
            loginDiv.style.setProperty("display", "none" , "important")
            logoutDiv.style.setProperty("display", "flex" , "important")
            addBtn.style.setProperty("display", "flex" , "important")
            addCommentDiv.style.setProperty("display", "flex" , "important")

            const user = getCurrentUser()
            document.getElementById("nav-username").innerHTML = user.username  
            document.getElementById("nav-image").src = user.profile_image
        }
    }


    function logout(){
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        alrt("logged out successfully",'success')
        UI()
    }


    function register() {
        let name = document.getElementById("reg-name").value
        let username = document.getElementById("reg-username").value
        let password = document.getElementById("reg-password").value
        let image = document.getElementById("reg-image").files[0]

        let data = new FormData()
        data.append("name",name)
        data.append("username",username)
        data.append("password",password)
        data.append("image",image)

        axios.post("https://tarmeezacademy.com/api/v1/register", data)
        .then((response)=>{
            localStorage.setItem( "token" , response.data.token)
            localStorage.setItem( "user" , JSON.stringify(response.data.user))

            const modal = document.getElementById("registerModal")
            const modalInstance = bootstrap.Modal.getInstance(modal) 
            modalInstance.hide()

            alrt('New User Registered successfully!','success')
            UI()
        })
        .catch((error)=>{
            alrt(error.response.data.message , "danger")
        })
    }


    function createNewPost(){
        let token = localStorage.getItem("token")

        let postId = document.getElementById("post-id").value
        let isCreate = postId == null || postId == ""

        const image = document.getElementById("postImage").files[0]
        const title = document.getElementById("postTitle").value
        const body = document.getElementById("postBody").value

        let data = new FormData()
        data.append("image",image)
        data.append("title",title)
        data.append("body",body)

        const headers = {
            authorization : `Bearer ${token}`
        }

        let url = ""
        let msg = ""
        if(isCreate){
            url = "https://tarmeezacademy.com/api/v1/posts"
            msg = 'New Post Has Been created!'
        }else{
            data.append("_method", "put")
            url =  `https://tarmeezacademy.com/api/v1/posts/${postId}`
            msg = "The Post Has Been Modified"
        }


        axios.post(url, data , {
            headers: headers
        })
        .then(()=>{
            const modal = document.getElementById("createPostModal")
            const modalInstance = bootstrap.Modal.getInstance(modal) 
            modalInstance.hide()

            alrt(msg,'success')
            UI()
        })
        .catch((error)=>{
            alrt(error.response.data.message , "danger")
        })

    }


    function getCurrentUser(){
        let user = null
        let storageUser = localStorage.getItem("user")

        if (storageUser != null){
            user = JSON.parse(storageUser)
        }
        return user

    }


    function postClicked(postId){
        window.location = `post.html?postId=${postId}`
    }


    function editPost(obj){
        let post = JSON.parse(decodeURIComponent(obj))

        document.getElementById("post-id").value = post.id

        document.getElementById("title").innerHTML = "Edit Post"
        document.getElementById("postTitle").value = post.title
        document.getElementById("postBody").value = post.body
        document.getElementById("btn").innerHTML = "Update"
        let postModel = new bootstrap.Modal(document.getElementById("createPostModal"), {})
        postModel.toggle()
    }


    function deletePost(obj){
        let post = JSON.parse(decodeURIComponent(obj))

        document.getElementById("post-id").value = post.id
        let postModel = new bootstrap.Modal(document.getElementById("deletPostModal"), {})
        postModel.toggle()
    }


    function confirmeDeletePost(){
        let id = document.getElementById("post-id").value

        let token = localStorage.getItem("token")
        const headers = {
            authorization : `Bearer ${token}`
        }

        axios.delete(`https://tarmeezacademy.com/api/v1/posts/${id}` , {
            headers: headers
        })
        .then(()=>{
            const modal = document.getElementById("deletPostModal")
            const modalInstance = bootstrap.Modal.getInstance(modal) 
            modalInstance.hide()

            alrt("The Post Has Been deleted successfully",'success')
            UI()
        })
        .catch((error)=>{
            alrt(error.response.data.message , "danger")
        })
    }

    function userClicked(postId){
        window.location = `profile.html?postId=${postId}`
    }


    function profileClicked(){
        const user = getCurrentUser()
        const userId = user.id
        window.location = `profile.html?postId=${userId}`
    }

    
   