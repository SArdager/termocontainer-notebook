$(document).ready(function(){

    $.ajax({
        url: '../user/choose-branch',
        method: 'POST',
        dataType: 'html',
        success: function(message) {
            let branches_table_body = $('#branches_table_body');
            branches_table_body.prepend(message);
        },
        error:  function(response) {
           window.scrollTo({ top: 0, behavior: 'smooth' });
           $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
        }
    });

    function loadDepartments(branchId){
        $('#departments_table_body').html("");
        $.ajax({
            url: '../user/choose-department',
            method: 'POST',
            dataType: 'html',
            data: {branchId: branchId},
            success: function(message) {
                let departments_table_body = $('#departments_table_body');
                departments_table_body.prepend(message);
            },
            error:  function(response) {
               window.scrollTo({ top: 0, behavior: 'smooth' });
               $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
            }
        });
    }

    $('#all_branches').on('click', function(){
        $('#branches_table_body tr').css("background", "white");
        $('#departments_table_body').html("");
        if($('#all_branches').is(':checked')){
            $('.branch_box').each(function(){
                this.checked = true;
                $('#btn_save').css("display", "block");
            });
        } else {
            $('.branch_box').each(function(){
                this.checked = false;
                $('#btn_save').css("display", "none");
            });
        }
    });

    $('#all_departments').on('click', function(){
        $('#departments_table_body tr').css("background", "white");
        $('#save_dep').css("display", "none");
        if($('#all_departments').is(':checked')){
            $('.dep_box').each(function(){
                this.checked = true;
            });
        } else {
            $('.dep_box').each(function(){
                this.checked = false;
                $('#btn_save').css("display", "none");
            });
        }
    });

    $('#branches_table_body').on('click', function(event){
        let elem = event.target || event.srcElement;
        let trId = elem.closest('tr').id;
        $('#branches_table_body tr').css("background", "white");
        document.getElementById(trId).style.background = "blue";
        let branchId = trId.substring(3);
        let local_box = document.getElementById("br_" + branchId);
        $('#departments_table_body').html("");
        $('#save_dep').css("display", "none");
        $('#btn_save').css("display", "none");
        if(local_box.checked == true){
            loadDepartments(branchId);
        }
        $('.branch_box').each(function(){
            if(this.checked == true){
                $('#btn_save').css("display", "block");
            }
        });
    });

    $('#departments_table_body').on('click', function(event){
        $('#save_dep').css("display", "block");
        let elem = event.target || event.srcElement;
        let trdId = elem.closest('tr').id;
        $('#departments_table_body tr').css("background", "white");
        document.getElementById(trdId).style.background = "green";
        let departmentId = trdId.substring(4);
        document.getElementById("dep_" + departmentId).checked = true;
    });

    $('#btn_save').on("click", function(){
        $('#btn_save').css("display", "none");
        let branchArray = "";
        let depArray = "";
        let branchId;
        $('.branch_box:checkbox:checked').each(function() {
            let boxId = $(this).attr('id');
            let tr = document.getElementById("tr" + boxId.substring(2));
            if(tr.style.background == "blue"){
                branchId = boxId.substring(3);
            }
            branchArray += boxId.substring(3) + ",";
        });
        $('.dep_box:checkbox:checked').each(function() {
            let depBoxId = $(this).attr('id');
            depArray += depBoxId.substring(4) + ",";
        });
        $.ajax({
            url: '../user/save-branch-preferences',
            method: 'POST',
            dataType: 'html',
            data: {brPref: branchArray, depPref: depArray, branchId: branchId},
            success: function(message) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                $('#result_line').html(message);
                $('#btn_save').css("display", "block");
            },
            error:  function(response) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                $('#btn_save').css("display", "block");
            }
        });
    });

    $('#save_dep').on("click", function(){
        $('#save_dep').css("display", "none");
        $('#btn_save').css("display", "none");
        let departmentId;
        $('.dep_box:checkbox:checked').each(function() {
            let depBoxId = $(this).attr('id');
            let tr = document.getElementById("trd" + depBoxId.substring(3));
            if(tr.style.background == "green"){
                departmentId = depBoxId.substring(4);
            }
        });
        let branchArray = "";
        let depArray = "";
        let branchId;
        $('.branch_box:checkbox:checked').each(function() {
            let boxId = $(this).attr('id');
            let tr = document.getElementById("tr" + boxId.substring(2));
            if(tr.style.background == "blue"){
                branchId = boxId.substring(3);
            }
            branchArray += boxId.substring(3) + ",";
        });
        $('.dep_box:checkbox:checked').each(function() {
            let depBoxId = $(this).attr('id');
            depArray += depBoxId.substring(4) + ",";
        });

        if(departmentId!=null){
            $.ajax({
                url: '../user/save-preferences',
                method: 'POST',
                dataType: 'html',
                data: {brPref: branchArray, depPref: depArray, branchId: branchId, departmentId: departmentId},
                success: function(message) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    $('#result_line').html(message);
                    $('#save_dep').css("display", "block");
                    $('#btn_save').css("display", "block");
                },
                error:  function(response) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                    $('#save_dep').css("display", "block");
                    $('#btn_save').css("display", "block");
                }
            });
        }
    });

});
