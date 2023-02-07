$(document).ready(function(){

    let validNumber = /^[0-9]+$/;

    $('#btn_outcome').on('click', function(){
        if($('#select_department').val() == $('#departmentId').val()){
            var x = confirm("Проверьте правильность выбора получателя. \nПодтвердите направление термоконтейнера по круговому маршруту " +
            "или отмените отгрузку термоконтейнера (посылки)");
            if(x){
                registerOut();
            }
        } else {
            registerOut();
        }
    });

    function registerOut(){
        let btn_outcome = document.getElementById("btn_outcome");
        let number_outcome = $('#number_outcome').val();
        let firstLetter = number_outcome.substring(0, 1);
        let dateValue = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString().slice(0, -3);
        $('#time_outcome').html("");
        $('#status_outcome').html("");
        if(number_outcome.length > 0){
            if(validNumber.test($('#payment').val())){
                if(validNumber.test(firstLetter)){
                    btn_outcome.style.display = "none";
                    $.ajax({
                        url: 'check-out/send',
                        method: 'POST',
                        dataType: 'text',
                        data: {toId: $('#select_department').val(), containerNumber: $('#number_outcome').val(), text: $('#textarea_out').val(),
                            payment: $('#payment').val(), amount: $('#amount').val(), thermometer: $('#thermometer').val(), date: dateValue},
                        success: function(message) {
                            if(message.indexOf("уже оформлен")>0){
                                let x = confirm(message);
                                if(x){
                                    $.ajax({
                                        url: 'check-out/again-send',
                                        method: 'POST',
                                        dataType: 'text',
                                        data: {toId: $('#select_department').val(), containerNumber: $('#number_outcome').val(), text: $('#textarea_out').val(),
                                            payment: $('#payment').val(), amount: $('#amount').val(), thermometer: $('#thermometer').val(), date: dateValue},
                                        success: function(message) {
                                            $('#result_line').html(message);
                                            $('#number_outcome').val("");
                                            $('#container_number').val("");
                                            $('#costs_part').val("0");
                                            $('#payment').val("0");
                                            $('#amount').val("1");
                                            $('#number_outcome').focus();
                                            $('#time_outcome').html(dateValue);
                                            $('#status_outcome').html("Переоформлена отгрузка термоконтейнера");
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                            $('#result_line').html("Отгрузка термоконтейнера переоформлена на другой объект");
                                        },
                                        error:  function(response) {
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                            $('#result_line').html("Ошибка регистрации отгрузки термоконтейнера. Перегрузите страницу.");
                                            btn_outcome.style.display = "block";
                                        }
                                    });
                                }
                            } else if(message.indexOf("пользователь")>0){
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                $('#result_line').html(message);
                                $('#number_outcome').val("");
                                $('#container_number').val("");
                                $('#costs_part').val("0");
                                $('#payment').val("0");
                                $('#amount').val("1");
                                $('#number_outcome').focus();
                                $('#status_outcome').html("Нельзя оформить отправку термоконтейнера");
                            } else {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                $('#result_line').html(message);
                                $('#number_outcome').val("");
                                $('#container_number').val("");
                                $('#costs_part').val("0");
                                $('#payment').val("0");
                                $('#amount').val("1");
                                $('#number_outcome').focus();
                                $('#time_outcome').html(dateValue);
                                $('#status_outcome').html("Регистрация отправки термоконтейнера");
                            }
                            btn_outcome.style.display = "block";
                        },
                        error:  function(response) {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            $('#result_line').html("Ошибка регистрации отгрузки. Перегрузите страницу.");
                            btn_outcome.style.display = "block";
                        }
                    });
                    document.getElementById("payment_tr").style.display = "table-row";
                    document.getElementById("btn_add_parcel").style.display = "none";
                    document.getElementById("costs_part_tr").style.display = "none";
                    document.getElementById("container_tr").style.display = "none";
                    document.getElementById("amount_tr").style.display = "table-row";
                } else {
                    btn_outcome.style.display = "none";
                    $.ajax({
                        url: 'check-out/send-parcel',
                        method: 'POST',
                        dataType: 'text',
                        data: {toId: $('#select_department').val(), parcelNumber: $('#number_outcome').val(),
                            text: $('#textarea_out').val(), payment: $('#payment').val(), date: dateValue},
                        success: function(message) {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            $('#result_line').html(message);
                            $('#number_outcome').val("");
                            $('#container_number').val("");
                            $('#costs_part').val("0");
                            $('#payment').val("0");
                            $('#amount').val("1");
                            $('#number_outcome').focus();
                            $('#status_outcome').html("Отгрузка посылки оформлена.");
                            $('#reload_output').trigger("click");
                            btn_outcome.style.display = "block";
                            document.getElementById("payment_tr").style.display = "table-row";
                            document.getElementById("btn_add_parcel").style.display = "none";
                            document.getElementById("costs_part_tr").style.display = "none";
                            document.getElementById("container_tr").style.display = "none";
                            document.getElementById("amount_tr").style.display = "table-row";
                        },
                        error:  function(response) {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            $('#result_line').html("Ошибка регистрации отгрузки. Перегрузите страницу.");
                            btn_outcome.style.display = "block";
                        }
                    });
                }
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                $('#result_line').html("В строке оплаты отгрузки должна указана стоимость в числах (при отсутствии оплаты - ноль)");
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            $('#result_line').html("Введите номер термоконтейнера");
        }
    }

    $('#btn_income').on('click', function(){
        let btn_income = document.getElementById('btn_income');
        let number_income = $('#number_income').val();
        let dateValue = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString().slice(0, -3);
        $('#time_income').html("");
        $('#status_income').html("");
        if(number_income.length > 0){
            btn_income.style.display = "none";
            let firstLetter = number_income.substring(0, 1);
            if(validNumber.test(firstLetter)){
                $.ajax({
                    url: '../user/check-in/check',
                    method: 'POST',
                    dataType: 'text',
                    data: {containerNumber: $('#number_income').val(), date: dateValue, text: $('#textarea_in').val()},
                    success: function(message) {
                        if(message.indexOf("ЖЕЛАЕТЕ")>0){
                            let x = confirm(message);
                            if(x){
                                $.ajax({
                                    url: '../user/check-in/check-route-off',
                                    method: 'POST',
                                    dataType: 'text',
                                    data: {containerNumber: $('#number_income').val(), date: dateValue, text: $('#textarea_in').val()},
                                    success: function(message) {
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                        $('#result_line').html(message);
                                        $('#time_income').html(dateValue);
                                        $('#status_income').html("Зарегистрировано прибытие");
                                    },
                                    error:  function(response) {
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                        $('#result_line').html("Ошибка регистрации термоконтейнера. Перегрузите страницу.");
                                    }
                                });
                            }
                        } else if(message.indexOf("внесено")>0){
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            $('#result_line').html(message);
                            $('#time_income').html(dateValue);
                            $('#status_income').html(message.substring(41));
                        } else {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            $('#result_line').html(message);
                        }
                        $('#reload_input').trigger("click");
                        btn_income.style.display = "block";
                    },
                    error:  function(response) {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        $('#result_line').html("Ошибка регистрации прибытия. Перегрузите страницу.");
                        btn_income.style.display = "block";
                    }
                });
            } else {
                $.ajax({
                    url: '../user/check-in/parcel',
                    method: 'POST',
                    dataType: 'text',
                    data: {parcelNumber: $('#number_income').val(), date: dateValue, text: $('#textarea_in').val()},
                    success: function(message) {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        $('#result_line').html(message);
                        if(message.indexOf("Нельзя")<0){
                            $('#time_income').html(dateValue);
                            $('#status_income').html(message.substring(17));
                            $('#reload_input').trigger("click");
                        }
                        btn_income.style.display = "block";
                    },
                    error:  function(response) {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        $('#result_line').html("Ошибка регистрации прибытия. Перегрузите страницу.");
                        btn_income.style.display = "block";
                    }
                });
            }
        }
    });

    $('#btn_check').on('click', function(){
        let btn_check = document.getElementById('btn_check');
        let number_check = $('#number_check').val();
        let dateValue = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString().slice(0, -3);
        $('#time_check').html("");
        $('#status_check').html("");
        if(number_check.length > 0){
            btn_check.style.display = "none";;
            $.ajax({
                url: '../user/check-between/check',
                method: 'POST',
                dataType: 'text',
                data: {containerNumber: $('#number_check').val(), date: dateValue, text: $('#textarea_between').val()},
                success: function(message) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    $('#result_line').html(message);
                    $('#time_check').html(dateValue);
                    $('#status_check').html("Прохождение термоконтейнера зарегистрировано");
                    btn_check.style.display = "block";
                },
                error:  function(response) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    $('#result_line').html("Ошибка регистрации термоконтейнера. Перегрузите страницу.");
                    btn_check.style.display = "block";
                }
            });
        }
    });

    $('#btn_courier').on('click', function(){
        let btn_courier = document.getElementById('btn_courier');
        let number_check = $('#number_check').val();
        let dateValue = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString().slice(0, -3);
        if(number_check.length > 0){
            btn_courier.style.display = "none";;
            $.ajax({
                url: '../user/check-between/check',
                method: 'POST',
                dataType: 'text',
                data: {containerNumber: $('#number_check').val(), date: dateValue, text: $('#textarea_courier').val()},
                success: function(message) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    $('#result_line').html(message);
                    btn_courier.style.display = "block";
                },
                error:  function(response) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    $('#result_line').html("Ошибка регистрации термоконтейнера. Перегрузите страницу.");
                    btn_courier.style.display = "block";
                }
            });
        }
    });

    $('#reload_input').on('click', function(){
        document.getElementById('parcels_table').style.display = "none";

        $.ajax({
            url: '../user/load-data/container-notes',
            method: 'POST',
            dataType: 'json',
            success: function(notes) {
                let income_table_body = $('#income_table_body');
                income_table_body.html('');
                if(notes!=null && notes.length>0){
                    let notes_html = "";
                    $.each(notes, function(key, note){
                        notes_html += "<tr><td>" + note.id + "</td><td>" + note.waitTime + "</td><td>" +
                               note.containerNumber  + "</td><td>" + note.outDepartment + "</td></tr>";
                    });
                    income_table_body.prepend(notes_html);
                } else {
                    income_table_body.prepend("<tr><td colspan='4'>Нет отгруженных термоконтейнеров</td></tr>");
                }
                $.ajax({
                    url: '../user/load-data/parcels',
                    method: 'POST',
                    dataType: 'json',
                    success: function(parcels) {
                        if(parcels!=null && parcels.length>0){
                            document.getElementById('parcels_table').style.display = "block";
                            let parcels_html = "";
                            let parcels_table_body = $('#parcels_table_body');
                            parcels_table_body.html('');
                            $.each(parcels, function(key, parcel){
                                parcels_html += "<tr><td>" + parcel.parcelNumber + "</td><td>" + parcel.destinationName + "</td><td>" +
                                       parcel.parentNumber  + "</td><td>" + parcel.parcelType + "</td><td>" + parcel.dimensions + "</td></tr>";
                            });
                            parcels_table_body.prepend(parcels_html);
                        }
                    },
                    error:  function(response) {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                    }
                });
            },
            error:  function(response) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
            }
        });
    });

    $('#reload_output').on('click', function(){
        document.getElementById("parcels_field").style.display = "block";
        $('#show_parcels').html("Скрыть поле просмотра посылок");
        $.ajax({
            url: '../user/load-data/ready_parcels',
            method: 'POST',
            dataType: 'json',
            success: function(parcels) {
                let parcels_html = "";
                let outcome_parcels_body = $('#outcome_parcels_body');
                outcome_parcels_body.html('');
                if(parcels!=null && parcels.length>0){
                    $.each(parcels, function(key, parcel){
                        parcels_html += "<tr><td>" + parcel.parcelNumber + "</td><td>" + parcel.destinationName + "</td><td>" +
                               parcel.parentNumber  + "</td><td>" + parcel.parcelType + "</td><td>" + parcel.dimensions + "</td></tr>";
                    });
                } else {
                    parcels_html = "<tr><td colspan='5'>Нет посылок на отгрузку</td></tr>"
                }
                outcome_parcels_body.prepend(parcels_html);
            },
            error:  function(response) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
            }
        });
    });

    let parcels_field = document.getElementById("parcels_field");
    $('#show_parcels').on('click', function(){
        if(parcels_field.style.display == 'block'){
            parcels_field.style.display = "none";
            $('#show_parcels').html("Поле просмотра посылок");
        } else {
            parcels_field.style.display = "block";
            $('#show_parcels').html("Скрыть поле просмотра посылок");
        }
    });

    $('#btn_change').on('click', function(){
        if($('#userId').val() == $('#outUserId').val()){
            if($('#select_change_department').val() == $('#outDepartmentId').val()){
                window.scrollTo({ top: 0, behavior: 'smooth' });
                $('#result_line').html("Проверьте правильность выбора получателя");
            } else {
                if($('#select_change_department').val() == $('#toDepartmentId').val()){
                    saveChanges(true);
               } else {
                    var x = confirm("Вы изменяете ОБЪЕКТ получателя термоконтейнера!!\n Продолжить внесение изменений?");
                    if(x){
                        saveChanges(true);
                    }
                }
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            $('#result_line').html("Вносить изменения может только отправитель термоконтейнера!!!");
        }
    });

    $('#btn_arrive_change').on('click', function(){
        if($('#userId').val() == $('#toUserId').val()){
            saveChanges(false);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            $('#result_line').html("Вносить изменения может только получатель термоконтейнера!!!");
        }
    });

    $('#btn_between_change').on('click', function(){
        if($('#userId').val() == $('#passUserId').val()){
            saveChanges(false);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            $('#result_line').html("Вносить изменения может только получатель термоконтейнера!!!");
        }
    });

    function saveChanges(isOutChange){
        $('#line_cut_parcel').click();
        $.ajax({
            url: '../user/check-out/save-changes',
            method: 'POST',
            dataType: 'text',
            data: {noteId: $('#containerNoteId').text(), changeNote: $('#inputSendNote').val(), changeArriveNote: $('#inputArriveNote').val(), changeBetweenNote: $('#inputBetweenNote').val(),
                    changePay: $('#inputPay').val(), toDepartment: $('#select_change_department').val(), departmentId: $('#department_id').val(), isOutChange: isOutChange},
            success: function(message) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                $('#result_line').html(message);
            },
            error:  function(response) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                $('#result_line').html("Ошибка записи изменений в маршрутный лист. Перегрузите страницу.");
            }
        });
    }

    $('#department_checkbox').on('click', function(){
        if($('#department_checkbox').is(':checked')==true){
            $('#select_branch').val(0);
            $('#select_department').empty();
        }
    });

    $('#select_branch').on('click', function(){
        if($('#select_branch').val()>0){
            $('#department_checkbox').prop('checked', false);
        }
    });

    $('#btn_parcel').on('click', function(){
        let btn_parcel = document.getElementById("btn_parcel");
        let type_parcel = $('#select_parcel').val();
        let dimensions = $('#dimensions').val();
        if(type_parcel>0){
            if(dimensions.length<2 && type_parcel>1){
                window.scrollTo({ top: 0, behavior: 'smooth' });
                $('#result_line').html("Внесите габариты почтового отправления.");
            } else {
                let dateValue = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString().slice(0, -3);
                btn_parcel.style.display = "none";
                $.ajax({
                    url: '../user/check-parcel/create',
                    method: 'POST',
                    dataType: 'text',
                    data: {parcelType: type_parcel, destinationId: $('#select_department').val(), outDepartmentId: $('#departmentId').val(),
                        note: $('#note').val(), date: dateValue, dimensions: dimensions, information: $('#information').is(':checked')},
                    success: function(parcelNumber) {
                        if(parcelNumber!= null && parcelNumber.length == 8){
                            $('#parcel_number').val(parcelNumber);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            $('#result_line').html("Номер почтового отправления: " + parcelNumber);
                            $('#reload_parcel').trigger("click");
                        } else {
                            $('#parcelNumber').val("");
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            $('#result_line').html("Ошибка создания почтового отправления. Перегрузите страницу.");
                        }
                        btn_parcel.style.display = "block";
                    },
                    error:  function(response) {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        $('#result_line').html("Ошибка создания почтового отправления. Перегрузите страницу.");
                        btn_parcel.style.display = "block";
                    }
                });
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            $('#result_line').html("Выберите вид почтового отправления.");
        }
    });

    $('#reload_parcel').on('click', function(){
        $.ajax({
            url: '../user/check-parcel/load-results',
            method: 'POST',
            dataType: 'json',
            data: {departmentId: $('#departmentId').val()},
            success: function(parcels) {
                let parcels_html = "";
                let parcels_table_body = $('#parcels_table_body');
                parcels_table_body.html('');
                if(parcels!=null && parcels.length>0){
                    $.each(parcels, function(key, parcel){
                        parcels_html += "<tr><td>" + parcel.parcelNumber + "</td><td>" + parcel.destinationName +
                               "</td><td>" + parcel.dimensions  + "</td><td>" + parcel.parentNumber + "</td></tr>";
                    });
                } else {
                    parcels_html = "<tr><td colspan='4'>Отсутствуют подготовленные к отгрузке посылки</td></tr>";
                }
                parcels_table_body.prepend(parcels_html);
                $('#parcel_number').val("");
                document.getElementById("btn_send").style.display = "block";
                document.getElementById("btn_remove").style.display = "block";
                document.getElementById("btn_add").style.display = "none";
            },
            error:  function(response) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
            }
        });
    });

    $('#memory_department').on('click', function(){
        $.ajax({
            url: '../user/check-parcel/memory-department',
            method: 'POST',
            dataType: 'text',
            data: {departmentId: $('#select_change_department').val()},
            success: function(message) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                $('#result_line').html(message);
            },
            error:  function(response) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
            }
        });
    });

    $('#btn_send').on('click', function(){
        let btn_send = document.getElementById("btn_send");
        let parcel_number = $('#parcel_number').val();
        if(parcel_number.length>0){
            let dateValue = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString().slice(0, -3);
            btn_send.style.display = "none";
            $.ajax({
                url: '../user/check-parcel/send',
                method: 'POST',
                dataType: 'text',
                data: {parcelNumber: parcel_number, toDepartmentId: $('#select_change_department').val(), date: dateValue},
                success: function(message) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    $('#result_line').html(message);
                    $('#reload_parcel').trigger("click");
                    if(document.getElementById("parent_number")!=null){
                        $('#parent_number').val("");
                    }
                    if(document.getElementById("parcel_number")!=null){
                        $('#parcel_number').val("");
                    }
                    btn_send.style.display = "block";
                },
                error:  function(response) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    $('#result_line').html("Ошибка отгрузки почтового отправления. Перегрузите страницу.");
                    btn_send.style.display = "block";
                }
            });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            $('#result_line').html("Внесите номер почтового отправления.");
        }
    });

    $('#btn_add').on('click', function(){
        let btn_add = document.getElementById("btn_add");
        let parcel_number = $('#parcel_number').val();
        if(parcel_number.length>0){
            if(validNumber.test($('#costs_part').val())){
                btn_add.style.display = "none";
                $.ajax({
                    url: '../user/check-parcel/add-to-parent',
                    method: 'POST',
                    dataType: 'text',
                    data: {parcelNumber: parcel_number,  parentNumber: $('#parent_number').val(),
                        toDepartmentId: $('#select_change_department').val(), costsPart: $('#costs_part').val()},
                    success: function(message) {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        $('#result_line').html(message);
                        $('#reload_parcel').trigger("click");
                        $('#parcel_number').val("");
                        $('#parent_number').val("");
                        document.getElementById("costs_tr").style.display = "none";
                        btn_add.style.display = "block";
                    },
                    error:  function(response) {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        $('#result_line').html("Ошибка оформления почтового отправления. Перегрузите страницу.");
                        btn_add.style.display = "block";
                    }
                });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                $('#result_line').html("В строке доли оплаты доставки должна указана стоимость в числах (при отсутствии оплаты - ноль)");
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            $('#result_line').html("Внесите номер почтового отправления.");
        }
    });

    $('#btn_add_parcel').on('click', function(){
        let btn_add_parcel = document.getElementById("btn_add_parcel");
        btn_add_parcel.style.display = "none";
        let dateValue = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString().slice(0, -3);
        $.ajax({
            url: '../user/check-parcel/add-to-parent',
            method: 'POST',
            dataType: 'text',
            data: {parcelNumber: $('#number_outcome').val(),  parentNumber: $('#container_number').val(),
                toDepartmentId: $('#select_department').val(), costsPart: $('#costs_part').val(), date: dateValue},
            success: function(message) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                $('#result_line').html(message);
                btn_add_parcel.style.display = "block";
                $('#number_outcome').val("");
                $('#container_number').val("");
                $('#costs_part').val("0");
                $('#payment').val("0");
                $('#amount').val("1");
                $('#reload_output').trigger("click");
                document.getElementById("btn_outcome").style.display = "block";
                document.getElementById("payment_tr").style.display = "table-row";
                document.getElementById("btn_add_parcel").style.display = "none";
                document.getElementById("costs_part_tr").style.display = "none";
                document.getElementById("container_tr").style.display = "none";
                document.getElementById("amount_tr").style.display = "table-row";
            },
            error:  function(response) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                $('#result_line').html("Ошибка оформления почтового отправления. Перегрузите страницу.");
                btn_add_parcel.style.display = "block";
            }
        });
    });

    $('#btn_remove').on('click', function(){
        let btn_remove = document.getElementById("btn_remove");
        let parcel_number = $('#parcel_number').val();
        if(parcel_number.length>0){
            btn_remove.style.display = "none";
            let dateValue = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString().slice(0, -3);
            $.ajax({
                url: '../user/check-parcel/remove-from-parent',
                method: 'POST',
                dataType: 'text',
                data: {parcelNumber: parcel_number},
                success: function(message) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    $('#result_line').html(message);
                    btn_remove.style.display = "block";
                    $('#parcel_number').val("");
                    if(document.getElementById("parent_number")!=null){
                        $('#parent_number').val("");
                    }
                    if(document.getElementById("reload_parcel")!=null){
                        $('#reload_parcel').trigger("click");
                    }
                    if(document.getElementById("reload_output")!=null){
                        $('#reload_output').trigger("click");
                    }
                },
                error:  function(response) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    $('#result_line').html("Ошибка обращения в базу данных. Перегрузите страницу.");
                    btn_remove.style.display = "block";
                }
            });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            $('#result_line').html("Внесите номер почтового отправления.");
        }
    });

    let numberOut = document.getElementById("number_outcome");
    numberOut.oninput = function(){
        let number_outcome = $('#number_outcome').val();
        if(number_outcome.length>0){
            let firstLetter = number_outcome.substring(0, 1);
            if(validNumber.test(firstLetter)){
                document.getElementById("container_tr").style.display = "none";
                document.getElementById("thermometer_tr").style.display = "table-row";
                document.getElementById("amount_tr").style.display = "table-row";
            } else {
                document.getElementById("container_tr").style.display = "table-row";
                document.getElementById("thermometer_tr").style.display = "none";
                document.getElementById("amount_tr").style.display = "none";
            }
        } else {
            document.getElementById("container_tr").style.display = "none";
            document.getElementById("thermometer_tr").style.display = "table-row";
            document.getElementById("amount_tr").style.display = "table-row";
            $('#costs_part').val("0");
            $('#payment').val("0");
            $('#amount').val("1");
        }
    };

    $('#btn_prt').on('click', function(){
        $.ajax({
            url: '../user/check-container/print-code',
            method: 'POST',
            dataType: 'text',
            data: {startNumber: $('#parcel_number').val()},
            success: function(message) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                $('#result_line').html(message);
            },
            error:  function(response) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                $('#result_line').html("Ошибка создания штрих-кода. Перегрузите страницу.");
            }
        });
    });

});
