jQuery(function() {
    let columns = [];

    function createToggleButton(task, row) {
        const toggleBtn = $('<button/>').addClass('btn btn-sm btn-secondary').text('Toggle');
        toggleBtn.on('click', function() {
            // Implement toggle functionality
            $.ajax({
                url: `/api/tasks/${task.id}/toggle`,
                method: 'POST',
                success: function(response) {
                    const statusText = response.task.completed === true ? 'True' : 'False';
                    return row.find('td').eq(columns.indexOf('completed')).text(statusText);
                },
                error: function(error) {
                    console.error('Error toggling task:', error);
                }
            })
        });
        return toggleBtn;
    }

    function createDeleteButton(task, row) {
        const deleteBtn = $('<button/>').addClass('btn btn-sm btn-danger').text('Delete');
        deleteBtn.on('click', function() {
            // Implement delete functionality
            $.ajax({
                url: `/api/tasks/${task.id}`,
                method: 'DELETE',
                success: function() {
                    row.remove();
                },
                error: function(error) {
                    console.error('Error deleting task:', error);
                }
            })
        });

        return deleteBtn;
    }

    function createEditButton(task) {
        // Creating the edit button and attaching a click event to it
        const editBtn = $('<button/>').addClass('btn btn-sm btn-light').text('Edit');
        editBtn.on('click', function() {
            const taskDescription = $('tbody').find(`tr[data-id="${task.id}"] td`).eq(columns.indexOf('description')).text();
            $('#formModal').modal('show');
            $('#description').val(taskDescription);
            $('#completed').prop('checked', task.completed);
            
            $('<input>').attr({
                type: 'hidden',
                id: 'edit',
                name: 'edit',
                value: task.id
            }).appendTo('#task-form');
        });
        editBtn.blur();
        return editBtn;
    }

    function createRow(column, row, task) {
        // Assigning a data-id attribute to the row if it doesn't already have one
        if (!row.attr('data-id')) {
            row.attr('data-id', task.id);
        }

        if(column === 'toggle') {
            const toggleBtn = createToggleButton(task, row);
            return row.append($('<td/>').append(toggleBtn));
        }
        if(column === 'delete') {
            const deleteBtn = createDeleteButton(task, row);
            return row.append($('<td/>').append(deleteBtn));
        }

        if(column === 'edit') {
            const editBtn = createEditButton(task);
            return row.append($('<td/>').append(editBtn));
        }
        
        if(column === 'completed') {
            const statusText = task[column] ? 'True' : 'False';
            return row.append($('<td/>').text(statusText));
        }
        
        return row.append($('<td/>').text(task[column]))
    }

    function fetchTasks(filter = 'all') {
        $.ajax({
            url: '/api/tasks?filter=' + filter,
            method: 'GET',
            success: function(data) {
                const mainContainer = $('.main-container').addClass('container my-4');
                const table = $('<table/>').addClass('task table table-bordered table-striped');
                const thead = $('<thead/>');
                const tbody = $('<tbody/>');
    
                Object.keys(data).forEach(function(key) {
                    const task = data[key];
                        if (columns.length === 0) {
                            columns = Object.keys(task);          // lock in column order
                            columns[columns.length] = 'toggle';
                            columns[columns.length] = 'delete';
                            columns[columns.length] = 'edit';
                            const headRow = $('<tr/>');
                            columns.forEach(column => headRow.append($('<th/>').text(column)));
                            thead.append(headRow);
                        }
            
                        const row = $('<tr/>');
                        columns.forEach(column => {
                            const task_item = createRow(column, row, task);

                            return task_item;
                        });
                    tbody.append(row);
                });
            
                table.append(thead).append(tbody);
                mainContainer.append(table);
                
            },
            error: function(error) {
                console.error('Error fetching tasks:', error);
            }
        })
    }

    fetchTasks();
    
    //summoning new task form modal
    $('#formModal').on('shown.bs.modal', function () {
        $('#myInput').trigger('focus')

    })

    $('#task-form').on('submit', function(event) {
        event.preventDefault();
        const btn = $(this).find('button[type="submit"]');
        btn.blur();
        
        const formData = {
            description: event.target.description.value,
            completed: event.target.completed.checked
        }
        const method = event?.target?.edit?.value > 0 ? 'PUT' : 'POST';
        const url = method === 'PUT' ? `/api/tasks/${event.target.edit.value}` : '/api/tasks';
        $('#task-form').find('#description').val('');
        $.ajax({
            url,
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: JSON.stringify(formData),
            success: function(response) {
                const newRow = $('<tr/>');
                const task_id = response?.task.id;
                const existingRow = $(`.task tbody tr[data-id="${task_id}"]`);
                if (existingRow.length > 0) {
                    // Update the existing row
                    columns.forEach(function(c) {
                        if (c === 'toggle') {
                            const toggleBtn = createToggleButton(response.task, existingRow);
                            existingRow.find('td').eq(columns.indexOf(c)).html(toggleBtn);
                            return;
                        }
                        else if (c === 'delete') {
                            const deleteBtn = createDeleteButton(response.task, existingRow);
                            existingRow.find('td').eq(columns.indexOf(c)).html(deleteBtn);
                            return;
                        }
                        else {
                            existingRow.find('td').eq(columns.indexOf(c)).text(response.task[c], existingRow);
                            return;
                        }
                        
                    });
                } else {
                    columns.forEach(function(c) {
                        // Create a new row for the newly created task
                        createRow(c, newRow, response.task);
                    });
                    $('.task tbody').append(newRow);
                }

                $('.task tbody').append(newRow);
                // Reset the form and hide the modal
                $('#task-form').find('input[type="hidden"]').remove();
                $('#formModal').modal('hide');
            },
            error: function(error) {
                console.error('Error creating task:', error);
            }

        })
    })

    $('#filter-select').on('change', function() {
        const selectedFilter = $(this).val();
        //clearing the main container before fetching new tasks based on the selected filter
        $('.main-container').empty();
        fetchTasks(selectedFilter);
    })

    $('#close').on('click', closeModal)

    $('#submit_close').on('click', closeModal)

    function closeModal() {
        $('#task-form').find('#description').val('');
        $('#formModal').modal('hide');
    }

    $('#addNewBtn').on('click', function() {
        $('#task-form').find('#description').val('');
    })
})
