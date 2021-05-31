import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from "uuid";

class App extends React.Component {
  state = {
    tasks: [],
    taskName: '',
  }

  componentDidMount() {
    this.socket = io();
    this.socket.connect("localhost:3000");

    this.socket.on('addTask', (task) => this.addTask(task));
    this.socket.on('removeTask', (task) => this.removeTask(task));
    this.socket.on('updateData', (tasks) => this.updateTasks(tasks));
  }

  removeTask(taskId, local) {
    this.setState({tasks: this.state.tasks.filter(task => taskId.id !== task.id)});

    return local === true && this.socket.emit('removeTask', taskId);
  }

  submitForm(e) {
    e.preventDefault();

    const task = {taskName: this.state.taskName, id: uuidv4()};

    this.addTask(task);
    this.socket.emit('addTask', task);
    this.setState({ taskName: '' });
  }

  addTask(task) {
    this.setState({ tasks: [...this.state.tasks, task] });
  }

  updateTasks(tasks) {
    this.setState({ tasks })
  }
  render() {
    const { tasks, taskName } = this.state;
    return (
      <div className="App">

        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map(task => (
              <li className="task" key={task.id}>{task.taskName}<button onClick={() => this.removeTask(task, true)} className="btn btn--red">Remove</button></li>
            ))}
          </ul>

          <form id="add-task-form" onSubmit={(e) => this.submitForm(e)}>
            <input className="text-input" autoComplete="off" type="text" placeholder="Type your description" id="task-name" onChange={(e) => this.setState({ taskName: e.target.value })} value={taskName} />
            <button className="btn" type="submit">Add</button>
          </form>

        </section>
      </div>
    );
  }
}

export default App;
