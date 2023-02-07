$(document).ready(function(){

    $('#select_department').on('change', function(){
        $('#user_clean').trigger("click");
    });

    $('#select_user').on('change', function(){
        if($('#select_user').val()>0){
            $('#user_id').val($('#select_user').val());
            $('#user_name').val($('#select_user option:selected').text());
            loadUserRights();
        } else {
            $('#user_clean').trigger("click");
        }
    });
    $('#select_short').on('change', function(){
        if($('#select_short').val()>0){
            $('#user_id').val($('#select_short').val());
            $('#user_name').val($('#select_short option:selected').text());
            loadUserRights();
        } else {
            $('#user_clean').trigger("click");
        }
    });

    function loadUserRights(){
        $.ajax({
            url: '../user/load-data/user-rights',
            method: 'POST',
            dataType: 'json',
            data: {userId: $('#user_id').val()},
            success: function(userRightsList) {
                let currentDepartmentId = $('#select_department').val();
                let userRole = "reset";
                $.each(userRightsList, function(key, userRights){
                    if(userRights.departmentId == currentDepartmentId){
                        userRole = userRights.rights;
                    }
                });
                if(userRole==="chef") {
                    $('#user_clean').trigger("click");
                    $('#result_line').html("Вы не можете поменять права этому пользователю на данном объекте");
                } else {
                    if(userRole==="reader"){
                        document.getElementById("readerId").checked = true;
                    } else if(userRole==="editor"){
                        document.getElementById("editorId").checked = true;
                    } else if(userRole==="courier"){
                        document.getElementById("courierId").checked = true;
                    } else if(userRole==="changer"){
                        document.getElementById("changerId").checked = true;
                    } else if(userRole==="righter"){
                        document.getElementById("righterId").checked = true;
                    } else {
                        document.getElementById("resetId").checked = true;
                    }
                }
            },
            error:  function(response) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
            }
        });
    };

    let user_name = document.getElementById("user_name");
    user_name.oninput = function(){
        let textValue = $('#user_name').val().trim();
        if(textValue.length>0 && textValue.length<5){
            $('#select_short').empty();
            $('#user_id').val(0);
            document.getElementById("show_select").style.display = "none";
            document.getElementById("show_short_select").style.display = "block";
            $('#select_short').append("<option value='0'>Кликните пользователя</option>");
            $("#select_user option").each(function() {
                let u_val= $(this).val();
                let u_name= $(this).text();
                if(u_name.indexOf(textValue)>-1){
                    $('#select_short').append("<option value='" + u_val + "'>" + u_name + "</option>");
                }
            });
        }
    };

    $('#user_clean').on('click', function(){
        $('#user_id').val("0");
        $('#user_name').val("");
        $('#select_user').val("0");
        document.getElementById("resetId").checked = true;
        document.getElementById("show_select").style.display = "block";
        document.getElementById("show_short_select").style.display = "none";
    });

    $('#btn_rights').on('click', function(){
        let user_rights = $('input[type="radio"][name="rights"]:checked').val();

        if($('#user_id').val() > 0){
            $.ajax({
                url: '../user/change-rights',
                method: 'POST',
                dataType: 'text',
                data: {userId: $('#user_id').val(), departmentId: $('#select_department').val(),
                    rights: user_rights },
                success: function(message) {
                    $('#result_line').html(message);
                },
                error:  function(response) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                }
            });
        } else {
            $('#result_line').html("Выберите пользователя из списка");
        }
    });

    $('#btn_del').on('click', function(){

        if($('#user_id').val() > 0){
            $.ajax({
                url: '../user/del-user',
                method: 'POST',
                dataType: 'text',
                data: {id: $('#user_id').val()},
                success: function(message) {
                    $('#result_line').html(message);
                },
                error:  function(response) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                }
            });
        } else {
            $('#result_line').html("Выберите пользователя из списка");
        }
    });



});
