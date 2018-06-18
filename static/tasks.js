$(document).ready(function () {
    $("#tasklist").append("<ul></ul>");

    $.getJSON("http://127.0.0.1:5000/api/v1.0/tasks", function(data){
        var tasks = data["tasks"] ;
        var len = tasks.length ;
        for(var i = 0 ; i<len ; i++) {
            var t = tasks[i] ;


            $("#tasklist ul").append("<li>" + t.description + " " + t.urgent + " " +
                "<input type='button' value='Delete' name='delete' id='' onCLick=deleteTask(this) > " +
                "<input type='button' value='Update' name='update' id='' onCLick=updateTask(this) >" + "</li>")

            var x = document.getElementsByName("delete")[i]
            var y = document.getElementsByName("update")[i]

            x.setAttribute("id", t.id)
            y.setAttribute("id", t.id)
        }
    }) ;

    $("#addForm").submit( function(){
        if(document.getElementById("addTask").value =="Add") {
            var nome = $("#taskDescription").val()

            var urgency = $("#taskUrgent").is(":checked")


            task = {"description": nome, "urgent": urgency};


            json = JSON.stringify(task);


            $.post({
                "url": 'http://127.0.0.1:5000/api/v1.0/newTask',
                "data": json,
                "contentType": "application/json",
                "success": function () {
                    reloadTasks(task)
                }
            });

            return false;
        }
        else{
            var id=document.getElementById("info").value


          var nome=$("#taskDescription").val()

          var urgency =$("#taskUrgent").is(":checked")
          task = { "id": id, "description": nome, "urgent": urgency};


         json =  JSON.stringify(task) ;



  $.post({
            "url":'http://127.0.0.1:5000/api/v1.0/updateTask',
            "data": json,
            "contentType": "application/json",
            "success": function(){reloadTasks()}
        })
            document.getElementById("addTask").setAttribute("value","Add")
             document.getElementById("info").value=""


            return false;

        }

    }) ;
});

function reloadTasks()
{
    $("#tasklist").empty()



    $("#tasklist").append("<ul></ul>");
     $.getJSON("http://127.0.0.1:5000/api/v1.0/tasks", function(data){
        var tasks = data["tasks"] ;
        var len = tasks.length ;

        for(var i = 0 ; i<len ; i++) {
            var t = tasks[i] ;

             $("#tasklist ul").append("<li>"+t.description+" "+t.urgent+" "+
             "<input type='button' value='Delete' name='delete' id='' onCLick=deleteTask(this) > " +
                 "<input type='button' value='Update' name='update' id='' onCLick=updateTask(this) >"+"</li>")

            var x=document.getElementsByName("delete")[i]
            var y=document.getElementsByName("update")[i]

            x.id=t.id
            y.id=t.id

        }


    }) ;
}

function deleteTask(t){
var id=t.getAttribute("id")
    url='http://127.0.0.1:5000/api/v1.0/deleteTask'
$.post({
            "url":url,
            "data": id,
            "contentType": "application/json",
            "success": function(){reloadTasks()}
        }) ;

}

function updateTask(t){
    url="http://127.0.0.1:5000/api/v1.0/getTask/"+t.getAttribute("id")
    document.getElementById("addTask").setAttribute("value","Update")



     $.getJSON(url, function(data) {


         desc=data['task'].description
         document.getElementById("taskDescription").value=desc
         document.getElementById("info").value=t.getAttribute("id")

         urg=data['task'].urgent

         if(parseInt(urg)==1)
             document.getElementById("taskUrgent").checked=true
         else
             document.getElementById("taskUrgent").checked=false

     })



}