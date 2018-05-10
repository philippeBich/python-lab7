var RESTAPI = "http://127.0.0.1:5000/api/v1.0";

function load_task_list(father_div) {
    var ul = father_div.find("ul");
    if(ul)
        ul.remove()

    father_div.html("<ul class='list-group'></ul>");
    ul = father_div.find("ul");

    $.getJSON(RESTAPI + "/tasks", function (data) {
        var tasks = data["tasks"]; // the dictionary from JSON
        for (var index in tasks) {
            if (tasks[index].urgent == 1)
                ul.append($("<li class='list-group-item list-group-item-danger'>" + tasks[index].description + " <a class='update btn btn-default' onclick='update_task(" + tasks[index].id + "," + tasks[index].description + ",'1')'><span class='glyphicon glyphicon glyphicon-refresh'></span>Update</a> <a class='delete btn btn-default' onclick='delete_task(" + tasks[index].id + ")'><span class='glyphicon glyphicon glyphicon-remove'></span>Delete</a></li>"));
            else
                ul.append($("<li class='list-group-item list-group-item-info' >" + tasks[index].description + " <a class='update btn btn-default' onclick='update_task("+ tasks[index].id +")'><span class='glyphicon glyphicon glyphicon-refresh'></span>Update</a> <a class='delete btn btn-default' onclick='delete_task(" + tasks[index].id + ")'><span class='glyphicon glyphicon glyphicon-remove'></span>Delete</a></li>"));

        }
    });
}

function add_task(){
    var description = $("#taskdescription").val() ;
    var urgent = $("#taskurgent").is(":checked") ;
    var task = { "description": description, "urgent": urgent ? 1 : 0 } ;
    var json =  JSON.stringify(task) ;

    $.post({
        "url": RESTAPI+'/tasks',
        "data": json,
        "contentType": "application/json",
        "success": function(){load_task_list($("#theList"))}
    }) ;
}

function delete_task(task_id){
    $.ajax("/api/v1.0/tasks/"+task_id,
        {
            method: 'DELETE',
            success: function (status) {
                // update the list of printed tasks: called when the DELETE is complete
                load_task_list($("#theList"));
            }
        }
    );
}

function update_task(task_id){

    $.getJSON(RESTAPI + "/tasks/" + task_id, function (data) {
        var task = data['task']
        $("#taskdescription").val(task.description);

        if (task.urgent == 1)
            $("#taskurgent").prop("checked",true);
        else
            $("#taskurgent").prop("checked",false);
        //modify the form
        $("#addForm").method = 'PUT';
        $("#addForm").unbind();
        $("#addButton").text("Update");

        $("#addForm").submit(function (event) {
            var description = $("#taskdescription").val() ;
            var urgent = $("#taskurgent").is(":checked") ;
            var task = { "description": description, "urgent": urgent ? 1 : 0 } ;
            var json =  JSON.stringify(task) ;

            $.ajax(RESTAPI+'/tasks/' + task_id,
                {
                    method: 'PUT',
                    contentType: "application/json",
                    data: json,
                    success: function(){
                        load_task_list($("#theList"));
                        //reset the form
                        $("#addButton").text("Add");
                        $("#taskurgent").prop("checked", false);
                        $("#taskdescription").val("");
                        $("#addForm").method = 'POST';
                        $("#addForm").unbind();
                        $("#addForm").submit(function (event) {
                            add_task()
                            return false ; // prevent FORM submission
                        });
                }
            }) ;

            return false ; // prevent FORM submission
        });
    });
}

$(document).ready(function () {

    load_task_list($("#theList"));

    $("#addForm").submit(function() {
        add_task()
        return false ; // prevent FORM submission
    }) ;



});