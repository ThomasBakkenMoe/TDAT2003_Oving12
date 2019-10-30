// @flow
/* eslint eqeqeq: "off" */

import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route, NavLink } from 'react-router-dom';
import { Alert, Card, NavBar, Button, Row, Column } from './widgets';
import axios from 'axios';

import { createHashHistory } from 'history';
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

class Student {
  id: number;
  static nextId = 1;

  firstName: string;
  lastName: string;
  email: string;

  constructor(firstName: string, lastName: string, email: string) {
    this.id = Student.nextId++;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }
}

class Course {
    code : string;
    title : string;

    students : Student[];

    constructor(code: string, title: string, students : Student[]){
        this.code = code;
        this.title = title;
        this.students = students;
    }
}
let students = [
  new Student('Ola', 'Jensen', 'ola.jensen@ntnu.no'),
  new Student('Kari', 'Larsen', 'kari.larsen@ntnu.no')
];
let courses = [

    new Course('TDAT3019', 'Systemutvikling 3', [students[0]]),
    new Course('TDAT3020', 'Sikkerhet i programvare og nettverk', [students[1]]),
    new Course('TDAT3022', 'Systemutviklingsprosjekt', [students[0], students[1]]),
    new Course('TDAT3023', '3D-grafikk med prosjekt', [students[1]]),
    new Course('TDAT3024', 'Matematikk og fysikk valgfag', [students[0]]),
    new Course('TDAT3025', 'Anvendt maskinlæring med prosjekt', [students[1], students[0]])
];

class Menu extends Component {
  render() {
    return (
      <NavBar brand="React example">
        <NavBar.Link to="/students">Students</NavBar.Link>
          <NavBar.Link to="/courses">Courses</NavBar.Link>
      </NavBar>
    );
  }
}

class Home extends Component {
  render() {
    return (
      <Card title="React example with component state">Client-server communication will be covered next week.</Card>
    );
  }
}

class StudentList extends Component {
  render() {
    return (
      <Card title="Students">
        {students.map(student => (
          <Row key={student.id}>
            <Column width={2}>
              <NavLink activeStyle={{ color: 'darkblue' }} exact to={'/students/' + student.id}>
                {student.firstName} {student.lastName}
              </NavLink>
            </Column>
            <Column>
              <NavLink activeStyle={{ color: 'darkblue' }} to={'/students/' + student.id + '/edit'}>
                edit
              </NavLink>
            </Column>
          </Row>
        ))}
        <Button.Primary onClick={
            () => {
                history.push("/students/1/add");
            }
        }>Add student</Button.Primary>
      </Card>
    );
  }
}

class StudentDetails extends Component<{ match: { params: { id: number } } }> {
  render() {
    let student = students.find(student => student.id == this.props.match.params.id);
    if (!student) {
      Alert.danger('Student not found: ' + this.props.match.params.id);
      return null; // Return empty object (nothing to render)
    }
    return (
      <Card title="Details">
        <Row>
          <Column width={2}>First name</Column>
          <Column>{student.firstName}</Column>
        </Row>
        <Row>
          <Column width={2}>Last name</Column>
          <Column>{student.lastName}</Column>
        </Row>
        <Row>
          <Column width={2}>Email</Column>
          <Column>{student.email}</Column>
        </Row>
      </Card>
    );
  }
}

class StudentEdit extends Component<{ match: { params: { id: number } } }> {
  firstName = ''; // Always initialize component member variables
  lastName = '';
  email = '';

  render() {
    return (
      <Card title="Edit">
        <form>
          <Row>
            <Column width={2}>First name</Column>
            <Column>
              <input
                type="text"
                value={this.firstName}
                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.firstName = event.target.value)}
              />
            </Column>
          </Row>
          <Row>
            <Column width={2}>Last name</Column>
            <Column>
              <input
                type="text"
                value={this.lastName}
                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.lastName = event.target.value)}
              />
            </Column>
          </Row>
          <Row>
            <Column width={2}>Email</Column>
            <Column>
              <input
                type="text"
                value={this.email}
                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.email = event.target.value)}
              />
            </Column>
          </Row>
          <Button.Danger onClick={this.save}>Save</Button.Danger>
        </form>
      </Card>
    );
  }

  // Initialize component state (firstName, lastName, email) when the component has been inserted into the DOM (mounted)
  mounted() {
    let student = students.find(student => student.id == this.props.match.params.id);
    if (!student) {
      Alert.danger('Student not found: ' + this.props.match.params.id);
      return;
    }

    this.firstName = student.firstName;
    this.lastName = student.lastName;
    this.email = student.email;
  }

  save() {
    let student = students.find(student => student.id == this.props.match.params.id);
    if (!student) {
      Alert.danger('Student not found: ' + this.props.match.params.id);
      return;
    }

    student.firstName = this.firstName;
    student.lastName = this.lastName;
    student.email = this.email;

    // Go to StudentDetails after successful save
    history.push('/students/' + student.id);
  }
}

class StudentAdd extends Component<{ match: { params: { code: string } } }> {
    firstName = ''; // Always initialize component member variables
    lastName = '';
    email = '';

    render() {
        return (
            <Card title="Add student">
                <form>
                    <Row>
                        <Column width={2}>First name</Column>
                        <Column>
                            <input
                                type="text"
                                value={this.firstName}
                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.firstName = event.target.value)}
                            />
                        </Column>
                    </Row>
                    <Row>
                        <Column width={2}>Last name</Column>
                        <Column>
                            <input
                                type="text"
                                value={this.lastName}
                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.lastName = event.target.value)}
                            />
                        </Column>
                    </Row>
                    <Row>
                        <Column width={2}>Email</Column>
                        <Column>
                            <input
                                type="text"
                                value={this.email}
                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.email = event.target.value)}
                            />
                        </Column>
                    </Row>
                    <Button.Danger onClick={this.save}>Save</Button.Danger>
                </form>
            </Card>
        );
    }

    save() {
        if (this.firstName === '' || this.lastName === '' || this.email === ''){
            Alert.danger('Student must have a valid first name, last name and email: ');
            return;
        }

        let newStudent = new Student(this.firstName, this.lastName, this.email);

        students.push(newStudent);

        Alert.info('Student added')

        // Go to StudentDetails after successful save
        history.push('/students/' + newStudent.id);
    }
}

