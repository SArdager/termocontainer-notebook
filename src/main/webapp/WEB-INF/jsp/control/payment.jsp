<%@page import="kz.kdlolymp.termocontainers.entity.User"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Pay control page</title>
    <script type="text/javascript" src="../resources/js/jquery-3.6.0.min.js"></script>
    <script>
        let w = Number(window.innerWidth);
        let h = Number(window.innerHeight);
        if (h>w) {
          $('head').append('<link rel="stylesheet" type="text/css" href="../resources/css/mobileStyle.css">');
        } else {
          $('head').append('<link rel="stylesheet" type="text/css" href="../resources/css/style.css">');
        }
    </script>
    <script type="text/javascript" src="../resources/js/showNote.js"></script>
    <script type="text/javascript" src="../resources/js/selectDepartment.js"></script>
</head>

<body>
  <section>
     <div class="container">
        <div class="user_title">
           <span id="user_name"></span>
            <a href="../logout">Выйти</a>
        </div>
        <hr>
        <h1>Отчет по расходу денежных средств по объекту</h1>
        <br>
        <a href="start-page">Вернуться</a>
        <br>
        <h2><div id="result_line"></div></h2>
        <p>
            <div class="title_row">
                <div class="title_name">Наименование объекта:</div>
                <div class="color_text"> ${department.departmentName},  ${department.branch.branchName}</div>
            </div>
            <div class="title_row">
                <div class="title_name">Права пользователя</div>
                <div class="color_text">${userRights.rights}</div>
                <input type="hidden" id="department_id" value="${department.id}" />
                <input type="hidden" id="branch_id" value="${department.branch.id}" />
            </div>
        </p>
        <form id="export_payment" action="" method="post">
            <div class="title_row">
                <span class="date_line">Вывести за период:</span>
                <input type="date" id="startDate" name="startDate"/>
                <input type="date" id="endDate" name="endDate"/>
                <span class="text_line">по</span>
                <input type="number" id="pageSize" min="5" step="10" value="30"/>
                <span class="text_line">строк</span>
                <input type="hidden" id="totalPayments" value="0"/>
                <input type="hidden" id="totalParcels" value="0"/>
                <input type="hidden" id="exportDepartmentId" value="${department.id}" name="departmentId"/>
                <input type="hidden" id="exportBranchId" value="${department.branch.id}" name="branchId"/>
            </div>
        </form>
        <div class="title_row" >
            <span class="date_line">Вывести по объекту:</span>
            <div class="checkbox_margin" id="chose_checkbox" style="display: none">
                <input type="checkbox" id="department_checkbox" style="margin: 0px; padding: 0px"/>
                <span class="text_line">- все объекты</span>
            </div>
            <select id="select_branch" class="select_in_line" style="display: none">
                <c:forEach var="branch" items="${branches}">
                    <option value=${branch.id}>${branch.branchName}</option>
                </c:forEach>
            </select>
            <select id="select_department" class="select_in_line">
            </select>
            <div class="checkbox_margin" >
                <input type="checkbox" id="branch_checkbox" />
                <span class="text_line">- по филиалу</span>
            </div>
        </div>
        <div id="show_payment" style="margin-left: 40px;"><b><u>Оплата за транспортировку термоконтейнеров</u></b></div>
        <div id="payment_field" style="display: none">
            <div class="title_row">
               <div class="title_left">
                   <span id="reload_payment" class ="reload_line">Показать</span>
                   <img src="../resources/images/export_excel_48.png" id="btn_export_payment" alt="">
               </div>
               <div id="payment_pages_title" ></div>
            </div>
            <div id="payment_table" class = "scroll_table">
               <table>
                 <thead>
                   <tr>
                     <th>Номер</th>
                     <th>Дата отправки</th>
                     <th>Отправитель</th>
                     <th>Получатель</th>
                     <th>Стоимость</th>
                     <th>Количество</th>
                     <th>Запись отправителя</th>
                   </tr>
                 </thead>
                 <tbody id = "payment_table_body">
                 </tbody>
               </table>
            </div>
        </div>
        <br>
        <div id="show_parcels" style="margin-left: 40px;"><b><u>Оплата за транспортировку посылок</u></b></div>
        <div id="parcels_field" style="display: none">
            <div class="title_row">
               <div class="title_left">
                   <span id="reload_parcels" class ="reload_line">Показать</span>
                   <img src="../resources/images/export_excel_48.png" id="btn_export_parcels" align = "top" alt="">
               </div>
               <div id="parcels_pages_title"></div>
            </div>
            <div id="parcels_payment_table" class = "scroll_table">
               <table>
                 <thead>
                   <tr>
                     <th>Номер</th>
                     <th>Дата отправки</th>
                     <th>Вид отправления</th>
                     <th>Отправил</th>
                     <th>Получатель</th>
                     <th>Вложено в</th>
                     <th>Стоимость доставки</th>
                     <th>Запись отправителя</th>
                   </tr>
                 </thead>
                 <tbody id = "parcels_table_body">
                 </tbody>
               </table>
            </div>
            <br>
            <div id="parcel_info_field" style="display: none">
                <table>
                    <tr>
                        <td class="table_title">Номер посылки</td>
                        <td id="parcel_number"></td>
                    </tr>
                    <tr>
                        <td class="table_title" >Отправитель</td>
                        <td id="sender"></td>
                    </tr>
                    <tr>
                        <td class="table_title" >Получатель</td>
                        <td id="destination"></td>
                    </tr>
                    <tr>
                        <td class="table_title" >Содержимое</td>
                        <td id="parcel_type"></td>
                    </tr>
                    <tr>
                        <td class="table_title" >Габариты</td>
                        <td id="dimensions"></td>
                    </tr>
                    <tr>
                        <td class="table_title" >Отправлено</td>
                        <td id="send_date"></td>
                    </tr>
                    <tr>
                        <td class="table_title" >Статус</td>
                        <td id="status"></td>
                    </tr>
                </table>
                <table id="points_payment_table" class="table_shot">
                    <caption><strong>Информация по маршруту почтового отправления</strong></caption>
                    <thead>
                        <th>Филиал</th>
                        <th>Дата прибытия</th>
                        <th>Получил</th>
                        <th>Дата отправки</th>
                        <th>Отправил</th>
                        <th>Вложено в</th>
                        <th>Стоимость</th>
                        <th>Примечание</th>
                    </thead>
                    <tbody class="table_body" id="points_table_body">
                    </tbody>
                </table>
            </div>
        </div>
     </div>
    <div class="buffer" style = "height: 5em;"></div>
  </section>

    <script>
        $(document).ready(function(){
            $("h1").css("color", "blue");
            $("h2").css("color", "red");
            let name = "${user.userFirstname}";
            document.getElementById("user_name").textContent = name.substring(0, 1) + ". ${user.userSurname}";
            if(${department.id}==1){
                document.getElementById("chose_checkbox").style.display = "block";
                document.getElementById("select_branch").style.display = "block";
            } else {
                $('#select_branch').val(${department.branch.id});
            }
            let payment_field = document.getElementById("payment_field");
            $('#show_payment').on('click', function(){
                if(payment_field.style.display == 'block'){
                    payment_field.style.display = 'none';
                    $('#show_payment').html("<b><u>Оплата за транспортировку термоконтейнеров</u></b>");
                    $('#show_payment').css("align", "left");
                } else {
                    payment_field.style.display = 'block';
                    $('#show_payment').html("<b><u>Скрыть поле оплаты за транспортировку термоконтейнеров</u></b>");
                    $('#show_payment').css("align", "right");
                }
            });
            let parcels_field = document.getElementById("parcels_field");
            $('#show_parcels').on('click', function(){
                if(parcels_field.style.display == 'block'){
                    parcels_field.style.display = 'none';
                    $('#show_parcels').html("<b><u>Оплата за транспортировку посылок</u></b>");
                } else {
                    parcels_field.style.display = 'block';
                    $('#show_parcels').html("<b><u>Скрыть поле оплаты за транспортировку посылок</u></b>");
                }
            });
            $('#select_branch').trigger("change");
            $('#department_checkbox').on('click', function(){
                if($('#department_checkbox').is(':checked')){
                    $('#branch_checkbox').prop('checked', false);
                }
            });
            let resultLineValue;
            let clickNumber = 0;
            window.addEventListener("click", function(){
                clickNumber++;
                resultLineValue = $('#result_line').text();
                if(clickNumber==0){
                    $('#result_line').text("");
                }
                if(resultLineValue.length>0){
                    clickNumber = -1;
                }
            });
       });
    </script>

</body>
</html>
