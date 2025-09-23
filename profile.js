

    const urlPar= new URLSearchParams(window.location.search)
    const id = urlPar.get("postId")

    profileCard()
    getPosts()

    function profileCard(){
        axios.get(`https://tarmeezacademy.com/api/v1/users/${id}`)
       .then(response => {
            const user = response.data.data
            document.getElementById("main-info-img").src = user.profile_image
            document.getElementById("main-info-email").innerHTML = user.email
            document.getElementById("main-info-name").innerHTML = user.name
            document.getElementById("main-info-username").innerHTML = user.username
            document.getElementById("name-posts").innerHTML = user.name
            document.getElementById("posts-count").innerHTML = user.posts_count
            document.getElementById("comments-count").innerHTML = user.comments_count
       })
       .catch((error)=>{
            alrt(error.response.data.message , "danger")
       })
    }

    function getPosts(){

        axios(`https://tarmeezacademy.com/api/v1/users/${id}/posts`)
        .then((response)=>{
            let posts = response.data.data

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
                document.getElementById("user-posts").innerHTML += `
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
                                    <span id="tag-${post.id}"></span>
                                </div>
                                <div id="add-comment-div"></div>
                            </div>
                        </div>
                `

                let currentPost = `tags-${post.id}`
                for(tag of post.tags){
                     document.getElementById(currentPost).innerHTML += `
                                        <button class="tagBtn">${tag.name}</button>
                     `
                }
            }
        })
        .catch((error)=>{
            alrt(error.response.data.message , "danger")
       })
    }