import { DeleteOutlined, UserAddOutlined } from "@ant-design/icons";
import { Input, Button, Checkbox, List, Col, Row, Space, Divider } from "antd";
import produce from "immer";
import { useEffect, useState, useCallback } from "react";
import useBackend from "../../hooks/useBackend";
import { taskFromServer, taskToServer } from "../../models/Task";
import debounce from 'lodash.debounce';

export default function TaskList() {
    const { sendRequest } = useBackend();

    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        sendRequest("/tasks", "GET")
            .then((response) => {
                if (response.length)
                    setTasks(response.map(taskFromServer));
                else
                    setTasks([]);
            });
    }, []);

    const debouncedSaveTask = useCallback(debounce((task) => {
        sendRequest("/tasks/" + task.id, "PUT", taskToServer(task));
    }, 1000), [sendRequest]);

    const handleNameChange = (task, event) => {
        console.log(event)
        const newTasks = produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            draft[index].name = event.target.value;
        });
        setTasks(newTasks);

        let newTask = newTasks.find(newTask => newTask.id == task.id);

        debouncedSaveTask(newTask);
        //sendRequest("/tasks/"+task.id, "PUT", taskToServer(newTask));
    };

    const handleCompletedChange = (task, event) => {
        console.log(event)
        const newTasks = produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            draft[index].completed = event.target.checked;
        });
        setTasks(newTasks);
        let newTask = newTasks.find(newTask => newTask.id == task.id);
        debouncedSaveTask(newTask);
    };

    const handleAddTask = () => {
        setTasks(produce(tasks, draft => {
            draft.push({
                id: Math.random(),
                name: "",
                completed: false
            });
        }));
    };

    const handleDeleteTask = (task) => {
        setTasks(produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            draft.splice(index, 1);
        }));
    };

    return (
        <Row type="flex" justify="center" style={{ minHeight: '100vh', marginTop: '6rem' }}>
            <Col span={12}>
                <h1>Task List</h1>
                <Button onClick={handleAddTask}>Add Task</Button>
                <Divider />
                <List
                    size="small"
                    bordered
                    dataSource={tasks}
                    renderItem={(task) => <List.Item key={task.id}>
                        <Row type="flex" justify="space-between" align="middle" style={{ width: '100%' }}>
                            <Space>
                                <Checkbox checked={task.completed} onChange={(e) => handleCompletedChange(task, e)} />
                                <Input value={task.name} onChange={(event) => handleNameChange(task, event)} />
                            </Space>
                            <Button type="text" onClick={() => handleDeleteTask(task)}><DeleteOutlined /></Button>
                        </Row>
                    </List.Item>}
                />
            </Col>
        </Row>
    )
}