class CourseList extends Component{
    render() {
        return (
            <Card title="Courses">
                {courses.map(course => (
                    <Row key={course.code}>
                        <Column width={2}>
                            <NavLink activeStyle={{ color: 'darkblue' }} to={'/courses/' + course.code}>
                                {course.code} {course.title}
                            </NavLink>
                        </Column>
                        <Column>
                            <NavLink activeStyle={{ color: 'darkblue' }} to={'/courses/' + course.code + '/edit'}>
                                edit
                            </NavLink>
                        </Column>
                    </Row>
                ))}
                <Button.Primary onClick={
                    () => {
                        history.push('/courses/1/add');
                    }
                }>Add course</Button.Primary>
            </Card>
        );
    }
}

class CourseDetails extends Component<{ match: { params: { code: string } } }> {
    render() {
        let course = courses.find(course => course.code === this.props.match.params.code);
        if (!course) {
            Alert.danger('Course not found: ' + this.props.match.params.code);
            return null; // Return empty object (nothing to render)
        }
        return (
            <Card title="Course details">
                <Row>
                    <Column width={2}>Course code:</Column>
                    <Column>{course.code}</Column>
                </Row>
                <Row>
                    <Column width={2}>Course title:</Column>
                    <Column>{course.title}</Column>
                </Row>
                <Row>
                    <ul>
                        <li>Påmeldte studenter:
                            <ul>
                                {course.students.map(student => (
                                    <li key={student.id}>
                                        <NavLink activeStyle={{ color: 'darkblue' }} to={'/students/' + student.id}>
                                            {student.firstName} {student.lastName}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    </ul>
                </Row>
            </Card>
        );
    }
}

class CourseEdit extends Component<{ match: { params: { code: string } } }> {
    code = ''; // Always initialize component member variables
    title = '';

    render() {
        return (
            <Card title="Edit">
                <form>
                    <Row>
                        <Column width={2}>Code</Column>
                        <Column>
                            <input
                                type="text"
                                value={this.code}
                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.code = event.target.value)}
                            />
                        </Column>
                    </Row>
                    <Row>
                        <Column width={2}>Title</Column>
                        <Column>
                            <input
                                type="text"
                                value={this.title}
                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.title = event.target.value)}
                            />
                        </Column>
                    </Row>
                    <Button.Danger onClick={this.save}>Save</Button.Danger>
                </form>
            </Card>
        );
    }

    // Initialize component state (firstName, lastName, email) when the component has been inserted into the DOM (mounted)
    mounted() {
        let course = courses.find(course => course.code == this.props.match.params.code);
        if (!course) {
            Alert.danger('Course not found: ' + this.props.match.params.code);
            return;
        }

        this.code = course.code;
        this.title = course.title;
    }

    save() {
        let course = courses.find(course => course.code == this.props.match.params.code);
        if (!course) {
            Alert.danger('Course not found: ' + this.props.match.params.code);
            return;
        }

        course.code = this.code;
        course.title = this.title;

        // Go to CourseDetails after successful save

        Alert.info('Course added');
        history.push('/courses/' + course.code);
    }
}

class CourseAdd extends Component<{ match: { params: { code: string } } }> {
    code = ''; // Always initialize component member variables
    title = '';

    render() {
        return (
            <Card title="Add course">
                <form>
                    <Row>
                        <Column width={2}>Code</Column>
                        <Column>
                            <input
                                type="text"
                                value={this.code}
                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.code = event.target.value)}
                            />
                        </Column>
                    </Row>
                    <Row>
                        <Column width={2}>Title</Column>
                        <Column>
                            <input
                                type="text"
                                value={this.title}
                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.title = event.target.value)}
                            />
                        </Column>
                    </Row>
                    <Button.Danger onClick={this.save}>Save</Button.Danger>
                </form>
            </Card>
        );
    }

    save() {
        if (this.code === '' || this.title === ''){
            Alert.danger('Course must have a valid code and title: ');
            return;
        }

        let course = courses.push(new Course(this.code, this.title, []));

        // Go to CourseDetails after successful save
        history.push('/courses/' + this.code);
    }
}
class PersonList extends Component {
    state = {
        persons: []
    }

    componentDidMount() {
        axios.get(`https://localhost:4000`)
            .then(res => {
                const persons = res.data;
                this.setState({ persons });
            })
    }

    render() {
        return (
            <ul>
                { this.state.persons.map(person => <li>{person.name}</li>)}
            </ul>
        )
    }
}


const root = document.getElementById('root');
if (root)
  ReactDOM.render(
    <HashRouter>
      <div>
        <Alert />
        <Menu />
        <Route exact path="/" component={Home} />
        <Route path="/students" component={StudentList} />
        <Route exact path="/students/:id" component={StudentDetails} />
        <Route exact path="/students/:id/edit" component={StudentEdit} />
          <Route exact path="/students/1/add" component={StudentAdd}/>
          <Route path="/courses" component={CourseList}/>
          <Route exact path="/courses/:code" component={CourseDetails}/>
          <Route exact path="/courses/:code/edit" component={CourseEdit} />
          <Route exact path="/courses/1/add" component={CourseAdd}/>

      </div>
    </HashRouter>,
    root
  );
