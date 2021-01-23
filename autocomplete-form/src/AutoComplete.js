import React from "react";
import "./App.css";
const DATABASE_URL = "https://jsonplaceholder.typicode.com/users";

export default class Autocomplete extends React.Component {
  state = {
    usernames: [],
    name: "",
    display: false,
    activeOption: 0,
    filtered: []
  };

  componentDidMount() {
    fetch(`${DATABASE_URL}`)
      .then((response) => response.json())
      .then((data) => {
        const formattedData = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        this.setState({
          usernames: formattedData.map((data) => {
            return data.username;
          }),
        });
      })
      .catch((error) => {
        console.error(error)
      })
  }
  handleNameChange = (name) => {
    if (this.state.display === false) {
      this.setState({
        display: true
      })
    }
    const xname = name.currentTarget.value
    console.log(this.state.usernames)
    let filtered = this.state.usernames
      .filter((usernames) =>
        usernames.toLowerCase().startsWith(xname.toLowerCase())
      )
    console.log(filtered)
    this.setState({
      name: name.currentTarget.value,
      activeOption: -1,
      filtered: filtered
    });
  };
  onKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault()
      this.setState({
        display: false,
        name: this.state.filtered[this.state.activeOption]
      })
    }
    else if (e.keyCode === 38) {
      if (this.state.activeOption < 0) {
        this.setState({
          activeOption: this.state.filtered.length - 1
        })
        return
      } this.setState({ activeOption: this.state.activeOption - 1 })
    }
    else if (e.keyCode === 40) {
      if (this.state.activeOption >= this.state.filtered.length) {
        this.setState({
          activeOption: 0
        })
        return
      } this.setState({ activeOption: this.state.activeOption + 1 })
    }
  }
  render() {
    const self = this
    document.addEventListener("click", function(e) {
      var container = document.getElementById('container')
      if (!container.contains(e.target)) {
        self.setState({
          display: false
        })
      }
    })

    let optionList;
    if (this.state.name !== "" && this.state.display === true) {
      optionList = (
        <div id="autocomplete-list" className="autocomplete-items">
          {
            this.state.filtered.map((username, index) => {
              var name = this.state.name
              var part = username.slice(name.length)
              let className;
              if (index === this.state.activeOption) {
                className = "autocomplete-active"
              } else {
                className = "option"
              }
              return (
                <div className={className} key={index} tabIndex="0"
                  onClick={(name) => this.setState({
                    name: username,
                    display: false
                  })
                  }
                >
                  <span className="bold">{username.charAt(0).toUpperCase() + name.slice(1)}</span><span>{part}</span>
                </div>
              );
            })}
        </div>)
    }

    return (
      <React.Fragment>
        <div id="container">
          <form action="/action_page.php">
            <div className="autocomplete" style={{ width: "300px" }}>
              <input
                type="text"
                id="myInput"
                placeholder="Username"
                value={this.state.name}
                onKeyDown={(e) => this.onKeyDown(e)}
                onChange={(name) => {
                  this.handleNameChange(name);
                }}

              />{" "}
              <input type="submit" />
            </div>
            {optionList}
          </form>
        </div>
      </React.Fragment>
    );
  }
}
