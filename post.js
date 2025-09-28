

    const urlPar= new URLSearchParams(window.location.search)
    const id = urlPar.get("postId")

    post()

    function post(){
        axios(`https://tarmeezacademy.com/api/v1/posts/${id}`)
        .then((response) => {
            let post = response.data.data
            const comments = post.comments
            const author = post.author

            document.getElementById("username-span").innerHTML = `${author.username}'s Post`

            let postTitle = ""

            if(post.title != null){
                postTitle = post.title
            }

            let commentsContent =``
            for(comment of comments){
                commentsContent += `
                                <div class="comment p-3" style="background-color: rgba(234, 216, 239, 1); border-bottom: 1 solid;">
                                    <div >
                                        <img src="${comment.author.profile_image}" alt="profile-image" class="rounded-circle" style="width: 40px; height: 40px;">
                                        <b>${comment.author.username}</b>
                                    </div>
                                    <div style="margin-top : 7px;">${comment.body}</div>            
                                </div>
                `
            }

            document.getElementById("post").innerHTML = `
                                <!-- POST -->
                                    <div class="card shadow " style="margin-bottom: 30px;">
                                        <div class="card-header">
                                            <img class="rounded-circle border border-2" src="${post.author.profile_image}" alt="profile" style="width: 40px; height: 40px;">
                                            <b>${author.username}</b>
                                        </div>
                                        <div class="card-body" onclick="posttClicked(${post.id})" style="cursor: pointer;">
                                            <img src="${post.image}" alt="placeholder" style="width: 100%; height: 300px;">
                                            <h6 style="color: rgba(128, 128, 128, 0.656);" class="mt-1">${post.created_at}</h6>
                                            <h5>${post.title}</h5>
                                            <p>${post.body}</p>
                                            <hr>
                                            <div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                                                    </svg>
                                                    <span>(${post.comments_count}) comments</span>
                                                    <span id="postt-tags-${post.id}"></span>
                                            </div>
                                        </div>
                                        <div id="comments">
                                           ${commentsContent}
                                        </div>
                                        <div class="input-group mb-3" id="add-comment-div">
                                            <input id="comment-input" type="text" placeholder="add your comment here.." class="form-control">
                                            <button class="btn btn-outline-primary" type="button" onclick="addComment()">send</button>
                                        </div>
                                    </div>
                                <!--// POST //-->
                `   
        }) 
    }


    function addComment(){
        let comment = document.getElementById("comment-input").value

        let body ={
            body : comment
        }

        let token = localStorage.getItem("token")
        const headers = {
            authorization : `Bearer ${token}`
        }

         axios.post(`https://tarmeezacademy.com/api/v1/posts/${id}/comments`, body , {
            headers: headers
        })
        .then(()=>{
            alrt('The Comment Has Been Created successfully!','success')
            post()
            UI()
        })
        .catch((error)=>{
            alrt(error.response.data.message , "danger")
        })
    }