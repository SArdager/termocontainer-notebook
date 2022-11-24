window.addEventListener("load", function(){
    $('#users_table_body').on('click', function(event){
        var elem = event.target || event.srcElement;
        var login = elem.innerHTML;
        var userName =  elem.nextElementSibling.innerHTML;
        var show_rights = "";
        var rights_html = "";
        $('#userLogin').html(userName);
        $.ajax({
             url: '../user/load-data/user-rights',
             method: 'POST',
             dataType: 'json',
             data: {username: login},
             success: function(userRightsList) {
                 document.getElementById("show_rights").style.display = "block";
                 var rights_body = $('#rights_table_body');
                 rights_body.html('');
                 $.each(userRightsList, function(key, rights){
                     rights_html += "<tr><td>" + rights.departmentName + ", " + rights.branchName +
                             "</td><td>" + rights.rights + "</td></tr>";
                 });
                 rights_body.prepend(rights_html);
                 $("thead[tabindex=0]").focus();
             },
             error:  function(response) {
                 $('#result_line').html("Для получения информации о правах пользователя кликните по ячейке с логином.");
                 document.getElementById("show_rights").style.display = "none";
             }
        });
    });

    $('#btn_find_user').on('click', function(event){
        document.getElementById("show_rights").style.display = "none";
        document.getElementById("show_table").style.display = "none";
        $.ajax({
            url: '../admin/find-user',
            method: 'POST',
            dataType: 'json',
            data: {surname: $('#search_surname').val(), firstname: $('#search_firstname').val(),
                    branchId: $('#select_branch').val()},
            success: function(users) {
                var new_lines_html ='';
                var body = $('#users_table_body');
                body.html('');
                document.getElementById("show_table").style.display = "block";
                $.each(users, function(key, user){
                    if(!$.isArray(users)|| !users.length){
                        $('#result_line').html("Указанный в запросе пользователь отсутствует в базе.");
                    } else {
                        new_lines_html+="<tr><td style='color: blue; text-decoration: underline'>"+ user.username + "</td><td>" +
                            user.userSurname + " " + user.userFirstname + "</td><td>" +
                            user.position + "</td><td>" + user.email + "</td><td>" +
                            user.isEnabled + "</td><td>" + user.role + "</td></tr>";
                    }
                });
                body.prepend(new_lines_html);
            },
            error:  function(response) {
                $('#result_line').html("Для получения информации о правах пользователя кликните по ячейке с логином.");
            }
        });
    });


});

