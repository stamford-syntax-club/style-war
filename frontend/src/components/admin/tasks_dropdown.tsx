import React from "react";

import { Select } from '@mantine/core';

const TasksDropdown = () => {
    return (
        <Select
            pt={3}
            placeholder="Select a tasks"
            data={[
                { value: 'task1', label: 'Task 1' },
                { value: 'task2', label: 'Task 2' },
                { value: 'task3', label: 'Task 3' },
            ]}

        />
    );
};

export default TasksDropdown;