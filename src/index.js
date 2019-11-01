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
      <NavBar brand="Pixel Vault">
        <NavBar.Link to="/browse">Browse</NavBar.Link>
          <NavBar.Link to="/submit">Submit</NavBar.Link>
      </NavBar>
    );
  }
}

class Home extends Component {
  render() {
    return (
      <Card title="Welcome to The Pixel Vault!">The home of only the best browsable wallpapers</Card>
    );
  }
}

class Browse extends Component{

    articles = [];

    mounted() {
        axios.get(`http://localhost:4000/articles`)
            .then(response => {
                const articlesFromDatabase = response.data;
                console.log("data: " + response.data)
                this.articles = articlesFromDatabase;
            })
    }

    render() {
        return (
            this.articles.map(article => <a href={"/article/" + article.articleID}><Card title={""}><img src={article.image} alt="Logo" /></Card></a>)
        )
    }
}

class Submit extends Component{
    image = '';

    render() {
        return (
            <Card title="Submit a new image">
                <form>
                    <Row>
                        <Column width={2}>imageURL</Column>
                        <Column>
                            <input
                                type="text"
                                value={this.image}
                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.image = event.target.value)}
                            />
                        </Column>
                    </Row>
                    <Button.Danger onClick={this.save}>Save</Button.Danger>
                </form>
            </Card>
        );
    }

    save() {

        console.log(this.image);

        let data = {
            "headline": " ",
            "content": " ",
            "image": this.image,
            "importance": 1,
        };

        if (this.image === ""){
            Alert.danger('You must provide an image URL');
            return;
        }

        axios.post(`http://localhost:4000/articles`, data).then(response => {
            console.log(response);
            console.log(response.data);

        });

        Alert.info('Image added')

        // Go to Browse after successful save
        history.push('/browse');
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
          <Route path="/browse" component={Browse}/>
          <Route exact path="/submit" component={Submit}/>
      </div>
    </HashRouter>,
    root
  );
