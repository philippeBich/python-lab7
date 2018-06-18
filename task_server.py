#!/usr/bin/env python

"""
Created on Apr 13, 2015
Last updated on Apr 30, 2018
@author: Luigi De Russis, Teodoro Montanaro, Alberto Monge Roffarello
"""

from flask import Flask, jsonify, abort, request, Response, render_template
from flask_bootstrap import Bootstrap



import db_interaction

app = Flask(__name__)
Bootstrap(app)

# ---------- FRONT-END Single-page application ------------

@app.route('/')
def tasks():
    return render_template("tasks.html")

# ---------- REST SERVER ----------
@app.route('/api/v1.0/tasks', methods=['GET'])
def get_tasks():

    # init
    tasks = []

    # get the task list from the db
    task_list = db_interaction.get_tasks()

    # prepare the task list for jsonify
    for item in task_list:
        task = prepare_for_json(item)
        tasks.append(task)

    # return the task data
    return jsonify({'tasks': tasks})

@app.route('/api/v1.0/getTask/<int:task_id>', methods=['GET'])
def get_task(task_id):
    # get the task
    task = db_interaction.get_task(int(task_id))

    # return 404 not found if no task has the given id
    if task is None:
        abort(404)

    # convert the task in a JSON representation
    return jsonify({'task': prepare_for_json(task)})


@app.route('/api/v1.0/newTask', methods=['POST'])
def insert_task():
    # get the request body
    add_request = request.json

    # check whether a task is present in the request or not
    if (add_request is not None) and ('description' in add_request) and ('urgent' in add_request):
        text = add_request['description']
        urgent = add_request['urgent']

        # insert in the database
        db_interaction.insert_task(text, urgent)

        return Response(status=201)

    # return an error in case of problems
    abort(403)

@app.route('/api/v1.0/updateTask', methods=['POST'])
def update_task():


    # get the request body
    add_request = request.json


    # check whether a task is present in the request or not
    if add_request is not None and ('description' and 'urgent') in add_request:

        text = add_request['description']
        urgent = add_request['urgent']
        id = add_request['id']
        # update the task
        db_interaction.update_task(int(id),text,urgent)


        return Response(status=200)

    # return an error in case of problems
    abort(403)

@app.route('/api/v1.0/deleteTask', methods=['POST'])
def delete_task():
    id=request.json

    # delete the task
    task = db_interaction.remove_task_by_id(int(id))

    return Response(status=200)

def prepare_for_json(item):
    """
    Convert the task in a dictionary for easing the JSON creation
    """
    task = dict()
    task['id'] = item[0]
    task['description'] = item[1]
    task['urgent'] = item[2]
    return task


if __name__ == '__main__':
    app.run(debug=True)
