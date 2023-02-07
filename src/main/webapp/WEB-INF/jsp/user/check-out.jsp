<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Termocontainer check-out page</title>
  <script type="text/javascript" src="../resources/js/jquery-3.6.0.min.js"></script>
  <script type="text/javascript" src="../resources/js/selectDepartment.js"></script>
  <script type="text/javascript" src="../resources/js/worker.js"></script>
  <script>
      var w = Number(window.innerWidth);
      var h = Number(window.innerHeight);
      if (h>w) {
        $('head').append('<link rel="stylesheet" type="text/css" href="../resources/css/mobileStyle.css">');
        $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
      } else {
        $('head').append('<link rel="stylesheet" type="text/css" href="../resources/css/style.css">');
      }
  </script>

</head>

<body>
  <section>
     <div class="container">
        <div class="user_title">
            <span id="user_name"></span>
            <a href="../logout">Выйти</a>
        </div>
        <hr>
        <h1>Отгрузка термоконтейнера</h1>
        <br>
        <a class="link_line" href="../work-starter">Вернуться</a>
        <a class="link_line" href="check-between">Регистрация на объекте</a>
        <a class="link_line" href="check-in">Приемка термоконтейнера</a>
        <a class="link_line" href="check-journal">Журнал движения термоконтейнеров</a>
        <br>
        <h2><div id="result_line"></div></h2>
        <p>
            <div class="title_row">
                <div class="title_name">Наименование объекта:</div>
                <div class="color_text"> ${department.departmentName},  ${department.branch.branchName}</div>
            </div>
            <div class="title_row">
                <div class="title_name">Права пользователя</div>
                <div id="userRights" class="color_text">${userRights.rights}</div>
            </div>
        </p>
        <hr>
        <h2><div id="check_line"></div></h2>
        <input type="hidden" id="departmentId" value="${department.id}" />
        <input type="hidden" id="depPrefId" value="${depPreferences.id}" />
        <div id="checking_view" style="display: none">
            <table>
                <tr id="all_company" style="display: none">
                    <td class="table_title"><a class="link_line" href="check-out">Скрыть места разовой отправки</a></td>
                    <td><select id="select_all_company">
                          <c:forEach var="company" items="${companies}">
                            <option value=${company.id}>${company.companyName}</option>
                          </c:forEach>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td class="table_title">Получатель</td>
                    <td><select id="select_out_branch">
                          <c:forEach var="branch" items="${branches}">
                            <option value=${branch.id}>${branch.branchName}</option>
                          </c:forEach>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td class="table_title"><a class="link_line" href="setup">Настроить</a>
                    <span id="other_branches">Показать все</span></td>
                    <td><select id="select_department">
                        </select><br>
                    </td>
                </tr>
                <tr>
                    <td class="table_title">Сканирование номера</td>
                    <td><input type="text" id="number_outcome" maxlength="8"/>
                    </td>
                </tr>
                <tr id="thermometer_tr" style="display: table-row">
                    <td class="table_title">Номер термохрона</td>
                    <td><input type="text" id="thermometer" maxlength="15"/>
                    </td>
                </tr>
                <tr>
                    <td class="table_title"></td>
                    <td id="clean_input" class="cut_line">Очистить поле ввода</td>
                </tr>
                <tr id="container_tr" style="display: none">
                    <td class="table_title">Вложить в термоконтейнер</td>
                    <td><input id="container_number" maxlength="8"/></td>
                </tr>
                <tr id="costs_part_tr" style="display: none">
                    <td class="table_title">Доля оплаты доставки</td>
                    <td><input type="number" id="costs_part" step="10" value="0" />%</td>
                </tr>
                <tr id="payment_tr" style="display: table-row">
                    <td class="table_title">Оплата отгрузки</td>
                    <td><input type="number" id="payment" style="width: 8em;" step="500" value="0" /></td>
                </tr>
                <tr id="amount_tr" style="display: table-row">
                    <td class="table_title">Количество в отгрузке</td>
                    <td><input type="number" id="amount" style="width: 8em;" value="1" /></td>
                </tr>
                <tr>
                    <td class="table_title">Запись по отгрузке</td>
                    <td><textarea id="textarea_out"></textarea></td>
                </tr>
                <tr>
                    <td class="table_title"></td>
                    <td><button id="btn_outcome" style="display: block">Зарегистрировать</button></td>
                </tr>
                <tr>
                    <td class="table_title"></td>
                    <td><button id="btn_add_parcel" style="display: block">Вложить</button></td>
                </tr>
                <tr>
                    <td class="table_title">Время отгрузки</td>
                    <td id="time_outcome"></td>
                </tr>
                <tr>
                    <td class="table_title">Статус отгрузки</td>
                    <td id="status_outcome"></td>
                </tr>
            </table>
            <div id="show_parcels" class="cut_line" style="color: blue;">Поле просмотра посылок</div>
            <div id="parcels_field" style="display: none">
                <div id="reload_output" class ="cut_line">Проверить посылки на отгрузку</div>
                <table class="table_shot">
                    <caption><strong>Наличие посылок на отгрузку</strong></caption>
                    <thead>
                        <th>Номер посылки</th>
                        <th>Пункт назначения</th>
                        <th>Вложена в термоконтейнер (посылку)</th>
                        <th>Содержание</th>
                        <th>Габариты</th>
                    </thead>
                    <tbody class="table_body" id="outcome_parcels_body">
                    </tbody>
                </table>
                <div id="get_parcel" class ="cut_line">Выложить посылку</div>
                <div id="get_parcel_table" style="display: none">
                    <table >
                        <tr>
                            <td class="table_title">Сканирование номера</td>
                            <td><input type="text" id="parcel_number" maxlength="8"/>
                            </td>
                        </tr>
                        <tr>
                            <td class="table_title"></td>
                            <td><button id="btn_remove" style="display: block">Выложить</button></td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
     </div>
  </section>

    <script>
        $(document).ready(function(){
            $("h1").css("color", "blue");
            $("h2").css("color", "red");
            let name = "${user.userFirstname}";
            document.getElementById("user_name").textContent = name.substring(0, 1) + ". ${user.userSurname}";
            let scan_field = document.getElementById("scan_field");
            $('#select_out_branch').val(${depPreferences.branch.id});
            $('#select_out_branch').trigger("change");
            document.getElementById("number_outcome").focus();
            let rights = $('#userRights').html();
            let checking_view = document.getElementById("checking_view");

            if(rights.indexOf("ВНЕСЕНИЕ")>-1){
                checking_view.style.display = "block";
            } else if(rights.indexOf("УЧЕТ")>-1){
                checking_view.style.display = "block";
            } else if(rights.indexOf("ЛАБОР")>-1){
                checking_view.style.display = "block";
            } else {
                $('#check_line').html("Права на регистрацию термоконтейнеров отсутствуют");
            }
            $('#number_outcome').focus();
            $('#clean_input').click(function(){
                $('#number_outcome').val("");
                $('#thermometer').val("");
                $('#number_outcome').focus();
                $('#costs_part').val("0");
                $('#payment').val("0");
                $('#amount').val("1");
                $('#time_outcome').html("");
                $('#status_outcome').html("");
                document.getElementById("btn_add_parcel").style.display = "none";
                document.getElementById("costs_part_tr").style.display = "none";
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
            let clickGetParcel = 1;
            $('#get_parcel').on("click", function(){
                clickGetParcel++;
                if(clickGetParcel%2==0){
                    document.getElementById('get_parcel_table').style.display = "block";
                } else {
                    document.getElementById('get_parcel_table').style.display = "none";
                }
            });
            let intoContainer = document.getElementById("container_number");
            intoContainer.oninput = function(){
                if($('#container_number').val().length>0){
                    document.getElementById("payment_tr").style.display = "none";
                    document.getElementById("btn_outcome").style.display = "none";
                    document.getElementById("btn_add_parcel").style.display = "block";
                    let firstChar = $('#container_number').val().substring(0, 1);
                    if(/^\d$/.test(firstChar)){
                        document.getElementById("costs_part_tr").style.display = "none";
                        $('#costs_part').val(0);
                    } else {
                        document.getElementById("costs_part_tr").style.display = "table-row";
                    }
                } else {
                    document.getElementById("payment_tr").style.display = "table-row";
                    document.getElementById("btn_outcome").style.display = "block";
                    document.getElementById("btn_add_parcel").style.display = "none";
                    document.getElementById("costs_part_tr").style.display = "none";
                    $('#costs_part').val(0);
                }
            };
       });
    </script>

    <div class="buffer" style = "height: 5em;"></div>
</body>
</html>
